const express  = require('express');
const { register,logIn, getuser } = require('../controller/authorization');
const { getMe,forgotPassword } = require('../controller/authorization');
const { protect } = require('../middleware/auth');

const router = express.Router();


router.route('/register').post(register);
router.route('/login').post(logIn);
router.route('/me').get(protect,getMe);
// router.route('/:id').get(getuser)
router.route('/forgotPassword').post(forgotPassword);


module.exports = router;