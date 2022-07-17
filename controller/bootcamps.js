const errorHandler = require('../middleware/error');
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/gecoder');
// @desc Get All bootcamps
//@route GET /api/v1/bootcamps
//@access Public

exports.getBootcamps = asyncHandler( async (req,res,next) => { 
    let Query;  
    let reqQuery = {...req.query};
  const removefields = ['select','sort','page','limit']
    removefields.forEach(params => delete reqQuery[params]) 
     let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);
Query = Bootcamp.find(JSON.parse(queryStr));

    if(req.query.select)
    {
        const fields  = req.query.select.split(',').join(' ');
        console.log(fields);
        Query  = Query.select(fields);
    }
    if(req.query.sort)
    {
        const srt = req.query.sort.split(',').join(' ');
        console.log(srt)
        Query = Query.sort(srt)
    }
    else
    {
        Query = Query.sort('-createdAt')
    }
    // Pagination
    // const page  = parseInt(req.query.page,10) || 1;
    // const limit = parseInt(req.query.limit,10) || 100;
    // const skip = (page-1)*limit;
    // query = query.skip(skip).limit(limit);
const bootcamps = await Query.populate('courses') ;
res.status(200).json({success: true,data : bootcamps})

// catch(err) {
//     res.status(400).json({success:'false'})
// }
} )
// @desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public 

exports.getBootcamp =  asyncHandler(async (req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp) 
        {
next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id} `,404))

        }
res.status(200).json({success: true,data: bootcamp})
} )
// @desc Create New bootcamp
//@route POST /api/v1/bootcamps
//@access Private

exports.createBootcamp =  asyncHandler(async (req,res,next) => { 
const bootcamp =  await Bootcamp.create(req.body)
// console.log(req.body)
res.status(201).json({success: true,data : bootcamp }) ; 

} )
// @desc Update bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private

exports.updateBootcamp =  asyncHandler(async (req,res,next) => {
const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
})

        if(!bootcamp)
{
    res.status(400).json({success:'false'})
}
        res.status(200).json({success:'true',data : bootcamp})
} )

//@desc Delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req,res,next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
if(!bootcamp)
        {
            res.status(400).json({success:'false'})
        }
        res.status(200).json({success:'true',data : {}})
} )

//@desc Get bootcamps within a radius 
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
exports.getBootcampsInRadius = asyncHandler(async (req,res,next) => {
    
    const {zipcode,distance} = req.params ;

    // GET LAT AND LONG from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
// calculating the radius
// divide by radius of earth
// earth radius = 3,963 mi/ 6,378 km 

const radius = distance/ 3963 ;
const bootcamps  = await Bootcamp.find({
    location: { $geoWithin: {$centerSphere: [[lng,lat],radius]}}
});
res.status(200).json({
    success : 'true',
    count : bootcamps.length,
    data : bootcamps,
})
});