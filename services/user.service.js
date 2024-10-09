const { Registration } = require('../model')

const checkIfExits = async (sid) => {
    try {
        const check = await Registration.findOne({ sid: sid });
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
    checkIfExits
}