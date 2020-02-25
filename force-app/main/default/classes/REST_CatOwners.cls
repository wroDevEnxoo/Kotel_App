/**
 * Created by Bartlomiej.Kmiecik on 25.02.2020.
 */

@RestResource(urlMapping='/api/v1/cat-owners/*')
global with sharing class REST_CatOwners {


    @HttpGet
    global static List<Owner__c> getCatOwners() {


        RestRequest request = RestContext.request;

        String catOwnerId = request.params.containsKey(REST_Utils.REST_PARAM_CAT_OWNER_ID)
                ? request.params.get(REST_Utils.REST_PARAM_CAT_OWNER_ID)
                : null;

        if (REST_Utils.isValidId(catOwnerId, REST_Utils.sObjectTypeCatOwner)) {
            return [SELECT Id, Name FROM Owner__c WHERE Id = :catOwnerId];
        } else {
            return [SELECT Id, Name FROM Owner__c];
        }
    }
}