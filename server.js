const mongoose=require('mongoose')
const dotenv=require('dotenv')
const colors=require('colors')

// process.on('uncaughtException', (error) => {
//     // using uncaughtException event
//     console.log(' uncaught Exception => shutting down..... ');
//     console.log(error.name, error.message);
//     process.exit(1); //  emidiatly exists all from all the requests
// });

dotenv.config({path:'./config.env'})
const app=require('./app')

// database connection 
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

console.log(DB);
mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
}).then(() => console.log(`DB connected successfully`.blue.bold));

// server
const port=process.env.PORT || 7000
const server=app.listen(port,()=>{
    console.log(`App is running on port ${port}`.yellow.bold)
})

// handle Globaly  the unhandle Rejection Error which is  outside the express
// e.g database connection 
process.on('unhandledRejection', (error) => {   // it uses unhandledRejection event 
    // using unhandledRejection event
    console.log(' Unhandled Rejection => shutting down..... ');
    console.log(error.name, error.message);
    server.close(() => {
      process.exit(1);  //  emidiatly exists all from all the requests sending OR pending 
    });
});