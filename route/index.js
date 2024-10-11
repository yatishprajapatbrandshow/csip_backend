const registerRouter = require('./register.router');
const loginRouter = require('./login.router')
const otpRouter = require('./otp.router')
// const userRouter = require('./user.router')
const curriculumRouter = require('./curriculum.router')
const activityRouter = require('./activity.router')
const topicRouter = require('./topic.router')
const favouriteActivityRouter = require('./favouriteActivity.router')
const recommendedActivityRouter = require('./recommendedActivity.router')
const collegeRouter = require('./college.router')
const dashboardRouter = require('./dashboard.router')
const paymentRouter = require('./payment.router')
const commentRouter = require('./comment.router')
const orderRouter = require('./order.router')
module.exports = {
    registerRouter,
    otpRouter,
    loginRouter,
    // userRouter,
    curriculumRouter,
    activityRouter,
    topicRouter,
    favouriteActivityRouter,
    recommendedActivityRouter,
    collegeRouter,
    dashboardRouter,
    paymentRouter,
    commentRouter,
    orderRouter
}
