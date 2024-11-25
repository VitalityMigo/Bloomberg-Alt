function getTodayISO() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ajoute un 0 si le mois est < 10
    const day = String(today.getDate()).padStart(2, '0');        // Ajoute un 0 si le jour est < 10

    return `${year}-${month}-${day}`;
}

module.exports = { getTodayISO}