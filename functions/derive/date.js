function formatDate(input) {
    return `${input.slice(4, 6)}/${input.slice(6, 8)}/${input.slice(0, 4)}`;
}

module.exports = formatDate