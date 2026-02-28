public without sharing class WebsiteVisitController {

    @AuraEnabled
    public static Integer updateAndGetVisitCount() {

        List<Website_Visit__c> visitList = [
            SELECT Id, Visit_Count__c
            FROM Website_Visit__c
            LIMIT 1
            FOR UPDATE
        ];

        Website_Visit__c visitRec;

        if(visitList.isEmpty()){
            // create record automatically
            visitRec = new Website_Visit__c();
            visitRec.Visit_Count__c = 0;
            insert visitRec;
        }else{
            visitRec = visitList[0];
        }

        visitRec.Visit_Count__c = (visitRec.Visit_Count__c == null ? 0 : visitRec.Visit_Count__c) + 1;

        update visitRec;

        return Integer.valueOf(visitRec.Visit_Count__c);
    }
}