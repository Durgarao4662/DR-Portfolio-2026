@isTest
public class MockResumeParserResponse implements HttpCalloutMock {
  public HTTPResponse respond(HTTPRequest req) {
    // Validate correct endpoint is being hit
    System.assert(req.getEndpoint().contains('affinda.com'),
      'Unexpected endpoint: ' + req.getEndpoint());
    System.assertEquals('POST', req.getMethod(),
      'Expected POST request to Resume Parser API');

    String body = '{'
      + '"data": {'
      +   '"skills": ['
      +     '{"name": "Java"},'
      +     '{"name": "Salesforce"},'
      +     '{"name": "Apex"}'
      +   '],'
      +   '"workExperience": ['
      +     '{'
      +       '"jobTitle": "Salesforce Developer",'
      +       '"employer": "Tech Corp"'
      +     '}'
      +   ']'
      + '}'
      + '}';

    HttpResponse res = new HttpResponse();
    res.setStatusCode(200);
    res.setHeader('Content-Type', 'application/json');
    res.setBody(body);
    return res;
  }
}