const Sx5d = require('../models/games/Sx5d');
const historyBet = require('../models/games/historyBet');
const users = require('../models/users');
module.exports = (socket, data) => {
    // getsx5d(socket);
    socket.on('controllgame', async (data) => {

        const isValid = validateInput(data.betData);
        if (!isValid) {
            socket.emit('controllgameResponse', { status: 'fail', message: 'Dữ liệu không hợp lệ' });
            return;
        }
        const session = Sx5d.findOne({ _id: data.sessionID });
        if (!session) {
            socket.emit('controllgameResponse', { status: 'fail', message: 'Session không tồn tại' });
            return;
        }
        // validate data 1,2,3,4,5
        let betData = data.betData.split(',');

        // convert string to number
        betData = betData.map(item => parseInt(item));
        const num1 = betData[0];
        const num2 = betData[1];
        const num3 = betData[2];
        const num4 = betData[3];
        const num5 = betData[4];

        const result = num1 + num2 + num3 + num4 + num5;

        const sessionBet = {
            betData: [num1, num2, num3, num4, num5],
            result: result,
            big: result > 22 ? true : false,
            small: result < 23 ? true : false,
            odd: result % 2 !== 0 ? true : false,
            even: result % 2 === 0 ? true : false,
            resultMoney: 0,
            resultOdd: result % 2 !== 0 ? true : false,
            resultEven: result % 2 === 0 ? true : false,
        }

        const updateBetData = await Sx5d.findOneAndUpdate({ _id: data.sessionID }, {
            $set: sessionBet
        }, { new: true });

        if (!updateBetData) {
            socket.emit('controllgameResponse', { status: 'fail', message: 'Cập nhật dữ liệu thất bại' });
            return;
        }

        // get session bet lastest
        // const historyBetResult = await historyBet.find({ betDataID: data.sessionID });
        // console.log('historyBetResult', historyBetResult);

        socket.emit('controllgameResponse', { status: 'success', data: updateBetData });
    });
}

function validateInput(inputString) {
    const pattern = /^\d,\d,\d,\d,\d$/;
    return pattern.test(inputString);
}


