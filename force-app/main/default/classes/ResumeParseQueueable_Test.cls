@isTest
public class ResumeParseQueueable_Test {

  @testSetup
  static void setupData() {
    Job_Alert_Subscription__c sub = new Job_Alert_Subscription__c(
      Email__c     = 'resume@test.com',
      Frequency__c = 'Everyday',
      Is_Active__c = true
    );
    insert sub;

    ContentVersion cv = new ContentVersion(
      Title          = 'Resume',
      PathOnClient   = 'resume.pdf',
      VersionData    = Blob.valueOf('PDF content'),
      IsMajorVersion = true
    );
    insert cv;
  }

  // Test 1: Successful parse — skills extracted and saved
  @isTest
  static void testResumeParse_Success() {
    Job_Alert_Subscription__c sub = [
      SELECT Id FROM Job_Alert_Subscription__c LIMIT 1];
    ContentVersion cv = [
      SELECT ContentDocumentId FROM ContentVersion LIMIT 1];

    Test.setMock(HttpCalloutMock.class, new MockResumeParserResponse());
    Test.startTest();
      System.enqueueJob(
        new ResumeParseQueueable(sub.Id, cv.ContentDocumentId));
    Test.stopTest();

    Job_Alert_Subscription__c updated = [
      SELECT Skills_Extracted__c FROM Job_Alert_Subscription__c
      WHERE Id = :sub.Id];
    System.assertNotEquals(null, updated.Skills_Extracted__c,
      'Skills should be populated after parse');
    System.assert(updated.Skills_Extracted__c.contains('Java'),
      'Skills should include Java from mock response');
  }

  // Test 2: API failure — should not throw, handle gracefully
  @isTest
  static void testResumeParse_APIFailure() {
    Job_Alert_Subscription__c sub = [SELECT Id FROM Job_Alert_Subscription__c LIMIT 1];
    ContentVersion cv = [SELECT ContentDocumentId FROM ContentVersion LIMIT 1];

    // Simulate 500 Internal Server Error from API
    Test.setMock(HttpCalloutMock.class, new MockJobSearchResponse(500));
    Test.startTest();
      System.enqueueJob(
        new ResumeParseQueueable(sub.Id, cv.ContentDocumentId));
    Test.stopTest();

    // Skills should remain null — no crash
    Job_Alert_Subscription__c updated = [
      SELECT Skills_Extracted__c FROM Job_Alert_Subscription__c
      WHERE Id = :sub.Id];
    System.assertEquals(null, updated.Skills_Extracted__c,
      'Skills should remain null on API failure');
  }
}