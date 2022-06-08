const axios = require('axios');
const https = require('https');
/*
const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });

instance.post('localhost:3000/login',{
  "username": "admin",
  "password": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"
}).then((data)=>{console.log(data.data)}).catch((err)=>{console.log(err.response.data)});
//err.response.status
*/

const sequentialTestUtils = require("./_sequential_tests_/sequentialTestUtils");
sequentialTestUtils.initializeDatabase();
sequentialTestUtils.deleteAllTables();