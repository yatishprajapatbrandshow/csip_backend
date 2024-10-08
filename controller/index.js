const registerController = require('./register.controller');
const otpController = require('./otp.controller')
const loginController = require('./login.controller')
// const userController = require('./user.controller')
const curriculumController = require('./curriculum.controller')
const activityController = require('./activity.controller')
const topicController = require('./topic.controller')
const favouriteActivity = require('./favouriteActivity.controller')
const recommendedActivityController = require('./recommendedActivity.controller')
module.exports = {
    registerController,
    loginController,
    otpController,
    // userController,
    curriculumController,
    activityController,
    topicController,
    favouriteActivity,
    recommendedActivityController
}