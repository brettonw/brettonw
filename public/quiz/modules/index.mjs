import {hiragana, makeHiraganaDictionary} from "./hiragana.mjs";
import {Quiz} from "./quiz.mjs";

Quiz.new ({ difficulty: 4, dictionary: makeHiraganaDictionary (), keys: hiragana, word: "word-content" }).start();
