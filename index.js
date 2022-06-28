const express = require('express')
const app = express()

app.use(express.json());
app.use('/user/',require('./route/user'),()=>{

})
app.use('/rent/',require('./route/rent'),()=>{

})
app.use('/login/',require('./route/operation'),()=>{
    
})

const port = process.env.port||2499;
app.listen(port,()=>{
    console.log('Listen on port : '+port)
})