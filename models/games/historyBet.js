const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const historyBet = new Schema({
    betDataID: { type: Schema.ObjectId, required: true },
    userID: { type: Schema.ObjectId, required: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    betInUser: { type: Array, required: true },
    code: { type: String, required: true },
    win: { type: Number, default: 0 },
    interest: { type: Number, default: 0 },
}, { collection: 'historyBet', virtuals: true, toJSON: { virtuals: true } })

historyBet.plugin(mongoosePaginate)
// virtual field
historyBet.virtual('betData', {
    ref: 'Sx5d',
    localField: 'betDataID',
    foreignField: '_id',
    justOne: true
});

historyBet.virtual('user', {
    ref: 'users',
    localField: 'userID',
    foreignField: '_id',
    justOne: true
});

historyBet.virtual('betDataUser', {
    ref: 'betData',
    localField: 'betDataID',
    foreignField: '_id',
    justOne: true
});



module.exports = mongoose.model('historyBet', historyBet)