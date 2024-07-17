const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const User = require('../models/users');

const verifyToken = (req, res, next) => {
    // get token from header
    let token = req.session.token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
        return res.status(401).send({ message: "Đăng nhập hết hạn, Vui lòng đăng nhập lại!" });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Tài khoản không hợp lệ",
            });
        }

        const user = await User.findOne({ _id: decoded.id });
        console.log(user);
        if (user.status !== 'active') {
            return res.status(401).json({ message: 'Tài khoản đã bị khóa!' })
        }

        req.userId = decoded.id;
        next();
    });
};
// verifyTokenAdmin

const verifyTokenAdmin = (req, res, next) => {
    // get token from header
    let token = req.session.token;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).send({ message: "Đăng nhập hết hạn, Vui lòng đăng nhập lại!" });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Tài khoản không hợp lệ",
            });
        }

        const user = await User.findOne({ _id: decoded.id });
        if (user.status !== 'active') {
            return res.status(401).json({ message: 'Tài khoản đã bị khóa!' })
        }

        if (user.role !== 'admin') {
            return res.status(401).json({ message: 'Bạn không có quyền truy cập!' })
        }

        req.userId = decoded.id;
        next();
    });
}
// notlogin

const notLogin = (req, res, next) => {
    let token = req.session.token;

    if (token) {
        return res.status(400).send({ message: "Bạn đã đăng nhập" });
    }
    next();
}

module.exports = {
    verifyToken,
    notLogin,
    verifyTokenAdmin
};