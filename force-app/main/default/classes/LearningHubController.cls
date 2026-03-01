/**
 * LearningHubController
 * ─────────────────────────────────────────────────────────────
 * Apex controller for the learningHub LWC component.
 * Queries all active Learning_Material__mdt Custom Metadata records,
 * ordered by Sort_Order__c, and returns them to the component via wire.
 *
 * Custom Metadata Type: Learning_Material__mdt
 *
 * Fields required on the CMT:
 *   Title__c             Text(255)       — display title
 *   Description__c       Long Text Area  — card description
 *   Category__c          Text(100)       — matches CATEGORIES in JS
 *   Icon_Emoji__c        Text(10)        — emoji icon e.g. "📄"
 *   Difficulty__c        Picklist        — Beginner | Intermediate | Advanced
 *   File_Type__c         Picklist        — PDF | DOCX | XLSX | PPTX | VIDEO | LINK | MD
 *   File_Size__c         Text(20)        — e.g. "2.3 MB"
 *   File_URL__c          URL             — direct download / view link
 *   Tags__c              Text(255)       — comma-separated tags
 *   Author__c            Text(255)       — author name
 *   Download_Count__c    Number(6,0)     — cumulative download counter
 *   Is_Featured__c       Checkbox        — true = highlighted featured card
 *   Is_Active__c         Checkbox        — false = hidden from UI
 *   Sort_Order__c        Number(3,0)     — ascending display order
 *
 * ─────────────────────────────────────────────────────────────
 */
public with sharing class LearningHubController {

    /**
     * Returns all active Learning_Material__mdt records,
     * sorted by Sort_Order__c ascending.
     * Cacheable so the LWC @wire adapter can cache results client-side.
     */
    @AuraEnabled(cacheable=true)
    public static List<Learning_Material__mdt> getMaterials() {
        return [
            SELECT
                Id,
                DeveloperName,
                MasterLabel,
                Title__c,
                Description__c,
                Category__c,
                Icon_Emoji__c,
                Difficulty__c,
                File_Type__c,
                File_Size__c,
                File_URL__c,
                Tags__c,
                Author__c,
                Download_Count__c,
                Is_Featured__c,
                Is_Active__c,
                Sort_Order__c
            FROM Learning_Material__mdt
            WHERE Is_Active__c = true
            ORDER BY Sort_Order__c ASC NULLS LAST, MasterLabel ASC
        ];
    }

    /**
     * Lightweight method to fetch materials by a specific category.
     * Useful if you want to lazy-load individual tabs.
     */
    @AuraEnabled(cacheable=true)
    public static List<Learning_Material__mdt> getMaterialsByCategory(String category) {
        if (String.isBlank(category) || category == 'all') {
            return getMaterials();
        }
        return [
            SELECT
                Id,
                DeveloperName,
                MasterLabel,
                Title__c,
                Description__c,
                Category__c,
                Icon_Emoji__c,
                Difficulty__c,
                File_Type__c,
                File_Size__c,
                File_URL__c,
                Tags__c,
                Author__c,
                Download_Count__c,
                Is_Featured__c,
                Is_Active__c,
                Sort_Order__c
            FROM Learning_Material__mdt
            WHERE Is_Active__c = true
              AND Category__c  = :category
            ORDER BY Sort_Order__c ASC NULLS LAST, MasterLabel ASC
        ];
    }
}