
// quiz process
// given:
// - a dictionary that is a word or symbol and its meaning
// - an ordering of the keys of the dictionary (or random)
// - a sample size (n) - 3, 4, or 5?
// take a sample group of n words from the ordered keys

// loop:
//   loop:
//      random match with the current sample set
//      - multiple choice of word and n possible meanings, or
//      - multiple choice of meaning and 5 possible words
//      until... player scores correct on 2x the current sample size
//    add 1 word to the current sample set

import {randomInt} from "./utility.mjs";

export let Quiz = function () {
    let _ = Object.create (null);

    // create and initialize a new quiz object
    _.new = function (parameters) {
        let instance = Object.create (this);
        return instance.init(parameters);
    };

    // initialize a new quiz object
    _.init = function (parameters) {
        // get the names of the qiz elements
        let wordName = "word" in parameters ? parameters.word: "word";
        let buttonsName = "buttons" in parameters ? parameters.buttons: "buttons";
        let correctName = "correct" in parameters ? parameters.correct: "correct";
        let levelName = "level" in parameters ? parameters.level: "level";

        // get the actual quiz elements
        this.wordElement = document.getElementById(wordName);
        this.buttonsElement = document.getElementById(buttonsName);
        this.correctElement = document.getElementById(correctName);
        this.levelElement = document.getElementById(levelName);

        // get the sounds and set the volume down a bit
        this.correctSoundElement = document.getElementById("correctSound");
        this.wrongSoundElement = document.getElementById("wrongSound");
        this.correctSoundElement.volume = 0.25;
        this.wrongSoundElement.volume = 0.25

        // figure the difficulty with a default of 4
        let difficulty = "difficulty" in parameters ? parameters.difficulty : 4;

        // create the buttons for the requested difficulty
        let $ = this;
        let buttons = [];
        for (let i = 0; i < difficulty; ++i) {
            // create the button HTML element
            let button = document.createElement ("div");
            button.className = "outlined";
            button.addEventListener ("click", function () { $.click (i); })
            this.buttonsElement.appendChild (button);

            // save the button so we can change the innerHTML
            buttons.push (button);
        }
        this.buttons = buttons;

        // save the dictionary and the keys to use
        let dictionary = this.dictionary = parameters.dictionary;
        this.keys = "keys" in parameters ? parameters.keys : Object.keys (dictionary).reduce ((acc, val) => { return acc + val;},  "");

        // double extra important
        return this;
    };

    // when a button in the quiz is clicked...
    _.click = function (button_id) {
        if (this.quiz.value === this.buttons[button_id].innerHTML) {
            // celebrate
            this.correctSoundElement.play();

            // set the known flag
            this.known[this.quiz.value] = true;

            // check to see if we go to the next level
            if (this.correct++ >= this.target) {
                this.level = Math.min(this.level + 1, this.keys.length);
                this.correct = 0;
            }
            this.makeQuiz();
        } else {
            // womp womp
            this.wrongSoundElement.play();

            // set the backround color on the clicked element to red
            this.buttons[button_id].style.backgroundColor = "red";

            // reset the score
            this.correct = 0;
        }
        this.display();
    };

    _.makeQuiz = function () {
        // flip a coin to decide if we show the word and possible definitions, or the definition and
        // possible words
        let coinToss = randomInt(2) === 1;

        // generate a random word index (not the same as the last one...), and get the key and the value
        let quizIndex = randomInt (this.level);
        while (quizIndex === this.quiz.index) {
            quizIndex = randomInt (this.level);
        }
        let quizKey = this.keys[quizIndex];
        let quizValue = this.dictionary[quizKey];
        if (coinToss) {
            let tmp = quizKey;
            quizKey = quizValue;
            quizValue = tmp;
        }
        this.wordElement.innerHTML = quizKey;
        this.wordElement.style.fontSize = (quizKey.length == 1) ? "20vh" : (quizKey.length > 4) ? "10vh" : "15vh";
        this.quiz = { index: quizIndex, key: quizKey, value: quizValue};

        console.log(Object.keys(this.known));
        console.log(this.quiz);

        // generate a list of possible definitions
        let values = [quizValue];
        for (let i = 1; i < this.difficulty; ++i) {
            let value;
            do {
                // generate a possible random value in the range
                let randomKey = this.keys[randomInt(this.level)];
                value = coinToss ? randomKey : this.dictionary[randomKey];
            } while (values.includes (value));
            values.push (value);
        }

        // permute the values
        Array.shuffle(values);

        // set the answers on the buttons, cheat if we should
        for (let i = 0; i < this.difficulty; ++i) {
            this.buttons[i].innerHTML = values[i];
            this.buttons[i].style.backgroundColor = ((values[i] === quizValue) && !(quizValue in this.known)) ? "rgba(0,255,0,0.5)" : "white";
        }
    };

    _.display = function () {
        this.correctElement.innerHTML = this.correct + " / " + this.target;
        this.levelElement.innerHTML = this.level;
    };

    _.start = function () {
        // store the difficulty as the current level and countdown
        this.level = this.difficulty;
        this.correct = 0;

        this.quiz = { index: -1, key: "", value: ""};
        this.known = {};

        // show the quiz
        this.makeQuiz ();
        this.display ();
    };

    Object.defineProperties(_, {
        difficulty: { get: function () { return this.buttons.length; }},
        target: { get: function () { return this.difficulty + this.level; }}
    });

    return _;
} ();
