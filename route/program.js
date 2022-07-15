const express = require('express')
const route = express.Router();
const conn = require('../config/database')
const moment = require('moment')

route.get('/',(req,res)=>{
    try{
        conn.query('SELECT * FROM function_data',(err,result,field)=>{
            res.json(result)
        })
    }catch(err){
        console.log(err)
    }
})

route.post('/GetFormMAC/:mac',(req,res)=>{
    const mac = req.params.mac
    const easy = req.body.easy
    let sql = ''

        if(easy == 'true'){
            sql = 'SELECT rent_id,function_name,rent_start,rent_end,rent_status from function_data LEFT JOIN rent_data ON function_data.function_id = rent_data.function_id where rent_data.user_mac = ? && rent_status = "1" ORDER BY rent_status '
        }else{
            sql = 'SELECT rent_id,function_name,rent_start,rent_end,rent_status from function_data LEFT JOIN rent_data ON function_data.function_id = rent_data.function_id where rent_data.user_mac = ? ORDER BY rent_status DESC , rent_start DESC'
        }
        conn.query(sql,[mac],(err,result,field)=>{
            for(var attributename in result){
                let time_remain = moment(result[attributename].rent_end).fromNow()
                result[attributename].time_remain = time_remain 
            }
            res.status(200).json(result)
        })

})

route.get('/update/:id',(req,res)=>{
    const id = req.params.id
    try{
        conn.query('SELECT * FROM function_data WHERE function_id = ?',[id],(err,result,field)=>{
            res.json(result)
        })
    }catch(err){
        console.log(err)
    }
})

route.put('/:function_id',(req,res)=>{
    const function_id = req.params.function_id
    const name = req.body.name
    try{
        conn.query('UPDATE function_data SET function_name = ? WHERE function_id = ?',[name,function_id],(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Update Failed : "+ err,"status":"false"})
                return
            }
            res.status(200).json({"msg":"Update Successfully","status":"true"})
        })
    }catch(err){
        console.log(err)
    }
})

route.put('/ban/:function_id',(req,res)=>{
    const function_id = req.params.function_id
    const status = req.body.status
    try{
        conn.query('UPDATE function_data SET function_status = ? WHERE function_id = ?',[status,function_id],(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"Update Failed : "+ err,"status":"false"})
                return
            }
            console.log(status)
            res.status(200).json({"msg":"Update Successfully","status":"true"})
        })
    }catch(err){
        console.log(err)
    }
})

route.post('/',(req,res)=>{
    const {name} = req.body
    try{
        conn.query('INSERT INTO function_data VALUES(?,?,?)',[0,name,1],(err,field)=>{
            if(err){
                res.status(400).json({"msg":"Create Failed : " + err ,"status":"false"})
                console.log(err)
                return;
            }
            res.status(200).json({"msg":"Create Successfully","status":"true"})

        })
    }catch(err){
        console.log(err)
    }
})

route.delete('/:function_id',(req,res)=>{
    const function_id = req.params.function_id
    try{
        conn.query('DELETE FROM function_data WHERE function_id = ?',[function_id],(err,result,field)=>{
            if(err){
                res.status(400).json({"msg":"DELETE Failed : "+ err,"status":"false"})
                return
            }
            res.status(200).json({"msg":"DELETE Successfully","status":"true"})
        })
    }catch(err){
        console.log(err)
    }
})

module.exports = route;