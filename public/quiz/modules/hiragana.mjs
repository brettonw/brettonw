let body = document.body;

let vowelIndex = ["", "a", "i", "u", "e", "o"];
let consonantIndex = ["", "k", "s", "t", "n", "h", "m", "y", "r", "w", "g", "z", "d", "b", "p"];
let synonyms = {
    "si": "shi",
    "ti": "chi", "tu": "tsu",
    "hu": "fu",
    "zi": "ji",
    "di": "dzi", "du": "dzu"
};
let consonantMasks = [
    " xxxxx", // ""
    " xxxxx", // "k"
    " xxxxx", // "s"
    " xxxxx", // "t"
    "xxxxxx", // "n"
    " xxxxx", // "h"
    " xxxxx", // "m"
    " x x x", // "y"
    " xxxxx", // "r"
    " x   x", // "w"
    " xxxxx", // "g"
    " xxxxx", // "z"
    " xxxxx", // "d"
    " xxxxx", // "p"
    " xxxxx"  // "b"
];

let maskOffsets = function () {
    let offsets = [];
    let offset = 0;
    offsets.push (offset);
    for (let i = 0, len = consonantMasks.length; i < len; i++) {
        let mask = consonantMasks[i];
        let maskLength = 0;
        for (let j = 0; j < mask.length; j++) {
            if (mask[j] === "x") ++maskLength;
        }
        offset += maskLength;
        offsets.push (offset);
    }
    return offsets;
} ();

export let hiragana =
    "あいうえお" + // ""
    "かきくけこ" + // "k"
    "さしすせそ" + // "s"
    "たちつてと" + // "t"
    "んなにぬねの" + // "n"
    "はひふへほ" + // "h"
    "まみむめも" + // "m"
    "やゆよ" + // "y"
    "らりるれろ" + // "r"
    "わを" + // "w"
    "がぎぐげご" + // "g"
    "ざじずぜぞ" + // "z"
    "だぢづでど" + // "d"
    "ばびぶべぼ" + // "b"
    "ぱぴぷぺぽ"  // "p"
;

export let makeHiraganaDictionary = function () {
    let dictionary = {};
    let hiraganaIndex = 0;
    for (let i = 0; i < consonantIndex.length; i++) {
        let consonant = consonantIndex[i];
        let consonantMask = consonantMasks[i];
        for (let j = 0; j < vowelIndex.length; j++) {
            if (consonantMask[j] === "x") {
                let assembly = consonant + vowelIndex[j];
                if (assembly.length > 0) {
                    let hiraganaChar = hiragana[hiraganaIndex++];
                    let hiraganaName = (assembly in synonyms) ? synonyms[assembly] + ` (${assembly})` : assembly;
                    dictionary[hiraganaChar] = hiraganaName;
                }
            }
        }
    }
    return dictionary;
};
