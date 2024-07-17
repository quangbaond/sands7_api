const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const users = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    password2: { type: String, required: false },
    status: { type: String, default: 'active' },
    deleteAt: { type: Date, default: Date.now },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    fullname: { type: String, required: false },
    balance: { type: Number, default: 0 },
    role: { type: String, default: 'user' },
    avatar: { type: String, default: '/static/images/avatar/1.jpg' },
    betToday: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now, required: false },
    inviteCode: { type: String, required: false },
    userInvite: { type: Schema.ObjectId, required: false },
    bankAccountNumber: { type: String, required: false },
    bankName: { type: String, required: false },
    bankBranch: { type: String, required: false },
    bankAccountName: { type: String, required: false },
    ipAddress: { type: String, required: false },
}, { collection: 'users', virtuals: true, toJSON: { virtuals: true } })

users.index({ email: 1, username: 1 })
users.virtual('userInvited', {
    ref: 'users',
    localField: 'userInvite',
    foreignField: '_id',
    justOne: true
});
users.virtual('balanceFluctuations', {
    ref: 'balanceFluctuations',
    localField: '_id',
    foreignField: 'userID',
    justOne: false
});

users.virtual('historyBet', {
    ref: 'historyBet',
    localField: '_id',
    foreignField: 'userID',
    justOne: false
});
users.plugin(mongoosePaginate)

module.exports = mongoose.model('users', users)