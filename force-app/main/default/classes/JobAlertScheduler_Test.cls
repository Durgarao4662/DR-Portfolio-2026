@isTest
public class JobAlertScheduler_Test {

  @testSetup
  static void setupData() {
    String mockJSON = '{"data":[{"job_title":"Dev","employer_name":"Corp","job_city":"Delhi","job_country":"India","job_apply_link":"https://example.com"}]}';

    insert new List<Job_Alert_Subscription__c>{
      new Job_Alert_Subscription__c(
        Email__c            = 'daily@sched.com',
        Frequency__c        = 'Everyday',
        Skills_Extracted__c = 'Java',
        Job_Results_JSON__c = mockJSON,
        Is_Active__c        = true
      ),
      new Job_Alert_Subscription__c(
        Email__c            = 'weekly@sched.com',
        Frequency__c        = 'Weekly',
        Skills_Extracted__c = 'Python',
        Job_Results_JSON__c = mockJSON,
        Is_Active__c        = true
      ),
      new Job_Alert_Subscription__c(
        Email__c     = 'inactive@sched.com',
        Frequency__c = 'Everyday',
        Is_Active__c = false  // Should be excluded
      )
    };
  }

  // Test 1: Scheduler executes without error
  @isTest
  static void testScheduler_Runs() {
    Test.setMock(HttpCalloutMock.class, new MockJobSearchResponse());

    Test.startTest();
      String cronExp = '0 0 8 * * ?';
      System.schedule('Test Job Alert Scheduler', cronExp,
        new JobAlertScheduler());
    Test.stopTest();

    System.assert(true, 'Scheduler should execute without exceptions');
  }

  // Test 2: Direct execute call — daily subscriptions processed
  @isTest
  static void testScheduler_DailyProcessing() {
    Test.setMock(HttpCalloutMock.class, new MockJobSearchResponse());

    Test.startTest();
      new JobAlertScheduler().execute(null);
    Test.stopTest();

    // Verify daily subscriptions were sent
    Job_Alert_Subscription__c daily = [
      SELECT Last_Alert_Sent__c FROM Job_Alert_Subscription__c
      WHERE Email__c = 'daily@sched.com'];
    System.assertNotEquals(null, daily.Last_Alert_Sent__c,
      'Daily subscription should have Last_Alert_Sent__c set');
  }

  // Test 3: Inactive subscriptions should NOT receive emails
  @isTest
  static void testScheduler_InactiveExcluded() {
    Test.setMock(HttpCalloutMock.class, new MockJobSearchResponse());

    Test.startTest();
      new JobAlertScheduler().execute(null);
    Test.stopTest();

    Job_Alert_Subscription__c inactive = [
      SELECT Last_Alert_Sent__c FROM Job_Alert_Subscription__c
      WHERE Email__c = 'inactive@sched.com'];
    System.assertEquals(null, inactive.Last_Alert_Sent__c,
      'Inactive subscriptions should not receive emails');
  }
}
