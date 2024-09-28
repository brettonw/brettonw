const vowelIndex = ["", "a", "i", "u", "e", "o"];
const consonantIndex = ["", "k", "s", "t", "n", "h", "m", "y", "r", "w", "g", "z", "d", "b", "p"];
const synonyms = {
    "si": "shi",
    "ti": "chi", "tu": "tsu",
    "ha": "wa", "hu": "fu",
    "wo": "o",
    "zi": "ji",
    "di": "dzi", "du": "dzu"
};
const consonantMasks = [
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

export const hiraganaLexicographicOrder =
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

export const katakanaLexicographicOrder =
    "アイウエオ" + // ""
    "カキクケコ" + // "k"
    "サシスセソ" + // "s"
    "タチツテト" + // "t"
    "ンナニヌネノ" + // "n"
    "ハヒフヘホ" + // "h"
    "マミムメモ" + // "m"
    "ヤユヨ" + // "y"
    "ラリルレロ" + // "r"
    "ワヲ" + // "w"
    "ガギグゲゴ" + // "g"
    "ザジズゼゾ" + // "z"
    "ダヂヅデド" + // "d"
    "バビブベボ" + // "b"
    "パピプペポ"  // "p"
;

let makeDictionary = function (lexicographicOrder) {
    let dictionary = {};
    let index = 0;
    for (let i = 0; i < consonantIndex.length; i++) {
        let consonant = consonantIndex[i];
        let consonantMask = consonantMasks[i];
        for (let j = 0; j < vowelIndex.length; j++) {
            if (consonantMask[j] === "x") {
                let assembly = consonant + vowelIndex[j];
                if (assembly.length > 0) {
                    let character = lexicographicOrder[index++];
                    dictionary[character] = (assembly in synonyms) ? synonyms[assembly] + ` (${assembly})` : assembly;
                }
            }
        }
    }
    return dictionary;
};

export const hiraganaDictionary = makeDictionary(hiraganaLexicographicOrder);
export const katakanaDictionary = makeDictionary(katakanaLexicographicOrder);

const ordered = "う,ん,い,か,に,の,く,と,し,は,た,ち,き,こ,て,さ,つ,な,せ,が,る,ろ,け,を,ど,よ,ぜ,で,り,お,ら,ご,じ,す,あ,も,だ,きゅ,め,ま,れ,え,きょ,しょ,しゅ,ほ,そ,ちょ,み,ね,ひ,げ,わ,ふ,ぶ,じょ,しゃ,ぎ,や,ン,りょ,ば,ぱ,ル,ス,ぎょ,べ,ざ,む,ト,び,イ,じゅ,へ,ちゅ,ゆ,ぽ,ぞ,ぼ,ラ,フ,ク,ひょ,ド,ず,にゅ,リ,ぐ,レ,づ,ア,タ,ぴょ,コ,ポ,マ,ム,エ,ビ,ロ,バ,プ,ウ,テ,ナ,チ,メ,カ,オ,デ,サ,ハ,ベ,ダ,ジ,ブ,シ,ソ,セ,ミ,りゅ,ニ,ちゃ,ネ,パ,グ,ズ,ノ,ワ,ショ,ぺ,ペ,キ,ケ,きゃ,ガ,ニュ,ジョ,ツ,モ,びょ,ホ,ゴ,ジャ,みょ,ぷ,ゼ,ピ,ユ,じゃ,ボ,ぬ,ヘ,ヤ,シャ,ザ,ぴ,ヒ,キャ,ひゃ,シュ,ミュ,ギ,ジュ,ビュ,ピュ,ぢ,ヌ,チャ,チュ,りゃ,ゲ,ヨ,ヲ,キュ,みゃ,ぢょ,にょ,ぎゃ,ゾ,キョ,ヒャ,ヒュ,ヒュ,ヒョ,ミャ,みゅ,ミョ,ぢゃ,X,ぢゅ,X,X,チョ,リャ,リュ,リョ,びゃ,ビャ,びゅ,ビョ,にゃ,ニャ,ニョ,ギャ,ぎゅ,ギュ,ギョ,ぴゃ,ピャ,ピュ,ピョ,ヂ,ヅ".split(",");
let getByFrequency = function (dictionary) {
    // this frequency was derived from a japanese language news site, about 8MB of text
    let output = "";
    for (let syllable of ordered) {
        if (syllable in dictionary) {
            output += syllable;
        }
    }
    return output;
};

export const hiraganaFrequencyOrder = getByFrequency (hiraganaDictionary);
export const katakanaFrequencyOrder = getByFrequency (katakanaDictionary);
