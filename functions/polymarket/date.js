
function formatDate(input) {
    // Transformer la date ISO en objet Date
    const dateObj = new Date(input);

    // Formatter en MM-DD-YYYY
    const output = [
        String(dateObj.getMonth() + 1).padStart(2, '0'), // Mois (indexé à partir de 0)
        String(dateObj.getDate()).padStart(2, '0'),      // Jour
        dateObj.getFullYear()                           // Année
    ].join('-');

    return output
}

module.exports = formatDate