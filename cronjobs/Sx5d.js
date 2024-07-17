// const sessionBet = new Schema({
const Sx5d = require('../models/games/Sx5d');

const createSx5d = async (type) => {
    const num1 = Math.floor(Math.random() * 9);
    const num2 = Math.floor(Math.random() * 9);
    const num3 = Math.floor(Math.random() * 9);
    const num4 = Math.floor(Math.random() * 9);
    const num5 = Math.floor(Math.random() * 9);

    const result = num1 + num2 + num3 + num4 + num5;

    const sessionBet = {
        id: Math.floor(Math.random() * 999999999),
        betData: [num1, num2, num3, num4, num5],
        result: result,
        big: result > 22 ? true : false,
        small: result < 23 ? true : false,
        odd: result % 2 !== 0 ? true : false,
        even: result % 2 === 0 ? true : false,
        resultMoney: 0,
        timeStart: new Date(),
        resultOdd: result % 2 !== 0 ? true : false,
        resultEven: result % 2 === 0 ? true : false,
        timeEnd: new Date(new Date().getTime() + 300000),
        // timeEnd: new Date(new Date().getTime() + 60000),

        type: type || 'sx5d'
    }

    const sessionBetData = await Sx5d.create(sessionBet);

    return sessionBetData;
}

module.exports = {
    createSx5d
};
