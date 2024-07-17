var express = require('express');
var router = express.Router();
const ConfigController = require('../controllers/configController');

router.get('/get-invite-code', ConfigController.getInviteCodeOfAdmin);

module.exports = router;
