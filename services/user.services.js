const generateUniqueId = async (existingIds) => {
    let id;
    do {
        // Generate a random number (you can adjust the range as needed)
        id = Math.floor(Math.random() * 1000000);
    } while (existingIds.includes(id)); // Ensure the ID is unique
    return id;
};
const generateSlug = async (input) => {
    input = input.trim();
    let slug = input.replace(/[^a-zA-Z0-9]/g, '-');
    slug = slug.toLowerCase();
    return slug;
};


module.exports = {
    generateUniqueId,
    generateSlug
}