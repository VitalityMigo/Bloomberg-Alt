
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

function formatDatePlain(input) {
    // Créer un objet Date à partir du timestamp
    const date = new Date(input * 1000);

    // Obtenir la date formatée
    const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', optionsDate);

    // Obtenir l'heure formatée (juste les heures avec AM/PM)
    const optionsTime = { hour: 'numeric', hour12: true };
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

    // Combiner la date et l'heure
    const finalOutput = `${formattedDate} ${formattedTime}`;

    return finalOutput
}

module.exports = {formatDate, formatDatePlain}