// SubmitRequestController.cls
public with sharing class SubmitRequestController {

    @AuraEnabled
    public static String submitRequest(
        String requestType,
        String email,
        String comment
    ) {
        try {
            Portfolio_Request__c req = new Portfolio_Request__c(
                Request_Type__c   = requestType,
                Email__c          = email,
                Comment__c        = comment,
                Status__c         = 'New',
                Submitted_Date__c = System.today()
            );
            insert req;
            return req.Id;
        } catch (Exception e) {
            throw new AuraHandledException(
                'Failed to submit: ' + e.getMessage()
            );
        }
    }
}

/*
══════════════════════════════════════════════════════════
  CUSTOM OBJECT SETUP  →  Portfolio_Request__c
══════════════════════════════════════════════════════════
  Object API Name : Portfolio_Request__c
  Label           : Portfolio Request

  FIELDS TO CREATE:
  ─────────────────────────────────────────────────────
  Request_Type__c   Picklist   Recruitment|Career Help|Referral|Other
  Email__c          Email
  Comment__c        Long Text Area (32768)
  Status__c         Picklist   New|In Review|Closed
  Submitted_Date__c Date

  GUEST USER PROFILE PERMISSIONS:
  ─────────────────────────────────────────────────────
  Setup → Profiles → [Site Guest Profile]
    Object Settings  → Portfolio_Request__c → CREATE ✓
    Apex Class Access → SubmitRequestController ✓
══════════════════════════════════════════════════════════
*/