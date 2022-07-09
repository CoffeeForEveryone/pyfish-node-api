const express = require('express')
const route = express.Router()
const conn = require('../config/database')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

route.post('/',(req,res)=>{
    const {mac,function_id} = req.body
    try{
        conn.query('SELECT * FROM user_data WHERE user_mac = ?',[mac],(err,user_data,field)=>{
            if(err){
                console.log(err)
                return
            }
            if(user_data.length == 0){
                res.status(400).json({"msg":"Mac not found","can_access":false})
                return
            }
            conn.query('SELECT * FROM rent_data WHERE (user_mac = ? && function_id = ?) && rent_status = ?',[mac,function_id,1],(err,result,field)=>{
                if(result.length==0){
                    res.status(400).json({"msg":"ไม่มีสิทธิ์ใช้งานฟังก์ชั่นนี้","can_access":false})
                }
                let privilage = moment().isBefore(result[0].rent_end)
                let status = moment(result[0].rent_end).fromNow()
                let rent_end = moment(result[0].rent_end).add(543,'year').format('LLL')
                res.json({
                    "can_access":privilage,
                    "time_from_now":status,
                    "time_end":rent_end
                })

            })
        })
    }catch{
        console.log(err)
    }
})

route.post('/web/',(req,res)=>{
    const {username,password} = req.body
    try{
        if((username == "km_dev") && (password == "Iamstrongpassword2499") ){
            console.log(username,password)
            const token = jwt.sign(
                {username :username},
                "km_dev",
                {
                    expiresIn:"1h"
                }
            )
            res.status(200).json({"token":token})
        }else{
            console.log(username,password)
            res.status(400).json({"msg":"Username or password incorrect"})
        }
    }catch{
        res.status(400).json({"msg":"err"})
    }
})

route.get('/web/auth',(req,res)=>{
    try{
        res.status(200).json({"status":true})
    }catch{
        res.status(400).json({"msg":"Something went wrong"})
    }
})

module.exports = route