function searchMarkets(data, input) {
    // Vérifie si l'input est vide ou undefined
    console.log(input)
    if (!input) {
        return data; // Retourne le tableau complet si aucun filtre
    }

    // Filtre les objets en fonction de la valeur "market"
    return data.filter(item =>
        item.question.toLowerCase().includes(input.toLowerCase())
    );
}

module.exports = searchMarkets