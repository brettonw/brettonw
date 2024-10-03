import {hiraganaDictionary} from "./japanese.mjs";
import {} from "./utility.mjs";

let extractSyllabaryFromVocabulary = function (vocabulary, syllabary, start = "") {
    let extracted = {};
    for (const character of start) {
        extracted[character] = character;
    }
    for (const key of Object.keys(vocabulary)) {
        for (const character of key) {
            if (character in syllabary) {
                extracted[character] = character;
            }
        }
    }
    return Object.keys (extracted).shuffle().join("");
};

export let J12 = function () {
    let _ = Object.create (null);
    _.week1_hiragana_base = "あいうえお";
    _.week1_vocabulary = {
        // focus words
        "なん": "what",
        "でんわ": "phone",
        "みず": "water",
        "わたし": "I, me",
        "なまえ": "name",
        // kanji
        "何": "what",
        "私": "I, me",
        "木": "tree",
        // vocabulary list
        "上（うえ）": "above, up",
        "青い（あおい）": "blue",
        "日（ひ）": "day",
        "犬（いぬ）": "dog",
        "私（わたし）": "I, me",
        "わかりました": "I understand",
        "わかった": "I understand",
        "わかりません": "I don't understand",
        "わからない": "I don't understand",
        "めんなごさい": "I'm sorry",
        "わかりましたか": "Did you understand?",
        "です": "is",
        "月（げつ）": "month",
        "名前（なまえ）": "name",
        "いいえ": "no",
        "電話（でんわ）": "phone",
        "か": "spoken question mark",
        "ありがとうございました": "Thank you very much",
        "切符（きっぷ）": "ticket",
        "電車（でんしゃ）": "train",
        "木（き）": "tree",
        "何（なに・なん）": "what",
        "水（みず）": "water",
        "はい": "yes"
    };
    _.week1_hiragana = extractSyllabaryFromVocabulary (_.week1_vocabulary, hiraganaDictionary, _.week1_hiragana_base);

    _.week2_hiragana_base = "かきくけこさしすせそは";
    _.week2_vocabulary = {
        // focus words
        "いきます": "go",
        "たべます": "eat",
        "にほんご": "Japanese",
        "こうえん": "park",
        "いぬ": "dog",
        // kanji
        "犬": "dog",
        "語": "word, language",
        "行": "go",
        // vocabulary list
        "飴（あめ）": "candy, sweets",
        "犬（いぬ）": "dog",
        "食べます（たべます）": "eat (polite)",
        "行きます（いきます）": "go (polite)",
        "さようなら": "goodbye, farewell",
        "こんばんは": "good evening",
        "おはようございます": "good morning (polite)",
        "おやすみなさい": "good night (polite)",
        "こんにちは": "hello, good afternoon",
        "私（あたし）": "I, me (fem)",
        "僕（ぼく）": "I, me (masc)",
        "わかりません": "I don't understand",
        "アイスクリーム": "ice cream",
        "です": "is",
        "日本語（にほんご）": "Japanese language",
        "名前 （なまえ）": "name",
        "はじめまして": "nice to meet you",
        "煩い（うるさい）": "noisy",
        "公園（こうえん）": "park",
        "よろしくおねがいします": "pleased to meet you",
        "じゃまた": "see you",
        "何（なに・なん）": "what"
    };
    _.week2_hiragana = extractSyllabaryFromVocabulary (_.week2_vocabulary, hiraganaDictionary, _.week2_hiragana_base);

    _.week3_hiragana = "";
    _.week3_vocabulary = {"": ""};

    _.week4_hiragana = "";
    _.week4_vocabulary = {"": ""};
    return _;
} ();
