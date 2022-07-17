const express = require('express')
const dotenv  = require('dotenv')
const morgan = require('morgan')
const colors  = require('colors')
const app = express()
const errorHandler  = require('./middleware/error')
app.use(express.json())
// Route Files

const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const router = require('./routes/bootcamps')
const connectDB = require('./config/db')
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
app.use(errorHandler);

// app.use( logger )

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