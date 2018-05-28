function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
    var length = arr.length;
    var original;
    var swap;

    while(length) {
        swap = Math.floor(Math.random() * length);
        length--;

        original = arr[length];
        arr[length] = arr[swap];
        arr[swap] = original;
    }

    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
    if (this.playersGuess < this.winningNumber) {
        return true;
    } else {
        return false;
    }
}

Game.prototype.playersGuessSubmission = function (guess) {
    if (guess < 1 || guess > 100 || isNaN(guess)) {
        throw "That is an invalid guess.";
    } else {
        this.playersGuess = guess;
    }

    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        disableButtons();
        return `You Win!`;
    } else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
        $("#play").text("Guess again");
        return `You have already guessed that number.`;
    } else if (this.pastGuesses.indexOf(this.playersGuess) < 0) {
        this.pastGuesses.push(this.playersGuess);
        $(".guesses li:nth-child(" + this.pastGuesses.length + ")").text(this.playersGuess);
        if (this.pastGuesses.length === 5) {
            disableButtons();
            $("guess").text("Press the reset button to play again.");
            return `You Lose.`;
        } else if (this.difference() < 10) {
            return `You're burning up!`
        } else if (this.difference() < 25) {
            return `You're lukewarm.`
        } else if (this.difference() < 50) {
            return `You're a bit chilly.`
        } else if (this.difference() < 100) {
            return `You're ice cold!`
        }
    }
}

function newGame() {
    var result = new Game();
    $("#play").text("Play the Guessing Game!");
    $("#guess").text("Guess a number between 1 - 100!");
    $("#player-input").val("");
    $(".guess").text("-");
    enableButtons();
    return result;
}

function disableButtons() {
    $("#submit-player-input").prop("disabled", true);
    $("#hint").prop("disabled", true);
}

function enableButtons() {
    $("#submit-player-input").prop("disabled", false);
    $("#hint").prop("disabled", false);
}

Game.prototype.provideHint = function() {
    var hint = [];
    hint.push(this.winningNumber);
    hint.push(generateWinningNumber());
    hint.push(generateWinningNumber());
    
    return shuffle(hint).join(", ");
}

function getGuess(currentGame) {
    var guess = +($("#player-input").val());
    $("#player-input").val("");
    var result = currentGame.playersGuessSubmission(guess);
    console.log(result);
    $("#guess").text(result);
}


$(document).ready(function() {
    var game = newGame();
   
    $("#submit-player-input").on("click", function() {
        getGuess(game);
    });
    $("#player-input").keypress(function(key) {
        if(key.keyCode === 13) {
            getGuess(game);
        }
    });
    $("#reset").on("click", function() {
        game = newGame();
    });

    $("#hint").on("click", function() {
        $("#play").text("Here's a hint. One of these three is the number!");
        $("#guess").text(game.provideHint());
    });
});