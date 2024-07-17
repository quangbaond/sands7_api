module.exports = (socket) => {
    socket.on('connect', (betData) => {
        console.log('Bet placed:', betData);
        // Xử lý dữ liệu đặt cược ở đây
        // Ví dụ: Lưu vào cơ sở dữ liệu, tính toán kết quả, v.v.

        // Gửi phản hồi cho client nếu cần
        socket.emit('betResponse', { status: 'success', data: betData });
    });

};