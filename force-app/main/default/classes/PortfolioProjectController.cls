public with sharing class PortfolioProjectController {
    @AuraEnabled(cacheable=true)
    public static List<Portfolio_Project__mdt> getProjects() {
        return [
            SELECT Id, MasterLabel, Project_Title__c, Client_Name__c,
                   Client_Industry__c, Description__c, Technologies_Used__c,
                   Project_Year__c, Accent_Color__c, Logo_Initials__c,
                   Sort_Order__c
            FROM Portfolio_Project__mdt
            ORDER BY Sort_Order__c ASC
        ];
    }
}