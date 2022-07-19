const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
}= require('../controller/bootcamps');
const { protect,authorize } = require('../middleware/auth');
const CourseRouter  = require('./courses');
const router = express.Router()
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/')
.get(getBootcamps)
.post(protect, authorize('publisher', 'admin'),createBootcamp) 

router.route('/:id')
.get(getBootcamp)
.put(protect, authorize('publisher', 'admin'),updateBootcamp)
.delete(protect, authorize('publisher', 'admin'),deleteBootcamp)

router.use('/:bootcampId/courses',CourseRouter);

module.exports = router;