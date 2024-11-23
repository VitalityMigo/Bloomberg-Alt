function formatDate(input) {
// Créer un objet Date à partir du timestamp
const date = new Date(input);

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

module.exports = formatDate