public class ResumeParseQueueable implements Queueable, Database.AllowsCallouts {
  private String subscriptionId;
  private String fileId;


  public ResumeParseQueueable(String subId, String fileId) {
    this.subscriptionId = subId;
    this.fileId = fileId;
  }


  public void execute(QueueableContext ctx) {
    // Step A: Retrieve the file blob from ContentVersion
    ContentVersion cv = [SELECT VersionData, FileExtension
                         FROM ContentVersion
                         WHERE ContentDocumentId = :fileId
                         LIMIT 1];


    String base64File = EncodingUtil.base64Encode(cv.VersionData);
    String fileExt    = cv.FileExtension.toLowerCase();


    // Step B: Call Resume Parser API (Affinda example)
    HttpRequest req = new HttpRequest();
    req.setEndpoint('callout:Resume_Parser_API/resumes');
    req.setMethod('POST');
    req.setHeader('Content-Type', 'application/json');
    req.setBody('{"file": "' + base64File + '","wait": true}');
    req.setTimeout(120000);


    HttpResponse res = new Http().send(req);


    // Step C: Parse response and extract skills
    if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
      Map<String,Object> parsed = (Map<String,Object>)
          JSON.deserializeUntyped(res.getBody());
      Map<String,Object> data = (Map<String,Object>) parsed.get('data');


      // Extract skills list
      List<Object> skillsList = (List<Object>) data.get('skills');
      List<String> skills = new List<String>();
      for (Object s : skillsList) {
        Map<String,Object> skillMap = (Map<String,Object>) s;
        skills.add((String) skillMap.get('name'));
      }
      String skillsStr = String.join(skills, ', ');


      // Extract most recent job title
      List<Object> exp = (List<Object>) data.get('workExperience');
      String recentTitle = '';
      if (exp != null && !exp.isEmpty()) {
        Map<String,Object> latest = (Map<String,Object>) exp[0];
        recentTitle = (String) latest.get('jobTitle');
      }


      // Step D: Update subscription with parsed data
      update new Job_Alert_Subscription__c(
        Id               = subscriptionId,
        Skills_Extracted__c = skillsStr
      );


      // Step E: Enqueue job search
      System.enqueueJob(
        new JobSearchQueueable(subscriptionId, skillsStr, recentTitle));
    }
  }
}
