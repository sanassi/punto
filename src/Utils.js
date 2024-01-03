export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function initBoard(dimension, color) {
    let arr = Array.from({length: dimension * dimension});
    return arr.map((t, index) => {
        return {
            x: Math.floor(index / dimension),
            y: Math.floor(index % dimension),
            visible: false,
            playerColor: color,
            card: 0
        };
    });
}

export function shuffle(array) {
    return array.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function generateArray(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        result.push(i);
    }
    return result;
}

/**
 * Returns an array with values in [1, n]
 * Each value is the array <code>numberOfDuplicates</code> times
 * @param n
 * @param numberOfDuplicates
 * @returns an array of numbers
 */
export function initCards(n, numberOfDuplicates) {
    let arr = [];
    for (let i = 0; i < numberOfDuplicates; i++) {
        arr = arr.concat(generateArray(n));
    }

    return shuffle(arr);
}