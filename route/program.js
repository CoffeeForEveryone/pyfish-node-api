const express = require('express')
const route = express.Router();
const conn = require('../config/database')

route.get('/',(req,res)=>{
    try{
        conn.query('SELECT * FROM function_data',(err,result,field)=>{
            res.json(result)
            console.log(err)
        })
    }catch{
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
    }catch{
        console.log(err)
    }
})

route.post('/',(req,res)=>{
    const {name} = req.body
    try{
        conn.query('INSERT INTO function_data VALUES(?,?)',[0,name],(err,field)=>{
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
    }catch{
        console.log(err)
    }
})

module.exports = route;