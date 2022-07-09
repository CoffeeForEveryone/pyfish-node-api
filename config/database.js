const mysql = require('mysql')
require('dotenv').config();
const moment = require('moment');
moment.locale('th');

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"km_database"
})


// const conn = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"mylittleproject",
// })

conn.connect((err)=>{
    if (err){
        console.log('Your have error'+err);
        return
    }
    console.log('Connect Successfully')

})

module.exports = conn;