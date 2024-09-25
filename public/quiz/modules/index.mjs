import {hiraganaLexigraphicalOrder, hiraganaDictionary, hiraganaFrequencyOrder} from "./japanese.mjs";
import {Quiz} from "./quiz.mjs";

Quiz.new ({ difficulty: 4, dictionary: hiraganaDictionary, keys: hiraganaFrequencyOrder, word: "word-content" }).start();
