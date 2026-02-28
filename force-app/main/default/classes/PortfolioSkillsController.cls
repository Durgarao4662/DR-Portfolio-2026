public with sharing class PortfolioSkillsController {

    @AuraEnabled(cacheable=true)
    public static List<Portfolio_Skill__mdt> getSkills() {
        return [
            SELECT MasterLabel, Skill_Name__c, Category__c,
                   Proficiency__c, Proficiency_Percent__c, Sort_Order__c,
                   Icon_Emoji__c, Category_Color__c
            FROM Portfolio_Skill__mdt
            ORDER BY Category__c ASC, Sort_Order__c ASC
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Portfolio_Certification__mdt> getCertifications() {
        return [
            SELECT MasterLabel, Cert_Name__c, Issuer__c,
                   Credential_ID__c, Issue_Date__c, Logo_URL__c,
                   Badge_Color__c, Cert_URL__c, Sort_Order__c
            FROM Portfolio_Certification__mdt
            ORDER BY Sort_Order__c ASC
        ];
    }
}