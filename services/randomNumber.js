
const generateRandomNumber = () => {
    const today = new Date();

    // Get the month and day from the date
    const month = today.getMonth() + 1; // Months are 0-based, so add 1
    const day = today.getDate();

    // Generate a random number between 0000 and 9999
    const randomNumber = Math.floor(Math.random() * 10000);

    // Format the random number to be four digits (with leading zeros if necessary)
    const formattedRandomNumber = randomNumber.toString().padStart(4, '0');

    // Concatenate the month, random number, and day to create the unique ID
    const uniqueId = `${month}${formattedRandomNumber}${day}`;

    // Convert the unique ID to a number (to remove any leading zeros)
    const sid = Number(uniqueId);

    return sid;
}

module.exports = generateRandomNumber;
