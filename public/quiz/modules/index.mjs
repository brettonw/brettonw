import {
    hiraganaDictionary, hiraganaLexicographicOrder, hiraganaFrequencyOrder,
    katakanaDictionary, katakanaLexicographicOrder, katakanaFrequencyOrder
} from "./japanese.mjs";
import {J12} from "./j12.mjs";
import {Quiz} from "./quiz.mjs";
import {} from "./utility.mjs";

const urlParams = new URLSearchParams(window.location.search);

// access specific query parameters
const difficulty = urlParams.has("difficulty") ? parseInt(urlParams.get("difficulty"), 10) : 4;
const dictionaryName = urlParams.has("dictionary") ? urlParams.get("dictionary") : "hiragana";
const keysName = urlParams.has("keys") ? urlParams.get("keys") : "random";

const dictionary = {
    "hiragana": hiraganaDictionary,
    "katakana": katakanaDictionary,
    "j12_week1": J12.week1_vocabulary,
    "j12_week2": J12.week2_vocabulary
}[dictionaryName];

const keysDictionary = {
    "hiragana": {
        "lexicographic": hiraganaLexicographicOrder,
        "frequency": hiraganaFrequencyOrder,
        "j12_week1_base": J12.week1_hiragana_base,
        "j12_week1": J12.week1_hiragana,
        "j12_week2_base": J12.week2_hiragana_base,
        "j12_week2": J12.week2_hiragana
    },
    "katakana": {
        "lexicographic": katakanaLexicographicOrder,
        "frequency": katakanaFrequencyOrder
    }
}[dictionaryName] || {};
const keys = keysName in keysDictionary ? keysDictionary[keysName] : Object.keys (dictionary).shuffle();

Quiz.new ({ difficulty: difficulty, dictionary: dictionary, keys: keys, word: "word-content" }).start();
