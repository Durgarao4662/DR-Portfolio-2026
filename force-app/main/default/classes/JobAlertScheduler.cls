global class JobAlertScheduler implements Schedulable {


  global void execute(SchedulableContext sc) {
    String freq = determineFrequencyToProcess();


    List<Job_Alert_Subscription__c> subs = [
      SELECT Id, Email__c, Frequency__c,
             Skills_Extracted__c, Job_Results_JSON__c
      FROM   Job_Alert_Subscription__c
      WHERE  Is_Active__c = true
      AND    Frequency__c = :freq
      LIMIT  200
    ];


    if (!subs.isEmpty()) {
      // Refresh job results then send
      for (Job_Alert_Subscription__c sub : subs) {
        System.enqueueJob(
          new JobSearchQueueable(sub.Id,
              sub.Skills_Extracted__c, ''));
      }
      JobAlertEmailService.sendAlerts(subs);
    }
  }


  // Returns 'Everyday' when called daily, 'Weekly' only on Mondays
  private String determineFrequencyToProcess() {
    Integer dow = Date.today().toStartOfWeek().daysBetween(Date.today());
    return (dow == 1) ? 'Weekly' : 'Everyday';
  }
}