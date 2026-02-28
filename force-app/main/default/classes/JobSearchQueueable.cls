public class JobSearchQueueable implements Queueable, Database.AllowsCallouts {
    private String subId;
    private String skills;
    private String jobTitle;

    // Store API key via Custom Metadata (API_Config__mdt)
    // Setup > Custom Metadata Types > API_Config__mdt > RapidAPI_Key
    private static final String RAPIDAPI_KEY = 
        API_Config__mdt.getInstance('RapidAPI_Key').Value__c;

    public JobSearchQueueable(String subId, String skills, String title) {
        this.subId    = subId;
        this.skills   = skills;
        this.jobTitle = title;
    }

    public void execute(QueueableContext ctx) {

        // --- Fix 3: Guard against blank skills ---
        if (String.isBlank(skills) && String.isBlank(jobTitle)) {
            return; // Nothing to search with
        }

        // --- Fix 1: Replaced subList() with manual Apex loop ---
        String topSkills = '';
        if (String.isNotBlank(skills)) {
            List<String> skillList = skills.split(',');
            List<String> top3      = new List<String>();

            for (Integer i = 0; i < Math.min(3, skillList.size()); i++) {
                top3.add(skillList[i].trim());
            }
            topSkills = String.join(top3, ' ');
        }

        String rawQuery = (String.isNotBlank(jobTitle) ? jobTitle.trim() : '')
                          + ' ' + topSkills;
        String query    = EncodingUtil.urlEncode(rawQuery.trim(), 'UTF-8');

        // --- Call JSearch API ---
        HttpRequest req = new HttpRequest();
        req.setEndpoint(
            'callout:RapidAPI_Job_Search/search?query=' + query
            + '&page=1&num_pages=1&date_posted=month'
        );
        req.setMethod('GET');
        req.setHeader('X-RapidAPI-Host', 'jsearch.p.rapidapi.com');
        req.setHeader('X-RapidAPI-Key', RAPIDAPI_KEY); // Fix 2: Missing header added
        req.setTimeout(30000);

        try {
            HttpResponse res = new Http().send(req);

            // --- Fix 4: Handle non-200 responses ---
            if (res.getStatusCode() == 200) {
                update new Job_Alert_Subscription__c(
                    Id                  = subId,
                    Job_Results_JSON__c = res.getBody()
                );
            } else {
                // Log the failure against the subscription record
                update new Job_Alert_Subscription__c(
                    Id                  = subId,
                    Job_Results_JSON__c = '{"error": "API call failed with status '
                                         + res.getStatusCode() + '"}'
                );
            }

        } catch (CalloutException e) {
            update new Job_Alert_Subscription__c(
                Id                  = subId,
                Job_Results_JSON__c = '{"error": "Callout exception: ' 
                                      + e.getMessage() + '"}'
            );
        }
    }
}