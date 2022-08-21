const express = require('express');
const path = require('path');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUplaod = require('express-fileupload');
const app = express();


if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config({path:"backend/config/config.env"});
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUplaod({
    limits: {
        fileSize: 2000000 //2mb
    },
}));
// route imports

const examroute = require('./routes/examRoute');
const userroute = require('./routes/userRoute');
const resultroute = require('./routes/resultRoute');

app.use('/api/v1',userroute);
app.use('/api/v1',examroute);
app.use('/api/v1/',resultroute);
// error middleware



app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get("*",(req, res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})
app.use(errorMiddleware);

module.exports = app;