// generate a random number in the range 0..max
export let randomInt = function (max) {
    return Math.floor(Math.random() * max);
}

// shuffle an array
export let shuffleArray = function (array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

Array.shuffle = shuffleArray;
Array.prototype.shuffle = function () { return shuffleArray(this); };
Array.prototype.shuffled = function () { return shuffleArray(...this); };
