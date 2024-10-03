const registerRouter = require('./register.router');
const loginRouter = require('./login.router')
const otpRouter = require('./otp.router')
const userRouter = require('./user.router')
const curriculumRouter = require('./curriculum.router')
const activityRouter = require('./activity.router')
module.exports = {
    registerRouter,
    otpRouter,
    loginRouter,
    userRouter,
    curriculumRouter,
    activityRouter
}
