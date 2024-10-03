const { userServices } = require('../services')

const findUserData = async (req, res) => {
    try {
        const { email, mobile, name } = req.body;
        if (!email || email == "" && !mobile || mobile == "" && !name || name == "") {
            return res.status(400).json({
                status: false,
                message: "Missing required fields.",
                data: false
            });
        }
        const user = await userServices.findUser(email, mobile, name);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User Not Found .",
                data: false
            });
        }

        return res.status(200).json({
            status: true,
            message: "User Found .",
            data: user
        });

    } catch (error) {

    }
}

module.exports = {
    findUserData
}