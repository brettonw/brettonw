import {hiraganaLexicographicOrder, hiraganaDictionary, hiraganaFrequencyOrder} from "./japanese.mjs";
import {Quiz} from "./quiz.mjs";
import {} from "./utility.mjs";

const urlParams = new URLSearchParams(window.location.search);

// access specific query parameters
const difficulty = urlParams.has("difficulty") ? parseInt(urlParams.get("difficulty"), 10) : 4;
const dictionaryName = urlParams.has("dictionary") ? urlParams.get("dictionary") : "hiragana";
const keysName = urlParams.has("keys") ? urlParams.get("keys") : "random";

const dictionary = {
    "hiragana": hiraganaDictionary
}[dictionaryName];

const keys = {
    "hiragana": {
        "lexicographic": hiraganaLexicographicOrder,
        "frequency": hiraganaFrequencyOrder,
        "random": Array.shuffle (Object.keys (hiraganaDictionary)).reduce ((acc, val) => { return acc + val;},  "")
    }
}[dictionaryName][keysName];

Quiz.new ({ difficulty: difficulty, dictionary: dictionary, keys: keys, word: "word-content" }).start();
