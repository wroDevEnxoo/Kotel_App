import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import apexSearch from '@salesforce/apex/CustomLookupController.search';
import insertVisit from '@salesforce/apex/REST_CheckIn.insertVisitProcess';
// import { getObjectInfo } from 'lightning/uiObjectInfoApi';
// import CAT_OBJECT from '@salesforce/schema/Cat__c';
// import CAT_OBJECT_NAME from '@salesforce/schema/Cat__c.Name';
// import HOTEL_OBJECT from '@salesforce/schema/Hotel__c';
// import HOTEL_OBJECT_NAME from '@salesforce/schema/Hotel__c.Name';

export default class LwcCatRegistration extends LightningElement {
    @track cat;
    /* hotel powinniśmy dostać od komponentu mapy. 
    powinno to działać tak że na liście wyników wyszukiwania, przy hotelach będzie button,
    który dispatchuje event setTargetHotel z Id i Name hotelu. My to przechwytujemy
    a następnie ustawiamy to w naszym inpucie jako wartość
    */ 
    @track hotel;
    @track startDate;
    @track endDate;
    @track isMultiEntry = false;
    @track initialSelection = [
        {
            id: 'na',
            sObjectType: 'na',
            icon: 'standard:lightning_component',
            title: 'Inital selection',
            subtitle: 'Not a valid record'
        }
    ];
    @track errors = [];
    @track today = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;

    // @track catLabel = '';

    // @wire(getObjectInfo, { objectApiName: CAT_OBJECT })
    //     wiredOI({err, data}) {
    //         if (err) {
    //             console.error(err);
    //         }
    //         if (data) {
    //             this.fieldLabel = data.fields[CAT_OBJECT_NAME.fieldApiName].label
    //         }
    //     }

   constructor() {
        super();
        //this.template.addEventListener('dataProvider', this.updateComponent());
    }

    checkForErrors() {
        const selection = this.template
            .querySelector('c-lookup')
            .getSelection();
        if (selection.length === 0) {
            this.errors = [
                { message: 'You must make a selection before submitting!' },
                { message: 'Please make a selection and try again.' }
            ];
        } else {
            this.errors = [];
        }
    }

    handleChange(event) {
        this[event.target.name] = event.target.value;
    }

    async handleRegistration(event) {
        const request = {visitDataJson: JSON.stringify([{Cat: this.cat.id, Hotel: this.hotel.id, StartDate: this.startDate, EndDate: this.endDate}])};
        console.log('request: ' + JSON.stringify(request));
        const visitId = await insertVisit(request).catch(err => {console.log(err)});
        let [message, variant] = this.getToastParametersForVisit(visitId);
        this.notifyUser('Registration result', message, variant);
    }

    handleSearch(event) {
        console.log('search');
        console.log(JSON.stringify(event.detail));
        const tableNameString = event.target.name;
        const request = {
                            ...event.detail,
                            tableName: tableNameString
                        };
        apexSearch(request)
            .then(results => {
                console.log(JSON.stringify(results));
                if (tableNameString==="Cat__c") {
                    this.template
                    .querySelectorAll('c-lookup')[0]
                    .setSearchResults(results);
                } else {
                    this.template
                    .querySelectorAll('c-lookup')[1]
                    .setSearchResults(results);
                }
            })
            .catch(error => {
                this.notifyUser(
                    'Lookup Error',
                    'An error occured while searching with the lookup field: ',
                    'error'
                );
                // eslint-disable-next-line no-console
                console.error('Lookup error', JSON.stringify(error));
                this.errors = [error];
            });
    }

    handleSelectionChange(event) {
        this.errors = [];
        const tableNameString = event.target.name;
        console.log('selection');
        console.log(JSON.stringify(event.detail));
        if (tableNameString==="Cat__c") {
            this.cat = event.detail.selectedItem;
        } else {
            this.hotel = event.detail.selectedItem;
        }
    }
    
    getToastParametersForVisit(visitId) {
        let message, variant;
        console.log('visitId: ' + visitId);
        switch (visitId) {
            case 400:
                message = 'Registration failed. Bad request';
                variant = 'error';
                break;
            case 406:
                message = 'Registration failed. Cat has different reservation at given time';
                variant = 'error';
                break;
            case 200:
                message = `A cat ${this.cat.title} has booked a visit (ID: ${visitId}) in hotel ${this.hotel.title} from ${this.startDate} to ${this.endDate}`;
                variant = 'success';
                break;
            default:
                message = `Unknown error: ${visitId}`;
                variant = 'error';
          }

        return [message, variant];
    }

    // getToastParametersForVisit(visitId) {
    //     let message, variant;
    //     if (typeof visitId == 'undefined') {
    //         message = 'Registration failed.';
    //         variant = 'error';
    //     } else {
    //         message = `A cat ${this.cat.title} has booked a visit (ID: ${visitId}) in hotel ${this.hotel.title} from ${this.startDate} to ${this.endDate}`;
    //         variant = 'success';
    //     }
    //     return [message, variant];
    // }

    notifyUser(title, message, variant) {
        const toastEvent = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(toastEvent);
    }
}