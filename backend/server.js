const app = require('./app');
const connectDB = require('./config/database');
const cloudinary = require('cloudinary');
//handling uncaught exceptions

process.on('uncaughtException', function(err) {
    console.log(err.message);
    console.log("shutting down server due to uncaught exceptions");
    process.exit(1);
})


if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config({path:"backend/config/config.env"});
}

// db connect

connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})

// unhandled promise rejection

process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("shutting down server due to unhandled promise rejection");

    server.close(()=>{
        process.exit(1);
    })
})