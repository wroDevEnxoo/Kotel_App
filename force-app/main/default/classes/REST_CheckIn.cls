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

        if(String.isNotBlank(req.requestBody.toString())){
            Integer statusCode = insertVisitProcess(req.requestBody.toString());

            if(statusCode == 200){
                REST_Utils.setResponse(res, statusCode, 'Inserted correctly');
            }else if(statusCode == 400){
                REST_Utils.setResponse(res, statusCode, 'Bad request');
            }else if(statusCode == 406){
                REST_Utils.setResponse(res, statusCode, 'Cat has different reservation at given time');
            }
        }else{
            REST_Utils.setResponse(res, 400, 'Bad request');
        }
    }

    @HttpPut
    global static void putVisitStatus(){
        
    }

    @AuraEnabled
    public static Integer insertVisitProcess(String visitDataJson){
        List<Map<String,String>> visitDataList = (List<Map<String,String>>) JSON.deserialize(visitDataJson, List<Map<String,String>>.class);
        Integer statusCode = 200;
        if(visitDataList != null && !visitDataList.isEmpty()){

            List<Visit__c> visitList = convertMaps2ObjectList(visitDataList);
            List<Visit__c> visits2Insert = validateIfCatsCanCheckIn(visitList);

            if(visits2Insert != null && !visits2Insert.isEmpty()){
                try{
                    insert visits2Insert;
                } catch(Exception ex){
                    System.debug(ex.getMessage());
                }
            }else{
                statusCode = 406;
            }
        }else {
            statusCode = 400; 
        }

        return statusCode;
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

    public static List<Visit__c> convertMaps2ObjectList(List<Map<String,String>> sourceListOfMap){
        List<Visit__c> visitList = new List<Visit__c>();

        for(Map<String,String> visitData : sourceListOfMap){
            Visit__c visit2Insert = createFilledVisit(visitData);
            visitList.add(visit2Insert);
        }
        return visitList;
    }

    public static List<Visit__c> validateIfCatsCanCheckIn(List<Visit__c> visitList){
        List<Visit__c> visits2Insert = new List<Visit__c>();
        Set<Id> catsIdSet = new Set<Id>();

        for(Visit__c visit : visitList){
            catsIdSet.add(visit.Cat__c);
        }
        
        List<Visit__c> allVisitsOfCats = [SELECT Id, Cat__c FROM Visit__c WHERE Cat__c IN : catsIdSet AND Start_Date__c > :System.TODAY() AND End_Date__c > :System.TODAY()];

        Map<Id, List<Visit__c>> cat2VisitListMap = new Map<Id, List<Visit__c>>();
        for(Visit__c visit : allVisitsOfCats){
            if(cat2VisitListMap.containsKey(visit.Cat__c)){
                cat2VisitListMap.get(visit.Cat__c).add(visit);
            }else{
                List<Visit__c> catsVisit = new List<Visit__c>();
                catsVisit.add(visit);
                cat2VisitListMap.put(visit.Cat__c, catsVisit);
            }
        }

        for(Visit__c newVisit : visitList){
            if(!cat2VisitListMap.containsKey(newVisit.Cat__c)){
                visits2Insert.add(newVisit);
            }else{
                List<Visit__c> allVisitsOfCat = cat2VisitListMap.get(newVisit.Cat__c);
                for(Visit__c visitFromSystem : allVisitsOfCat){
                    if(!areVisitsOverlap(newVisit, visitFromSystem)){
                        visits2Insert.add(newVisit);
                    }
                }
            }
        }
        return visits2Insert;
    }

    public static Boolean areVisitsOverlap(Visit__c newVisit, Visit__c fetchedVisit){
        if(newVisit.Start_Date__c < fetchedVisit.Start_Date__c){
            if(newVisit.Start_Date__c.daysBetween(fetchedVisit.Start_Date__c) > newVisit.Start_Date__c.daysBetween(newVisit.End_Date__c)){
                return true;
            }else{
                return false; 
            }
        }else{
            if(fetchedVisit.Start_Date__c.daysBetween(newVisit.Start_Date__c) > fetchedVisit.Start_Date__c.daysBetween(fetchedVisit.End_Date__c)){
                return true;
            }else{
                return false; 
            }
        }
    }


}