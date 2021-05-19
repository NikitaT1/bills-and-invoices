# bills-and-invoices

A NodeJS backend with PostgreSQL and Docker-containers for generating invoices and sending e-mails with attached pdf-files. Here is briefly instruction:

1.1. after cloning project change  .env-example и Dockerfile-example files to .env и Dockerfile. Where can you get them? Text me) 
1.2. Be a registered Mailgun user to set your own API-KEY and Domain, also you need to verify e-mail in Mailgun for e-mails to be received. These e-mail address should be in billsRouter file

If you are in Docker type to start server: 
docker-compose build
docker-compose up

NOTE! 
In Docker the working port is http://localhost:5000/ or your port
In NodeJS the working port is http://localhost:7000/ or your port

You need to make 2 simple requests for sending e-mails:
1.	http://localhost:7000/customer/  with JSON object like these: 
{"firstName": "Name", 
"lastName": "LastName", 
"email": "customer@mail.com"}

2.	http://localhost:7000/bills/ with JSON object like these:
{
    "recipientEmail": "newEmail@mail.com",
    "customerEmail": " customer@mail.com ",
    "recipientsCompany": "Company",
    "works":[{"workPerformed": "New",
"price": 3300}, {"workPerformed": "New QL2",
"price": 7900}]
}

NOTE THAT VALUE FROM email FROM 1st REQUEST SHOULD BE THE SAME AS VALUE OF customerEmail FROM 2nd REQUEST CAUSE THESE IS HOW SEARCHING INDATABSE IS WORKING!

If you done everything right check spam folder in mail that you have connected to the app)) 

