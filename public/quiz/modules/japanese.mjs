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

export let hiraganaLexigraphicalOrder =
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

let makeHiraganaDictionary = function () {
    let dictionary = {};
    let hiraganaIndex = 0;
    for (let i = 0; i < consonantIndex.length; i++) {
        let consonant = consonantIndex[i];
        let consonantMask = consonantMasks[i];
        for (let j = 0; j < vowelIndex.length; j++) {
            if (consonantMask[j] === "x") {
                let assembly = consonant + vowelIndex[j];
                if (assembly.length > 0) {
                    let hiraganaChar = hiraganaLexigraphicalOrder[hiraganaIndex++];
                    let hiraganaName = (assembly in synonyms) ? synonyms[assembly] + ` (${assembly})` : assembly;
                    dictionary[hiraganaChar] = hiraganaName;
                }
            }
        }
    }
    return dictionary;
};

export let hiraganaDictionary = makeHiraganaDictionary();

let getHiraganaByFrequency = function () {
    // this frequency was derived from a japanese language news site, about 8MB of text
    let ordered = "う,ん,い,か,に,の,く,と,し,は,た,ち,き,こ,て,さ,つ,な,せ,が,る,ろ,け,を,ど,よ,ぜ,で,り,お,ら,ご,じ,す,あ,も,だ,きゅ,め,ま,れ,え,きょ,しょ,しゅ,ほ,そ,ちょ,み,ね,ひ,げ,わ,ふ,ぶ,じょ,しゃ,ぎ,や,ン,りょ,ば,ぱ,ル,ス,ぎょ,べ,ざ,む,ト,び,イ,じゅ,へ,ちゅ,ゆ,ぽ,ぞ,ぼ,ラ,フ,ク,ひょ,ド,ず,にゅ,リ,ぐ,レ,づ,ア,タ,ぴょ,コ,ポ,マ,ム,エ,ビ,ロ,バ,プ,ウ,テ,ナ,チ,メ,カ,オ,デ,サ,ハ,ベ,ダ,ジ,ブ,シ,ソ,セ,ミ,りゅ,ニ,ちゃ,ネ,パ,グ,ズ,ノ,ワ,ショ,ぺ,ペ,キ,ケ,きゃ,ガ,ニュ,ジョ,ツ,モ,びょ,ホ,ゴ,ジャ,みょ,ぷ,ゼ,ピ,ユ,じゃ,ボ,ぬ,ヘ,ヤ,シャ,ザ,ぴ,ヒ,キャ,ひゃ,シュ,ミュ,ギ,ジュ,ビュ,ピュ,ぢ,ヌ,チャ,チュ,りゃ,ゲ,ヨ,ヲ,キュ,みゃ,ぢょ,にょ,ぎゃ,ゾ,キョ,ヒャ,ヒュ,ヒュ,ヒョ,ミャ,みゅ,ミョ,ぢゃ,X,ぢゅ,X,X,チョ,リャ,リュ,リョ,びゃ,ビャ,びゅ,ビョ,にゃ,ニャ,ニョ,ギャ,ぎゅ,ギュ,ギョ,ぴゃ,ピャ,ピュ,ピョ,ヂ,ヅ".split(",");
    let output = "";
    for (let syllable of ordered) {
        if (syllable in hiraganaDictionary) {
            output += syllable;
        }
    }
    return output;
};

export let hiraganaFrequencyOrder = getHiraganaByFrequency ();
