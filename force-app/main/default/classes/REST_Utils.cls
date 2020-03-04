/**
 * Created by Bartlomiej.Kmiecik on 25.02.2020.
 */

global without sharing class REST_Utils {

    global class IntegrationException extends Exception {}

    public static final String REST_PARAM_CAT_OWNER_ID = 'catOwnerId';
    public static final String REST_PARAM_HOTEL_ID = 'hotelId';

    public static SObjectType sObjectTypeCatOwner = Schema.Owner__c.SObjectType;
    public static SObjectType sObjectTypeHotel = Schema.Hotel__c.SObjectType;

    public static Boolean isValidId(String hotelId, SObjectType sObjectType){
        if(hotelId == null){
            return false;
        } else if(Id.valueOf(hotelId).getSobjectType() == sObjectType){
            throw new IntegrationException(Label.InvalidId + '[' + sObjectType.class.getName() + ']');
        } else {
            return true;
        }
    }

    public static void setResponse(RestResponse res, Integer statusCode, Object responseBodyObject) {
        res.addHeader('Content-Type', 'application/json');
        res.statusCode = statusCode;
        res.responseBody = Blob.valueOf(JSON.serialize(responseBodyObject));
    }

    
}