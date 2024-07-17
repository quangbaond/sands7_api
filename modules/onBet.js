const historyBet = require('../models/games/historyBet');
const users = require('../models/users');
const Sx5d = require('../models/games/Sx5d');
const settings = require('../models/settings');

module.exports = async (socket, data) => {
    // // Logic xử lý sự kiện onBet
    socket.on('onBet', (data) => {
        console.log('onBet event received with data:', data);
        onBet(socket, data);
    });
};

const onBet = async (socket, data) => {
    const { betDataID, amount, betInUser, userID, code, username } = data;
    const historyBetData = {
        betDataID,
        userID,
        amount,
        betInUser,
        code
    }
    try {
        await historyBet.create(historyBetData);

        const user = await users.findOne({ _id: userID });
        user.balance -= amount;

        await user.save();

        const betData = await Sx5d.findOne({ _id: betDataID });
        betData.resultMoney += amount;
        await betData.save();

        // get HistoryBetList
        const historyBetList = await historyBet.findOne({ betDataID: betDataID }).sort({ createAt: -1 }).populate('user');

        socket.broadcast.emit(`betDataUser-${code}`, { historyBetList });
        // get balance user
        const userBalance = await users.findOne({ _id: userID });
        socket.emit(`betDataResponse-${userID}`, { status: 'success', balance: userBalance.balance });

    }
    catch (error) {
        console.log(error);
        socket.emit('betDataResponse', { status: 'fail' });
    }
}