import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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


}