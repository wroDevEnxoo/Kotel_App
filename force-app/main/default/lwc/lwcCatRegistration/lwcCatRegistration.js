import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import apexSearch from '@salesforce/apex/CustomLookupController.search';
//import insertVisit from '@salesforce/apex/REST_CheckIn.insertVisitProcess';

export default class LwcCatRegistration extends LightningElement {
    @track name;
    @track startDate;
    @track endDate;
    @track targetHotel = {
        name:'sample Name',
        id:'124391290412'
    };
    /* targetHotel powinniśmy dostać od komponentu mapy. 
    powinno to działać tak że na liście wyników wyszukiwania, przy hotelach będzie button,
    który dispatchuje event setTargetHotel z Id i Name hotelu. My to przechwytujemy
    a następnie ustawiamy to w naszym inpucie jako wartość
    */ 
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

   constructor() {
        super();
        //this.template.addEventListener('dataProvider', this.updateComponent());
    }

    handleChange(event) {
        this[event.target.name] = event.target.value;
    }

    handleRegistration(event) {
        const visitId = undefined; //TODO: wywołanie funkcji Kuby
        let [message, variant] = this.getToastParametersForVisit(visitId);
        this.showToast(message, variant);
    }

    getToastParametersForVisit(visitId) {
        let message, variant;
        if (typeof visitId == 'undefined') {
            message = 'Registration failed.';
            variant = 'error';
        } else {
            message = `A cat ${this.name} has booked a visit (ID: ${visitId}) in hotel ${this.targetHotel.name} from ${this.startDate} to ${this.endDate}`;
            variant = 'success';
        }
        return [message, variant];
    }

    showToast(message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Registation result',
                message: message,
                variant: variant,
                mode: 'sticky'
            })
        );
    }

    handleLookupTypeChange(event) {
        this.initialSelection = [];
        this.errors = [];
        this.isMultiEntry = event.target.checked;
    }

    handleSearch(event) {
        const tableNameString = event.target.name;
        const request = {
                            ...event.detail,
                            tableName: tableNameString
                        };
        apexSearch(request)
            .then(results => {
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

    handleSelectionChange() {
        this.errors = [];
    }

    handleSubmit() {
        this.checkForErrors();
        if (this.errors.length === 0) {
            this.notifyUser('Success', 'The form was submitted.', 'success');
        }
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

    notifyUser(title, message, variant) {
        if (this.notifyViaAlerts) {
            // Notify via alert
            // eslint-disable-next-line no-alert
            alert(`${title}\n${message}`);
        } else {
            // Notify via toast
            const toastEvent = new ShowToastEvent({ title, message, variant });
            this.dispatchEvent(toastEvent);
        }
    }

}