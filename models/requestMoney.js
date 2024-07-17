const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const requestMoney = new Schema({
    userID: { type: Schema.ObjectId, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    note: { type: String, required: false },
    reson: { type: String, required: false },
    type: { type: String, default: 'deposit' },
}, { collection: 'requestMoney', virtuals: true, toJSON: { virtuals: true } })

requestMoney.virtual('user', {
    ref: 'users',
    localField: 'userID',
    foreignField: '_id',
    justOne: true
});

requestMoney.plugin(mongoosePaginate)

module.exports = mongoose.model('requestMoney', requestMoney)