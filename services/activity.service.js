const { Activity } = require('../model')

const checkActivityExists = async (activity_id) => {
    try {
        const check = await Activity.findOne({ sid: activity_id, status: 1 });
        if (check) {
            return true
        }
        return false
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    checkActivityExists
}