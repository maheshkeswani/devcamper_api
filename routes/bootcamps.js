const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
}= require('../controller/bootcamps');
const CourseRouter  = require('./courses');
const router = express.Router()
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/')
.get(getBootcamps)
.post(createBootcamp) 

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp)

router.use('/:bootcampId/courses',CourseRouter);

module.exports = router;