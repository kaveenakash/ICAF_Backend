const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const path = require('path')


const authRoutes = require('./routes/auth-routes');
const workshopRoutes = require('./routes/workshop-routes')
const userRoutes = require('./routes/user-routes')
const messageRoutes = require('./routes/message-routes')
const HttpError = require('./models/http-error');

app.use(cors())
app.use(express.json())

app.use('/uploads/documents',express.static(path.join('uploads','documents')))

app.use('/api/auth',authRoutes)

//Workshop APIS 
app.use('/api/workshop',workshopRoutes)

app.use('/api/user',userRoutes)

app.use('/api/message',messageRoutes)



app.use((req,res,next) =>{
    const error = new HttpError('could not find this route',404)
    throw error;
})

app.use((error,req,res,next) =>{

    if(req.file){
        fs.unlink(req.file.path,(err) =>{
            console.log(err)
        })
    }

    if(res.headerSent){
        return next(error)
    }
    res.status(error.code | 500)
    res.json({message:error.message || 'An unknown error occured'})
})



mongoose
.connect('mongodb+srv://ICAF_admin:ICAF_123@icaf.w04n0.mongodb.net/ICAF?retryWrites=true&w=majority',{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser:true})
.then(() =>{
    console.log('Database Estabilished')
    app.listen(9090,() =>{
        console.log('Server Started ',9090)
    })
})
.catch(err =>{
    console.log(err) 
})