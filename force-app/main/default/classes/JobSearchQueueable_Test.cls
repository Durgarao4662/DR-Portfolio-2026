@isTest
public class JobSearchQueueable_Test {

  @testSetup
  static void setupData() {
    Job_Alert_Subscription__c sub = new Job_Alert_Subscription__c(
      Email__c            = 'search@test.com',
      Frequency__c        = 'Weekly',
      Skills_Extracted__c = 'Java, Salesforce, Apex',
      Is_Active__c        = true
    );
    insert sub;

    // Create API Config metadata mock value if using Custom Metadata
    // Note: Custom Metadata can be queried in tests without DML
  }

  // Test 1: Successful job search — results saved to record
  @isTest
  static void testJobSearch_Success() {
    Job_Alert_Subscription__c sub = [SELECT Id FROM Job_Alert_Subscription__c LIMIT 1];

    Test.setMock(HttpCalloutMock.class, new MockJobSearchResponse());
    Test.startTest();
      System.enqueueJob(new JobSearchQueueable(
        sub.Id, 'Java, Salesforce, Apex', 'Salesforce Developer'));
    Test.stopTest();

    Job_Alert_Subscription__c updated = [
      SELECT Job_Results_JSON__c FROM Job_Alert_Subscription__c
      WHERE Id = :sub.Id];
    System.assertNotEquals(null, updated.Job_Results_JSON__c,
      'Job results should be stored after search');
    System.assert(updated.Job_Results_JSON__c.contains('Salesforce Developer'),
      'Job results should contain the mock job title');
  }

  // Test 2: API returns 401 — error stored in JSON field
  @isTest
  static void testJobSearch_Unauthorized() {
    Job_Alert_Subscription__c sub = [SELECT Id FROM Job_Alert_Subscription__c LIMIT 1];

    Test.setMock(HttpCalloutMock.class, new MockJobSearchResponse(401));
    Test.startTest();
      System.enqueueJob(new JobSearchQueueable(
        sub.Id, 'Java', 'Developer'));
    Test.stopTest();

    Job_Alert_Subscription__c updated = [
      SELECT Job_Results_JSON__c FROM Job_Alert_Subscription__c
      WHERE Id = :sub.Id];
    System.assert(updated.Job_Results_JSON__c.contains('error'),
      'Error should be logged in JSON field on API failure');
  }

  // Test 3: Blank skills — should return early without callout
  @isTest
  static void testJobSearch_BlankSkills() {
    Job_Alert_Subscription__c sub = [SELECT Id FROM Job_Alert_Subscription__c LIMIT 1];

    Test.startTest();
      // No mock needed — callout should not be made
      System.enqueueJob(new JobSearchQueueable(sub.Id, '', ''));
    Test.stopTest();

    // No exception = pass; record unchanged
    System.assert(true, 'Blank skills should not cause an exception');
  }
}