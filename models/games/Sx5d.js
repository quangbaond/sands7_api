const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Sx5d = new Schema({
    id: { type: String, required: true },
    betData: { type: Array, required: true },
    result: { type: Number, required: true },
    big: { type: Boolean, required: true },
    small: { type: Boolean, required: true },
    odd: { type: Boolean, required: true },
    even: { type: Boolean, required: true },
    resultMoney: { type: Number, required: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    timeStart: { type: Date, default: Date.now },
    timeEnd: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    type: { type: String, default: 'sx5d' },
}, { collection: 'Sx5d' })

Sx5d.plugin(mongoosePaginate)

module.exports = mongoose.model('Sx5d', Sx5d)