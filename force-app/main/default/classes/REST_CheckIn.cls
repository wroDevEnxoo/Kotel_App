@RestResource(urlMapping='/v1/checkin')
global with sharing class REST_CheckIn{

    private static final Map<String,String> visitFieldMapping = new Map<String,String>{
        'Cat' => 'Cat__c', 
        'Hotel' => 'Hotel__c',
        'StartDate' => 'Start_Date__c',
        'EndDate' => 'End_Date__c'
    };


    @HttpPost
    global static void postVisit(){
        RestResponse res = RestContext.response;
        RestRequest req = RestContext.request;

        List<Map<String,String>> visitDataList;
        List<Visit__c> visitList2Insert = new List<Visit__c>();

        if(String.isNotBlank(req.requestBody.toString())){
            visitDataList = (List<Map<String,String>>)JSON.deserialize(req.requestBody.toString(), List<Map<String,String>>.class);
        }

        for(Map<String,String> visitData : visitDataList){
            Visit__c visit2Insert = createFilledVisit(visitData);
            visitList2Insert.add(visit2Insert);
        }

        try{
            insert visitList2Insert;
        } catch(Exception ex){
            System.debug(ex.getMessage());
        } 
    }


    public static Visit__c createFilledVisit(Map<String,String> sourceMap){
        
        Visit__c visit = new Visit__c(
            Cat__c = sourceMap.get('Cat'),
            Hotel__c = sourceMap.get('Hotel'),
            Start_Date__c = Date.valueOf(sourceMap.get('StartDate')),
            End_Date__c = Date.valueOf(sourceMap.get('EndDate'))
        );
        return visit;
    }


}