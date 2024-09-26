
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

let Base = function () {
    let _ = Object.create (null);

    // create and initialize a new Base object
    _.new = function (parameters) {
        let instance = Object.create (this);
        return instance.init(parameters);
    };

    return _;
} ();

let QuizKey = function () {
    let _ = Object.create (Base);

    _.init = function (parameters) {
        this.index = randomInt(parameters.level);
        if (!(this.flipped = (randomInt(2) === 1))) {
            this.key = parameters.keys[this.index];
            this.value = parameters.dictionary[this.key];
        } else {
            this.value = parameters.keys[this.index];
            this.key = parameters.dictionary[this.value];
        }
        return this;
    };

    return _;
} ();

export let Quiz = function () {
    let _ = Object.create (Base);

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
        if (this.quizKey.value === this.buttons[button_id].innerHTML) {
            // celebrate
            this.correctSoundElement.play();

            // set the known flag for this quizkey value
            this.known[this.quizKey.value] = true;

            // check to see if we go to the next level
            if (this.correct++ >= this.target) {
                this.level = Math.min(this.level + 1, this.keys.length);
                this.correct = 0;
            }
            this.makeQuiz();
        } else {
            // womp womp
            this.wrongSoundElement.play();

            // set the background color on the clicked element to red
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

        // generate a random word index - not the same as the last one, and biased towards the new
        // values after a level change, and get the key and the value
        let quizKey;
        if (Object.keys(this.known).length !== (this.level * 2)) {
            do {
                quizKey = QuizKey.new(this);
            } while (quizKey.value in this.known)
        } else {
            do {
                quizKey = QuizKey.new(this);
            } while (quizKey.index === this.quizKey.index)
        }
        this.wordElement.innerHTML = quizKey.key;
        this.wordElement.style.fontSize = (quizKey.key.length === 1) ? "20vh" : (quizKey.key.length > 4) ? "10vh" : "15vh";
        this.quizKey = quizKey;

        console.log(Object.keys(this.known));
        console.log(this.quizKey);

        // generate a list of possible definitions
        let values = [quizKey.value];
        for (let i = 1; i < this.difficulty; ++i) {
            let value;
            do {
                // generate a possible random value in the range
                let randomKey = this.keys[randomInt(this.level)];
                value = quizKey.flipped ? randomKey : this.dictionary[randomKey];
            } while (values.includes (value));
            values.push (value);
        }

        // permute the values
        Array.shuffle(values);

        // set the answers on the buttons, cheat if we should
        for (let i = 0; i < this.difficulty; ++i) {
            this.buttons[i].innerHTML = values[i];
            this.buttons[i].style.backgroundColor = ((values[i] === quizKey.value) && !(quizKey.value in this.known)) ? "rgba(0,255,0,0.5)" : "white";
        }
    };

    _.display = function () {
        this.correctElement.innerHTML = this.correct + " / " + this.target;
        this.levelElement.innerHTML = this.level;
    };

    _.start = function () {
        // store the difficulty as the current level and initialize the correct count
        this.level = this.difficulty;
        this.correct = 0;

        // create a fake quizKey for the first time through and set the known to be an empty object
        this.quizKey = { index: -1, key: "", value: ""};
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
