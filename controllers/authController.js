
const md5 = require('md5');
const user = require('../models/users');
const { getUserInviteByCode } = require('../common/index');
var jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const getIP = require('ipware')().get_ip;
const login = async (req, res) => {

    try {
        const { username, password } = req.body;
        const ipInfo = getIP(req);

        if (!username || !password) {
            return res.status(422).json({ message: 'Vui lòng điền đầy đủ thông tin!' })
        }

        const userLogin = await user.findOne({ username: username });

        if (!userLogin) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại!' })
        }

        if (userLogin.password !== md5(password)) {
            return res.status(400).json({ message: 'Mật khẩu không đúng!' })
        }

        const token = jwt.sign({ id: userLogin._id }, config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

        req.session.token = token;

        // check user status
        if (userLogin.status !== 'active') {
            return res.status(400).json({ message: 'Tài khoản đã bị khóa!' })
        }

        // update last login
        await user.updateOne({ _id: userLogin._id }, { lastLogin: new Date(), ipAddress: ipInfo.clientIp });

        return res.status(200).json({ message: 'Đăng nhập thành công!', user: userLogin, token: token })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đăng nhập thất bại!' })
    }
}

const logout = async (req, res) => {
    req.session.token = false;

    return res.status(200).json({ message: 'Đăng xuất thành công!' })
}

const register = async (req, res) => {
    const { username, password, passwordConfirm, password2, inviteCode } = req.body;

    if (!username || !password || !password2) {
        return res.status(422).json({ message: 'Vui lòng điền đầy đủ thông tin!' })
    }

    if (password !== passwordConfirm) {
        return res.status(422).json({ message: 'Mật khẩu không khớp!' })
    }

    if (password.length < 6) {
        return res.status(422).json({ message: 'Mật khẩu phải lớn hơn 6 ký tự!' })
    }

    const userInvite = await getUserInviteByCode(inviteCode);

    if (!userInvite) {
        return res.status(422).json({ message: 'Mã giới thiệu không đúng!' })
    }

    try {
        const newUser = new user({
            username,
            password: md5(password),
            password2: md5(password2),
            userInvite: userInvite._id,
            inviteCode: Math.random().toString(36).substring(6).toUpperCase(),
        });
        await newUser.save();

        const token = jwt.sign({ id: user._id }, config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

        req.session.token = token;
        return res.status(200).json({ message: 'Đăng ký thành công!', user: newUser, token: token })
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(422).json({ message: 'Tài khoản đã tồn tại!' })
        }
        return res.status(500).json({ message: 'Đăng ký thất bại!' })
    }
}

module.exports = {
    login,
    logout,
    register
}