/**
 * Created by Bartlomiej.Kmiecik on 25.02.2020.
 */


@RestResource(urlMapping='/api/v1/hotels/*')
global with sharing class REST_Hotels {

    private static final String REST_PARAM_HOTEL_ID = 'hotelId';

    @HttpGet
    global static List<Hotel__c> getHotels() {
        RestRequest request = RestContext.request;

        String hotelId = request.params.containsKey(REST_PARAM_HOTEL_ID)
                ? request.params.get(REST_PARAM_HOTEL_ID)
                : null;

        if (REST_Utils.isValidId(hotelId, REST_Utils.sObjectTypeHotel)) {
            return [SELECT Id, Name FROM Hotel__c WHERE Id = :hotelId];
        } else {
            return [SELECT Id, Name FROM Hotel__c];
        }
    }
}