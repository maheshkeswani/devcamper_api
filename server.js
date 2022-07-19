const express = require('express')
const dotenv  = require('dotenv')
const morgan = require('morgan')
const cookiePaser = require('cookie-parser')
const colors  = require('colors')
const app = express()
const errorHandler  = require('./middleware/error')
app.use(express.json())
// Route Files

const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const user = require('./routes/auth')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
// Load env vars 
dotenv.config({path:'./config/config.env'})
// Connect to Database
connectDB(); 
if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/user',user);
app.use(errorHandler);

// Cookie parser
app.use(cookieParser());

const PORT  = process.env.PORT || 5000

app.listen(PORT,() => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold) })
// Handle Unhandled Promise Rejection
process.on('unhandledRejection ',(err,promise) => {
    console.log(`Error : ${err.message}`.red)
// Body Parser
app.use(express.json())
// Close server & exit process
server.close(() => process.exit(1)) ;
})