public with sharing class JobAlertController {

    @AuraEnabled(cacheable=false)
    public static void createSubscription(
            String email, String frequency, String fileId) {

        // --- Input Validation ---
        if (String.isBlank(email)) {
            throw new AuraHandledException('Email address is required.');
        }
        if (String.isBlank(frequency)) {
            throw new AuraHandledException('Frequency selection is required.');
        }
        if (String.isBlank(fileId)) {
            throw new AuraHandledException('Please upload your resume before submitting.');
        }

        try {
            // 1. Upsert subscription record by Email
            // IMPORTANT: Email__c must be marked as 'External ID' in
            // Object Manager > Job_Alert_Subscription__c > Fields > Email__c
            // otherwise this upsert will throw a runtime error.
            Job_Alert_Subscription__c sub = new Job_Alert_Subscription__c(
                Email__c          = email.trim().toLowerCase(),
                Frequency__c      = frequency,
                Resume_File_Id__c = fileId,
                Is_Active__c      = true
            );
            upsert sub Email__c;

            // 2. Kick off async resume parsing
            // Note: fileId here is the ContentDocumentId from the LWC
            // file upload component (files[0].documentId)
            if (sub.Id != null) {
                System.enqueueJob(new ResumeParseQueueable(sub.Id, fileId));
            } else {
                throw new AuraHandledException(
                    'Subscription record was not created. Please try again.');
            }

        } catch (DmlException e) {
            throw new AuraHandledException(
                'Failed to save subscription: ' + e.getDmlMessage(0));
        } catch (AuraHandledException e) {
            throw e; // Re-throw AuraHandledExceptions as-is
        } catch (Exception e) {
            throw new AuraHandledException(
                'An unexpected error occurred: ' + e.getMessage());
        }
    }
    @AuraEnabled(cacheable=false)
public static void uploadResumeAndSubscribe(
        String email,     String frequency,
        String base64Data, String fileName, String fileType) {

    if (String.isBlank(email))      throw new AuraHandledException('Email is required.');
    if (String.isBlank(frequency))  throw new AuraHandledException('Frequency is required.');
    if (String.isBlank(base64Data)) throw new AuraHandledException('Resume file is required.');

    try {
        // Step 1: Create the file as ContentVersion (runs in system context)
        ContentVersion cv = new ContentVersion(
            Title          = 'Resume_' + email.replace('@','_').replace('.','_'),
            PathOnClient   = fileName,
            VersionData    = EncodingUtil.base64Decode(base64Data),
            IsMajorVersion = true
        );
        // without sharing inner class needed for guest insert
        GuestFileInserter.insertCV(cv);

        // Step 2: Get the ContentDocumentId
        ContentVersion inserted = [
            SELECT ContentDocumentId FROM ContentVersion
            WHERE Id = :cv.Id LIMIT 1];

        // Step 3: Upsert subscription record
        Job_Alert_Subscription__c sub = new Job_Alert_Subscription__c(
            Email__c          = email.trim().toLowerCase(),
            Frequency__c      = frequency,
            Resume_File_Id__c = inserted.ContentDocumentId,
            Is_Active__c      = true
        );
        upsert sub Email__c;

        // Step 4: Enqueue resume parsing
        System.enqueueJob(new ResumeParseQueueable(
            sub.Id, inserted.ContentDocumentId));

    } catch (AuraHandledException e) {
        throw e;
    } catch (Exception e) {
        throw new AuraHandledException('Upload failed: ' + e.getMessage());
    }
}
}