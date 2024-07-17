var express = require('express');
var router = express.Router();
const users = require('../models/users');

const jwtMiddleware = require('../middleware/jwtMiddleware');
const balanceFluctuations = require('../models/balanceFluctuation');
const requestMoney = require('../models/requestMoney');
const md5 = require('md5');
const { Socket } = require('socket.io');

/* GET users listing. */
// list
router.get('/list', jwtMiddleware.verifyToken, async (req, res, next) => {
  const { page, limit } = req.query;

  const OPTIONS = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { createAt: -1 },
    populate: 'historyBet'
  }
  const query = {};
  if (req.query.username) {
    query.username = req.query.username;
  }
  if (req.query.email) {
    query.email = req.query.email;
  }
  if (req.query.phone) {
    query.phone = req.query.phone;
  }
  if (req.query.role) {
    query.role = req.query.role;
  }
  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.search) {
    query.$or = [
      { username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  if (req.query.fromDate && req.query.toDate) {
    query.createAt = { $gte: req.query.fromDate, $lte: req.query.toDate }
  }

  const userList = await users.paginate(query, OPTIONS);

  res.status(200).send(userList);

})

// update
router.put('/:id', jwtMiddleware.verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { phone, balance, status, email, role } = req.body;

  // update user
  const user = await users.findById(id);
  if (!user) {
    return res.status(404).send('User not found');
  }

  let type = 'plus';
  let typeRequest = 'deposit';

  if (isNaN(balance)) {
    return res.status(400).send('Balance is not a number');
  }
  let amount = balance - user.balance;
  if (amount < 0) {
    type = 'minus';
    amount = Math.abs(amount);
    typeRequest = 'withdraw';
  }
  const formatDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); // 2019-12-10 10:00:00

  const requestMoneyData = {
    userID: id,
    amount,
    type: typeRequest,
    status: 'accept',
    description: 'Cập nhật số dư',
    note: `Bạn được cập nhật số dư ${formatCurrency(user.balance)} thành ${formatCurrency(parseFloat(balance))} vào lúc ${formatDate}`,
  }
  await requestMoney.create(requestMoneyData);

  const userUpdate = await users.findByIdAndUpdate(id, { phone, balance: parseFloat(balance), status, email, role });

  if (!userUpdate) {
    return res.status(404).send('User not found');
  }
  res.status(200).send(userUpdate);
});

const formatCurrency = (value) => {
  if (!value) return 0;
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

router.get('/get-request-money', jwtMiddleware.verifyToken, async (req, res, next) => {
  const { page, limit } = req.query;

  const OPTIONS = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { createAt: -1 },
    populate: 'user'
  }
  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.type) {
    query.type = req.query.type;
  }
  if (req.query.fromDate && req.query.toDate) {
    query.createAt = { $gte: req.query.fromDate, $lte: req.query.toDate }
  }

  if (req.query.username) {
    // search user regex
    const user = await users.findOne({ username: { $regex: req.query.username, $options: 'i' } });
    console.log(user);
    if (user) {
      query.userID = user._id;
    } else {
      query.userID = null;
    }
  }
  console.log(query);


  const requestMoneyData = await requestMoney.paginate(query, OPTIONS);

  res.status(200).send(requestMoneyData);
});

router.put('/update-request-money/:id', jwtMiddleware.verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const requestMoneyFind = await requestMoney.findById(id);

  if (!requestMoneyFind) {
    return res.status(404).send('Request money not found');
  }

  const requestMoneyUpdate = await requestMoney.findByIdAndUpdate(id, { status, note });

  if (!requestMoneyUpdate) {
    return res.status(404).send('Request money not found');
  }

  res.status(200).send(requestMoneyUpdate);
})

router.put('/change-password/:id', jwtMiddleware.verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { password, confirmPassword } = req.body;

  const user = await users.findById(id);

  if (!user) {
    return res.status(404).send({ message: 'Không tìm thấy người dùng' });
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Mật khẩu không khớp');
  }

  const newPassword = md5(password);

  const userUpdate = await users.findByIdAndUpdate(id, { password: newPassword });

  if (!userUpdate) {
    return res.status(404).send({ message: 'Không tìm thấy người dùng' });
  }
  res.status(200).send(userUpdate);
});

//change-bank
router.put('/change-bank/:id', jwtMiddleware.verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { bankName, bankAccountNumber, bankBranch, bankAccountName } = req.body;

  const user = await users.findById(id);

  if (!user) {
    return res.status(404).send({ message: 'Không tìm thấy người dùng' });
  }

  const userUpdate = await users.findByIdAndUpdate(id, { bankName, bankAccountNumber, bankBranch, bankAccountName });

  if (!userUpdate) {
    return res.status(404).send({ message: 'Không tìm thấy người dùng' });
  }
  res.status(200).send(userUpdate);
});

//delete
router.delete('/:id', jwtMiddleware.verifyToken, async (req, res, next) => {
  const { id } = req.params;

  const user = await users.findById(id);

  if (!user) {
    return res.status(404).send('User not found');
  }

  await user.remove();

  res.status(200).send('User deleted');

});

//detail user
router.get('/:id', jwtMiddleware.verifyToken, async (req, res, next) => {
  const { id } = req.params;

  const user = await users.findById(id);

  if (!user) {
    return res.status(404).send('User not found');
  }

  res.status(200).send(user);
});

module.exports = router;
