const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const balanceFluctuation = new Schema({
    userID: { type: Schema.ObjectId, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: false },
    createAt: { type: Date, default: Date.now },
    reson: { type: String, required: false },
    note: { type: String, required: false },
}, { collection: 'balanceFluctuations', virtuals: true, toJSON: { virtuals: true } })

balanceFluctuation.plugin(mongoosePaginate)

balanceFluctuation.virtual('user', {
    ref: 'users',
    localField: 'userID',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('balanceFluctuations', balanceFluctuation)