## The following items are missing

### 1. The endpoint GET /filings/summary

As this is a GET, it will accept a query param containing the list of companies (comma separated). It will be implemented as follows:

1. For each company, use the getSubmissions() usecase to fetch the filings using Promise.all
2. Compute each company's number of filings by form type by using array.reduce()
3. To get the latest 10-K. Do either of the 2 options below:
    a. Rely on the EDGAR API's response structure which is already sorted by date
    b. Filter results by form = 10-K and find the result with the latest date (choose this option) 
