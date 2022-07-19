const fs = require('fs');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');
const Courses = require('./models/Courses')
const mongoose = require('mongoose')
const colors = require('colors');
const User = require('./models/User');
dotenv.config({path:'./config/config.env'})

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
})

// Import Data
const importData = async() => {
    try{
        await Bootcamp.create(bootcamps);
        await Courses.create(courses);
        await User.create(users)

        console.log("Data Imported".inverse.green);
        process.exit();
    }
    catch (err) {
        console.error(err);

    }
}

// Delete data

const deleteData  = async() => {
    try{
        await Bootcamp.deleteMany();
        await Courses.deleteMany();
        await User.deleteMany()
        console.log('Data Deleted'.red.inverse);
        process.exit()
    }
    catch (err) {
        console.error(err)
    }
}

if(process.argv[2] === '-i')
{
    importData();
}
else if (process.argv[2]=== '-d')
{
    deleteData();
}