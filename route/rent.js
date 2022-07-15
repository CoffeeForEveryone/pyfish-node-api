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
 
        conn.query('SELECT * FROM rent_data WHERE (user_mac = ? AND function_id = ?) AND rent_status = 1',[mac,function_id],  (err,result,field)=>{
            if(err){
                console.log(err)
                return
            }
            foo(result).then(()=>{
                bar()
            })

        })

        let foo =  (result) => {
            return new Promise((resolve,reject)=>{
                if(result.length > 0){
                    conn.query('UPDATE rent_data SET rent_status = 0 WHERE user_mac = ? AND function_id = ?',[mac,function_id],  (data)=>{
                        console.log(result)
                        rent_end = moment(result[0].rent_end).add(hours_of_rent,'h').format('YYYY-MM-DD HH:mm:ss')
                        resolve()
                    })
                }else{
                    resolve()
                }
            })
        }

        let bar =  () => {
            return new Promise((resolve,reject)=>{
                console.log('2')
                conn.query('INSERT INTO rent_data VALUES(?,?,?,?,?,?,?)', [0, mac, rent_start, rent_end, function_id, rent_price, 1],(err, result, field) => {
                    if (err) {
                        res.status(400).json({ "msg": "Error something went wrong : " + err, "status": "false" })
                        console.log(err)
                    }
                    res.status(200).json({ "msg": "Successfully", "status": "true" })
                    console.log('3')
                    
                }) 
                resolve()
            })
        }



})

route.delete('/ban/:mac',(req,res)=>{
    const mac = req.params.mac
    try{
        conn.query('UPDATE rent_data SET rent_status = 0 WHERE rent_id = ?',[mac],(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Update Failed : "+ err,"status":"false"})
                return
            }
            console.log(mac)
            res.status(200).json({"msg":"Update Successfully","status":"true"})
        })
    }catch{
        console.log(err)
    }
})

route.post('/continue/',(req,res)=>{
    
})

module.exports = route;