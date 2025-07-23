const rentalDuration = 7; 
let rentalRecords = JSON.parse(localStorage.getItem('rentalRecords')) || {};

function rentMovie(movieId, userId) {
    const rentalKey = `${userId}-${movieId}`;
    
    if (rentalRecords[rentalKey]) {
        return { success: false, message: 'This movie has already been rented.' };
    }

    const rentalEndDate = new Date();
    rentalEndDate.setDate(rentalEndDate.getDate() + rentalDuration);

    rentalRecords[rentalKey] = {
        rentedOn: new Date().toISOString(),
        returnBy: rentalEndDate.toISOString()
    };

    saveRentalRecords();
    return { success: true, message: 'Movie rented successfully.', returnBy: rentalEndDate };
}

function checkRentalStatus(movieId, userId) {
    const rentalKey = `${userId}-${movieId}`;
    return rentalRecords[rentalKey] || null;
}

function saveRentalRecords() {
    localStorage.setItem('rentalRecords', JSON.stringify(rentalRecords));
}

function getRentalHistory(userId) {
    return Object.keys(rentalRecords)
        .filter(key => key.startsWith(userId))
        .map(key => ({
            movieId: key.split('-')[1],
            ...rentalRecords[key]
        }));
}

export { rentMovie, checkRentalStatus, getRentalHistory };