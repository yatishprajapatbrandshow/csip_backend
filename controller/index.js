const registerController = require('./register.controller');
const otpController = require('./otp.controller')
const loginController = require('./login.controller')
const userController = require('./user.controller')
const curriculumController=require('./curriculum.controller')
module.exports = {
    registerController,
    loginController,
    otpController,
    userController,
    curriculumController
}