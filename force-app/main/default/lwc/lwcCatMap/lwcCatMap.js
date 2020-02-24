import { LightningElement } from 'lwc';

export default class LightningExampleMapComplexExample extends LightningElement {
    mapMarkers = [
        {
            location: {
                Street: 'Plac Grunwaldzki 6A',
                City: 'Wrocław',
                PostalCode: '50-384',
                State: 'Dolnośląskie',
                Country: 'PL',
            },

            icon: 'utility:salesforce1',
            title: 'MRUCZEK',
            description: 'NAJSILNIEJSZY KOCUR NA SWIECIE TU ŚPI',
        },
        {
            location: {
                Street: 'Jaracza 32',
                City: 'Wrocław',
                PostalCode: '50-305',
                State: 'Dolnośląskie',
                Country: 'PL',
            },

            icon: 'utility:salesforce2',
            title: 'KOT GIGANT',
            description: 'KUWETA KOTA GIGANTA',
        },
    ];

    center = {
        location: {
            City: 'Wrocław',
        },
    };

    zoomLevel = 13;
    markersTitle = 'KOTY DO ROBOTY';
    showFooter = true;
    listView = 'visible';
}
