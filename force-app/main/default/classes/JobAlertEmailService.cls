public class JobAlertEmailService {


  public static void sendAlerts(List<Job_Alert_Subscription__c> subs) {
    List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();


    for (Job_Alert_Subscription__c sub : subs) {
      if (sub.Job_Results_JSON__c == null) continue;


      // Parse stored job results
      Map<String,Object> result = (Map<String,Object>)
          JSON.deserializeUntyped(sub.Job_Results_JSON__c);
      List<Object> jobs = (List<Object>) result.get('data');


      // Build email body HTML
      String body = '<h2>Your Personalized Job Alerts</h2>';
      body += '<p>Based on your skills: <strong>' + sub.Skills_Extracted__c + '</strong></p>';
      body += '<hr/>';


      Integer count = 0;
      for (Object jobObj : jobs) {
        if (count >= 10) break;
        Map<String,Object> job = (Map<String,Object>) jobObj;
        body += '<div style="margin-bottom:16px;padding:12px;border:1px solid #ddd">';
        body += '<h3>' + job.get('job_title') + '</h3>';
        body += '<p><strong>' + job.get('employer_name') + '</strong></p>';
        body += '<p>' + job.get('job_city') + ', ' + job.get('job_country') + '</p>';
        body += '<a href="' + job.get('job_apply_link') + '">Apply Now</a>';
        body += '</div>';
        count++;
      }


      Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
      email.setToAddresses(new List<String>{ sub.Email__c });
      email.setSubject('Your ' + sub.Frequency__c + ' Job Alerts');
      email.setHtmlBody(body);
      email.setSenderDisplayName('Job Alert Service');
      emails.add(email);
    }


    if (!emails.isEmpty()) {
      Messaging.sendEmail(emails);
      // Update last sent timestamp
      List<Job_Alert_Subscription__c> toUpdate = new List<Job_Alert_Subscription__c>();
      for (Job_Alert_Subscription__c sub : subs) {
        toUpdate.add(new Job_Alert_Subscription__c(
          Id = sub.Id, Last_Alert_Sent__c = DateTime.now()));
      }
      update toUpdate;
    }
  }
}
