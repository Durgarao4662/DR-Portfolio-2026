@isTest
public class MockJobSearchResponse implements HttpCalloutMock {
  private Integer statusCode;

  // Default constructor returns 200 success
  public MockJobSearchResponse() { this.statusCode = 200; }

  // Overloaded constructor to simulate failures
  public MockJobSearchResponse(Integer code) { this.statusCode = code; }

  public HTTPResponse respond(HTTPRequest req) {
    System.assert(req.getEndpoint().contains('jsearch'),
      'Unexpected endpoint: ' + req.getEndpoint());

    String body = '{'
      + '"data": ['
      +   '{'
      +     '"job_title": "Salesforce Developer",'
      +     '"employer_name": "Acme Corp",'
      +     '"job_city": "Bangalore",'
      +     '"job_country": "India",'
      +     '"job_apply_link": "https://example.com/apply"'
      +   '}'
      + ']'
      + '}';

    HttpResponse res = new HttpResponse();
    res.setStatusCode(this.statusCode);
    res.setHeader('Content-Type', 'application/json');
    if (this.statusCode == 200) res.setBody(body);
    return res;
  }
}
