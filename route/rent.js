const express = require('express')
const route = express.Router()
const conn = require('../config/database')
const moment = require('moment')

route.get('/',(req,res)=>{
    try{
        conn.query('SELECT * FROM rent_data'
        ,(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Error something went wrong : "+err,"status":"false"})
            }
            res.json(result)
        })
    }catch{
        console.log(err)
    }
})

route.get('/:mac',(req,res)=>{
    const mac = req.params.mac
    try{
        conn.query('SELECT * FROM rent_data WHERE user_mac = ?',[mac]
        ,(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Error something went wrong : " + err , "status":"false"})
                console.log(err)
            }
            res.json(result)
        })
    }catch{
        console.log(err)
    }
})

route.post('/add/',(req,res)=>{
    const {mac,hours_of_rent,function_id,rent_price} = req.body
    let rent_start = moment().format('YYYY-MM-DD HH:mm:ss')
    let rent_end = moment(rent_start).add(hours_of_rent,'h').format('YYYY-MM-DD HH:mm:ss')

    try{
        conn.query('INSERT INTO rent_data VALUES(?,?,?,?,?,?,?)',[0,mac,rent_start,rent_end,function_id,rent_price,1],(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Error something went wrong : " + err , "status":"false"})
                console.log(err)
            }
            res.status(200).json({"msg":"Successfully","status":"true"})
        })
    }catch{
        console.log(err)
    }
})

module.exports = route;