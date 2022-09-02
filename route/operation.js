const express = require('express')
const route = express.Router()
const conn = require('../config/database')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
var md5 = require('md5');

route.post('/',(req,res)=>{
    const {mac,function_id,user_token} = req.body
    const hash = md5(mac+'FishStop')
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    try{
        conn.query('SELECT * FROM user_data WHERE user_mac = ?',[mac],(err,user_data,field)=>{
            if(err){
                console.log(err)
                return
            }
            if(user_data.length == 0){
                console.log(mac)
                res.status(400).json({"msg":"Mac not found","can_access":false})
                return
            }

            // if(user_token != hash){
            //     res.status(400).json({"msg":"token incorrect","can_access":false})
            //     return
            // }

            conn.query('UPDATE user_data SET user_last_login = ? WHERE user_mac = ?',[time,mac],(err,result,field)=>{
                if(err){
                    res.status(400).json({"msg":"Update Failed : "+ err,"status":"false"})
                    return
                }
            })

            conn.query('UPDATE rent_data SET rent_status = 0 WHERE (user_mac = ? && rent_status = ?) && (? NOT BETWEEN rent_start AND rent_end)',[mac,1,now],(err,result,field)=>{
                if(err){
                    res.status(400).json({"msg":"Update Failed : "+ err,"status":"false"})
                    return
                }
                conn.query('SELECT * FROM rent_data WHERE (user_mac = ? && function_id = ?) && rent_status = ?',[mac,function_id,1],(err,result,field)=>{
                    
                    if(err){
                        console.log(err)
                    }
                    if(result.length==0){
                        res.status(400).json({"msg":"ไม่มีสิทธิ์ใช้งานฟังก์ชั่นนี้","can_access":false})
                        return
                    }
                    let privilage = moment().isBefore(result[0].rent_end)
                    let status = moment(result[0].rent_end).fromNow()
                    let rent_endd = moment(result[0].rent_end).add(543,'year').format('D MMMM YYYY HH:mm:ss ')
                    res.json({
                        "can_access":privilage,
                        "time_from_now":status,
                        "time_end":rent_endd,
                    })
    
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
                    expiresIn:"24h"
                }
            )
            res.status(200).json({"token":token})
            console.log(token)
        }else{
            res.status(400).json({"msg":"Username or password incorrect"})
        }
    }catch{
        res.status(400).json({"msg":"err"})
    }
})

route.get('/web/auth',auth,(req,res)=>{
    try{
        res.status(200).json({"status":true})
    }catch{
        res.status(400).json({"msg":"Something went wrong"})
    }
})

route.get('/dashboard',auth,(req,res)=>{
    try{
        const sql = `SELECT 
        (SELECT count(user_mac) FROM user_data) as user_count, 
        (SELECT count(function_id) FROM function_data) as program_count,
        (SELECT count(rent_id) from rent_data WHERE rent_status = '1') as rent_open,
        (SELECT count(rent_id) from rent_data ) as rent_all,
        (SELECT (count(rent_id)+0) from rent_data WHERE DATE(rent_start) = CURDATE()) as rent_today,
        (SELECT sum(rent_price) FROM rent_data WHERE DATE(rent_start) = CURDATE()) as rent_price_today,
        (SELECT (SUM(rent_price) / SUM(TIMESTAMPDIFF(day,rent_start,rent_end))) / 24 as time_remain from rent_data WHERE DATE(rent_start) = CURDATE()) as price_per_hours ,
        (SELECT SUM(rent_price) FROM rent_data) as price_all`
        conn.query(sql,(err,result,field)=>{
            if(err){
                console.log(err)
                return
            }
            res.json(result)
        })
    }catch(err){
        console.log(err)
    }
})

route.get('/update_expire',auth,(req,res)=>{
    try{
        const sql = "SELECT rent_id FROM rent_data WHERE DATE(NOW()) > rent_end AND rent_status = 1"
        conn.query(sql,(err,result,field)=>{

            for(var attributename in result){
                    const sql_update = "UPDATE rent_data SET rent_status = 0 WHERE rent_id = ?"
                    conn.query(sql_update,[result[attributename].rent_id],(err,result2,field)=>{

                    })
                    console.log(result[attributename].rent_id)
            }
            res.status(200).json({"msg":"Success"})
        })
    }catch(err){
        console.log(err)
    }
})


module.exports = route