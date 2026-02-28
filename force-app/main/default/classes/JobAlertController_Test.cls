@isTest
public class JobAlertController_Test {
  @isTest static void testCreateSubscription() {
    // Create a mock ContentVersion for file
    ContentVersion cv = new ContentVersion(
      Title       = 'TestResume',
      PathOnClient = 'resume.pdf',
      VersionData = Blob.valueOf('dummy pdf content'),
      IsMajorVersion = true
    );
    insert cv;
    ContentVersion inserted = [SELECT ContentDocumentId FROM ContentVersion
                               WHERE Id = :cv.Id];


    Test.startTest();
    JobAlertController.createSubscription(
      'test@example.com', 'Everyday',
      inserted.ContentDocumentId
    );
    Test.stopTest();


    Job_Alert_Subscription__c sub = [
      SELECT Email__c, Frequency__c FROM Job_Alert_Subscription__c
      WHERE Email__c = 'test@example.com' LIMIT 1];
    System.assertEquals('Everyday', sub.Frequency__c);
  }
}