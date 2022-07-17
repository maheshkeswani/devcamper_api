const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');
const CoursesSchema  =  new mongoose.Schema({
    title:{
        type: String,
        trim: true,
    },
    description : {
        type: String,
        required: [true,"Please Add Description"],
    },
    weeks : {
        type : String,
        required : [true,'Please add number of weeks']
    },
     tuition : {
        type : Number,
        required : [true,'Please add tution Cost']
    },
     minimumSkill : {
        type : String,
        required : [true,'Please add minimum skill'],
        enum : ['beginner','intermediate','advanced']
    },
     scholarshipAvailable: {
        type : Boolean,
        default : false,

    },
     createdAt : {
        type : Date,
        default : Date.now, 
     },
     bootcamp : {
        type : mongoose.Schema.ObjectId,  
        ref: 'Bootcamp',
        required : true
     }
});
CoursesSchema.statics.getAvgCost = async function(bootcampId){
    const obj  = await this.aggregate([
        {
            $match : {bootcamp : bootcampId}
        },
        {
            $group : {
                _id : '$bootcamp',
                averageCost: {$avg : '$tuition'}
            }
        }
    ])
    console.log(obj);
    try{
       await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
        averageCost : obj[0].averageCost,
       })
    }
    catch(err)
    {
        console.log(err)
    }
}
CoursesSchema.pre('remove',function(){
this.constructor.getAvgCost(this.bootcamp)
})
CoursesSchema.post('save',function(){
this.constructor.getAvgCost(this.bootcamp)
})
module.exports = mongoose.model('Courses',CoursesSchema);