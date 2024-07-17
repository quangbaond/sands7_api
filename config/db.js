var mongoose = require('mongoose');
const init = require('../common/init');
require('dotenv').config();

// connect db
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.info('Kết nối cơ sở dữ liệu thành công! 🙋');
    init.initAdmin();
    init.intSettingGame();
}).catch((err) => {
    console.error('Lỗi kết nối cơ sở dữ liệu 🚨');
    console.error(err);
});
