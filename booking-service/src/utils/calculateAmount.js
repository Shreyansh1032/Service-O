const calculateAmount = (seats) => {

    return seats.reduce(
        (sum, seat) => sum + seat.price,
        0
    );

};

export default calculateAmount;