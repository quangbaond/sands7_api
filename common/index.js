const user = require('../models/users');

const getUserInviteByCode = async (code) => {
    return await user.findOne({ inviteCode: code });
}

module.exports = {
    getUserInviteByCode
}