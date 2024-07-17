const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;


const settings = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
}, { collection: 'settings1', virtuals: true, toJSON: { virtuals: true } })

settings.plugin(mongoosePaginate)

settings.virtual('user', {
    ref: 'users',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
})

module.exports = mongoose.model('settings', settings)