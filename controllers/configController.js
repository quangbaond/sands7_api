
const users = require('../models/users');
const getInviteCodeOfAdmin = async (req, res) => {
    try {
        const admin = await users.findOne({ role: "admin" });
        console.log(admin);
        return res.status(200).json({ inviteCode: admin.inviteCode });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getInviteCodeOfAdmin
};