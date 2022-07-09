const express = require('express')
const app = express()
const auth = require('./middleware/auth')
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use('/user/',auth,require('./route/user'),()=>{

})
app.use('/rent/',auth,require('./route/rent'),()=>{

})
app.use('/login/',require('./route/operation'),()=>{
    
})
app.use('/program/',auth,require('./route/program'),()=>{
    
})
app.get('/',(req,res)=>{
    res.json({"msg":"test"})
})



const port = process.env.port||2499;
app.listen(port,()=>{
    console.log('Listen on port : '+port)
})