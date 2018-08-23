# FDN - TEST 2

### How to Install : 
```bash
npm install
```

you'll need : 
- postgres server (for faster setup you can use docker (for development))
- don't forget to create database required by this application.
- all connection setting should be placed in .env file
    environment variables : 

```
API_PORT=3001
PGHOST='localhost'
PGUSER='postgres'
PGDATABASE='fdn_test'
PGPASSWORD=null
PGPORT=5432
```

### Applications:
this application consist of two part : 
1. API application : express application (runs on port 3001)
2. Front End : next.js + React application with ant design react component (runs on port 3000)

### HOW to test.
1. API : 
   from project root directory do ```cp api``` directory and run ```npm test```
2. Front End
   from project root directory do ```cp E2E-test``` directory then run ```yarn test```

### How To run
1. API Apps : 
    1. ```cd``` to api directory then :  
    2. npm install
    3. npm run
2. Front End Apps : 
    1. ```cd``` to api directory then :  
    2. yarn install
    3. yarn run dev 
