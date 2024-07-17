const Sx5d = require('../models/games/Sx5d');
const historyBet = require('../models/games/historyBet');
const users = require('../models/users');
module.exports = (socket) => {
    // getsx5d(socket);
}

// const getsx5d = async (socket) => {
//     // get session bet lastest
//     let a = null;
//     a = setInterval(async () => {
//         const session = await Sx5d.findOne({}).sort({ createAt: -1 });
//         const sessionToClient = session.toObject();
//         // get time start and time end
//         const timeStart = new Date(sessionToClient.timeStart).getTime();
//         const timeEnd = new Date(sessionToClient.timeEnd).getTime();
//         const now = new Date().getTime();
//         // time text to show on client
//         const timeText = `${new Date(sessionToClient.timeStart).getHours()}:${new Date(sessionToClient.timeStart).getMinutes()} - ${new Date(sessionToClient.timeEnd).getHours()}:${new Date(sessionToClient.timeEnd).getMinutes()}`;
//         // time remain
//         const timeRemain = timeEnd - now;
//         // time remain text
//         const timeRemainText = `00:0${Math.floor(timeRemain / 60000)}:${Math.floor((timeRemain % 60000) / 1000) < 10 ? '0' + Math.floor((timeRemain % 60000) / 1000) : Math.floor((timeRemain % 60000) / 1000)}`;
//         // tra ve time remain text cho client la dang mm:ss:ms
//         // add time text and time remain text to session
//         sessionToClient.timeText = timeText;
//         // add time remain to session
//         sessionToClient.timeRemain = timeRemainText;
//         // // check time start and time end
//         if (now >= timeStart && now <= timeEnd) {
//             // send data to client
//             socket.emit('sx5d', sessionToClient);
//         } else {
//             // clear interval
//             clearInterval(a);
//             setTimeout(async () => {
//                 const historyBetResult = await historyBet.find({ betDataID: sessionToClient._id });
//                 console.log('historyBetResult', historyBetResult);
//                 const resultBet = sessionToClient?.betData;

//                 if (historyBetResult.length > 0) {
//                     for (const item of historyBetResult) {
//                         console.log('item', item);
//                         const betDataInUser = item.betInUser;
//                         if (betDataInUser.length > 0) {
//                             const winnings = checkWin(resultBet, betDataInUser);

//                             if (winnings.length > 0) {
//                                 console.log('winnings', winnings);
//                                 const user = await users.findOne({ _id: item.userID });
//                                 let amountAItem = item.amount / item.betInUser.length;
//                                 console.log('amountAItem', amountAItem);
//                                 let totalPrize = winnings.length * amountAItem * 1.98;

//                                 user.balance += totalPrize;
//                                 console.log('totalPrize', totalPrize);

//                                 await user.save();
//                                 socket.emit(`win-${item.userID}`, { userID: item.userID, prize: totalPrize });
//                             } else {
//                                 console.log('Không trúng giải');
//                                 socket.emit(`lose-${item.userID}`, { userID: item.userID, prize: 0 });
//                             }
//                         }
//                     }
//                 }

//                 getsx5d(socket);

//             }, 5 * 1000);

//         }
//     }, 1000);

// }

// function checkWin(results, bets) {
//     const prizeTypes = {
//         1: 'Large',
//         2: 'Small',
//         3: 'Odd',
//         4: 'Even'
//     };

//     let prize = [];

//     bets.forEach(bet => {
//         const { id, value } = bet;
//         const result = results[id];

//         if (value === 1 && result > 2) { // Large (number > 2)
//             prize.push({ id, prize: prizeTypes[1] });
//         } else if (value === 2 && result <= 2) { // Small (number <= 2)
//             prize.push({ id, prize: prizeTypes[2] });
//         } else if (value === 3 && result % 2 !== 0) { // Odd (number is odd)
//             prize.push({ id, prize: prizeTypes[3] });
//         } else if (value === 4 && result % 2 === 0) { // Even (number is even)
//             prize.push({ id, prize: prizeTypes[4] });
//         }
//     });

//     return prize;
// }


