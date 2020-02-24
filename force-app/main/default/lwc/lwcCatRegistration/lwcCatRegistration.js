import { LightningElement, api } from 'lwc';

export default class LwcCatRegistration extends LightningElement {
    @api name;
    @api startDate;
    @api endDate;
    @api targetHotel = {
        name:'sample Name',
        id:'124391290412'
    };
    /* targetHotel powinniśmy dostać od komponentu mapy. 
    powinno to działać tak że na liście wyników wyszukiwania, przy hotelach będzie button,
    który dispatchuje event setTargetHotel z Id i Name hotelu. My to przechwytujemy
    a następnie ustawiamy to w naszym inpucie jako wartość
    */ 

    handleChange(event) {
        this[event.target.name] = event.target.value;
    }

    handleRegistration(event) {
        
    }
}