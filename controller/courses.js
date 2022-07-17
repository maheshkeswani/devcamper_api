const asyncHandler = require('../middleware/async');
const Course = require('../models/Courses');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp')
// @desc Get All Courses
//@route GET /api/v1/courses
// @route GET /api/v1/:bootcampId/courses
//@access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
     const courses = await Course.find().populate({
        path : 'bootcamp',
        select : 'name description'
     });
    res.status(200).json({success : true ,
        count: courses.length,
    data:courses});
  }
});
// @desc Get Course
//@route GET /api/v1/course/:id
//@access Public
exports.getCourse  = asyncHandler(async (req,res,next) => {
const course = await Course.findById(req.params.id).populate({
  path:'bootcamp',
  select : 'name description'
});
if(!course)
{
  return next(new ErrorResponse(`No Course with the id of ${req.params.id}`),404)
}
res.status(200).json({
  success : true,
  data : course,
})
})
// @desc Add a new Course
// @route POST /api/v1/:bootcampId/courses
//@access Private
exports.addCourse = asyncHandler(async (req,res,next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = Bootcamp.findById(req.params.bootcampId) ;
  if(!bootcamp)
  {
    return next(new ErrorResponse(`No Bootcamp With Id of ${req.params.bootcampId}`))
  }
  const course = await Course.create(req.body)
  res.status(200).json({
    success : true,
    data:course,
  })

})

// @desc Update Course
// @route PUT /api/v1/courses/:id
//@access Private
exports.updateCourse = asyncHandler(async (req,res,next) => {
let course  = await Course.findById(req.params.id);
if(!course)
{
  return next(new ErrorResponse(`No Course with the id of ${req.params.id}`,404))
}

 course = await Course.findByIdAndUpdate(req.params.id,req.body,{
    new : true,
    runValidators:true
  })
res.status(200).json({
  success : true,
  course : course
})

})
exports.deleteCourse = asyncHandler(async (req,res,next) => {
let course  = await Course.findById(req.params.id);
if(!course)
{
  return next(new ErrorResponse(`No Course with the id of ${req.params.id}`,404))
}

 course = await Course.findByIdAndDelete(req.params.id)
res.status(200).json({
  success : true,
  data : {}
})

})
