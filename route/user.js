const express = require('express')
const route = express.Router();
const conn = require('../config/database')
const bodyparser = require('body-parser');
const { json } = require('body-parser');
const moment = require('moment');
const user_data = require('../model/user_model')

route.get('/',(req,res)=>{
    conn.query(
        "SELECT * FROM user_data ORDER BY user_status DESC",
        (err,result,field)=>{
            if(err){
                console.log(err)
                return
            }
            res.json(result)
        }
    )
})

route.get('/:mac', async (req,res)=>{
    const mac = req.params.mac
    try{
        conn.query('SELECT * from user_data WHERE user_mac = ? ',[mac]
        , (err,result,field)=>{
            if(err){
                console.log(err)
                return
            }
            res.json(result) 
        })
    }catch{
        console.log(err)
    }
})

route.post('/register',(req,res)=>{
    const {mac,name} = req.body
    let time = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(mac,name)
    try{
        conn.query('INSERT INTO user_data VALUES(?,?,?,?,?)',[mac,name,time,1,null],(err,field)=>{
            if(err){
                res.status(400).json({"msg":"Create Failed : " + err ,"status":"false"})
                console.log(err)
                return;
            }
            res.status(200).json({"msg":"Create Successfully","status":"true"})

        })
    }catch{
        console.log(err)
    }
})

route.put('/:mac',(req,res)=>{
    const mac = req.params.mac
    const name = req.body.name

    try{
        conn.query('UPDATE user_data SET user_name = ? WHERE user_mac = ?',[name,mac],(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Update Failed : "+ err,"status":"false"})
                return
            }
            res.status(200).json({"msg":"Update Successfully","status":"true"})
        })
    }catch{
        console.log(err)
    }
})

route.put('/ban/:mac',(req,res)=>{
    const mac = req.params.mac
    const status = req.body.status
    try{
        conn.query('UPDATE user_data SET user_status = ? WHERE user_mac = ?',[status,mac],(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Update Failed : "+ err,"status":"false"})
                return
            }
            res.status(200).json({"msg":"Update Successfully","status":"true"})
        })
    }catch{
        console.log(err)
    }
})

route.put('/checkin/:mac',(req,res)=>{
    const mac = req.params.mac
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    try{
        conn.query('UPDATE user_data SET user_last_login = ? WHERE user_mac = ?',[time,mac],(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Update Failed : "+ err,"status":"false"})
                return
            }
            res.status(200).json({"msg":"Checkin Successfully","status":"true"})
        })
    }catch{
        console.log(err)
    }
})

module.exports = route;
