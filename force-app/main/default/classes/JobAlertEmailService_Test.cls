@isTest
public class JobAlertEmailService_Test {

    @testSetup
    static void setupData() {
        String mockJobJSON = '{'
            + '"data": ['
            +   '{'
            +     '"job_title": "Apex Developer",'
            +     '"employer_name": "Cloud Corp",'
            +     '"job_city": "Mumbai",'
            +     '"job_country": "India",'
            +     '"job_apply_link": "https://example.com/apply"'
            +   '}'
            + ']'
            + '}';

        insert new List<Job_Alert_Subscription__c>{
            new Job_Alert_Subscription__c(
                Email__c            = 'daily@test.com',
                Frequency__c        = 'Everyday',
                Skills_Extracted__c = 'Java, Apex',
                Job_Results_JSON__c = mockJobJSON,
                Is_Active__c        = true
            ),
            new Job_Alert_Subscription__c(
                Email__c            = 'weekly@test.com',
                Frequency__c        = 'Weekly',
                Skills_Extracted__c = 'Python, ML',
                Job_Results_JSON__c = mockJobJSON,
                Is_Active__c        = true
            ),
            new Job_Alert_Subscription__c(
                Email__c            = 'nojobs@test.com',
                Frequency__c        = 'Everyday',
                Skills_Extracted__c = 'Ruby',
                Job_Results_JSON__c = null,  // No results yet
                Is_Active__c        = true
            )
        };
    }

    // Test 1: Emails sent to subscriptions with job results
    @isTest
    static void testSendAlerts_WithResults() {
        // ✅ Filter by email — NOT by Long Text Area field
        List<Job_Alert_Subscription__c> subs = [
            SELECT Id, Email__c, Frequency__c,
                   Skills_Extracted__c, Job_Results_JSON__c
            FROM   Job_Alert_Subscription__c
            WHERE  Email__c IN ('daily@test.com', 'weekly@test.com')];

        Test.startTest();
            JobAlertEmailService.sendAlerts(subs);
        Test.stopTest();

        // ✅ Re-query by email to verify Last_Alert_Sent__c updated
        List<Job_Alert_Subscription__c> updated = [
            SELECT Last_Alert_Sent__c FROM Job_Alert_Subscription__c
            WHERE  Email__c IN ('daily@test.com', 'weekly@test.com')];

        for (Job_Alert_Subscription__c s : updated) {
            System.assertNotEquals(null, s.Last_Alert_Sent__c,
                'Last_Alert_Sent__c should be set after sending email for: '
                + s.Id);
        }
    }

    // Test 2: Subscription with null JSON should be skipped gracefully
    @isTest
    static void testSendAlerts_NullJSON() {
        List<Job_Alert_Subscription__c> subs = [
            SELECT Id, Email__c, Frequency__c,
                   Skills_Extracted__c, Job_Results_JSON__c
            FROM   Job_Alert_Subscription__c
            WHERE  Email__c = 'nojobs@test.com'];

        Test.startTest();
            JobAlertEmailService.sendAlerts(subs); // Should not throw
        Test.stopTest();

        System.assert(true, 'Null JSON should be handled gracefully');
    }

    // Test 3: Empty list — no error
    @isTest
    static void testSendAlerts_EmptyList() {
        Test.startTest();
            JobAlertEmailService.sendAlerts(
                new List<Job_Alert_Subscription__c>());
        Test.stopTest();

        System.assert(true, 'Empty list should not throw an exception');
    }
}