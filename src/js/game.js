import { WORDS, KEYBOARD_LETTERS } from './consts';

const gameDiv = document.getElementById('game');
const logo = document.getElementById('logo');

let triesLeft;
let winCount;

const createPlaceholderHTML = () => {
	const word = sessionStorage.getItem('word');
	const wordArray = Array.from(word);
	const placeholdersHTML = wordArray.reduce(
		(acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter"> _ </h1>`,
		'',
	);
	return `<div id="placeholders" class="mb-2 placeholders-wrapper">${placeholdersHTML}</div>`;
};

const createKeyboard = () => {
	const keyboard = document.createElement('div');
	keyboard.classList.add('keyboard');
	keyboard.id = 'keyboard';

	const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
		return acc + `<button class="button-primary keyboard-button" id="${curr}">${curr}</button>`;
	}, '');

	keyboard.innerHTML = keyboardHTML;
	return keyboard;
};

const createHangmanImg = () => {
	const image = document.createElement('img');
	image.src = 'images/hg-0.png';
	image.alt = 'hangman image';
	image.classList.add('hangman-img');
	image.id = 'hangman-img';

	return image;
};

const checkLetter = (letter) => {
	const word = sessionStorage.getItem('word');
	const inputLetter = letter.toLowerCase();
	if (!word.includes(inputLetter)) {
		const triesCounter = document.getElementById('tries-left');
		triesLeft -= 1;
		triesCounter.innerText = triesLeft;

		if (triesLeft === 0) stopGame('lose');

		const hangmanImg = document.getElementById('hangman-img');
		hangmanImg.src = `images/hg-${10 - triesLeft}.png`;
	} else {
		const wordArray = Array.from(word);
		wordArray.forEach((currentLetter, i) => {
			if (currentLetter === inputLetter) {
				winCount += 1;
				if (winCount === word.length) {
					stopGame('win');
					return;
				}
				document.getElementById(`letter_${i}`).innerText = inputLetter.toUpperCase();
			}
		});
	}
};

export const startGame = () => {
	triesLeft = 10;
	winCount = 0;
	logo.classList.add('logo-sm');
	const randomIndex = Math.floor(Math.random() * WORDS.length);
	const wordToGuess = WORDS[randomIndex];
	sessionStorage.setItem('word', wordToGuess);

	gameDiv.innerHTML = createPlaceholderHTML();
	gameDiv.innerHTML += `<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>`;

	const hangmanImg = createHangmanImg();
	const keyboardDiv = createKeyboard();

	keyboardDiv.addEventListener('click', (event) => {
		if (event.target.tagName.toLowerCase() === 'button') {
			event.target.disabled = true;
			checkLetter(event.target.id);
		}
	});

	gameDiv.prepend(hangmanImg);
	gameDiv.append(keyboardDiv);

	gameDiv.insertAdjacentHTML(
		'beforeend',
		'<button id="quit" class="button-secondary px-2 py-1">Quit</button>',
	);
	document.getElementById('quit').onclick = () => {
		const isSure = confirm('Are you sure you want to quit and lose progress?');
		isSure && stopGame('quit');
	};
};

const stopGame = (status) => {
	document.getElementById('placeholders').remove();
	document.getElementById('tries').remove();
	document.getElementById('keyboard').remove();
	document.getElementById('quit').remove();

	const word = sessionStorage.getItem('word');

	switch (status) {
		case 'win':
			document.getElementById('hangman-img').src = 'images/hg-win.png';
			document.getElementById('game').innerHTML += '<h2 class="result-header win">You won!</h2>';
			break;
		case 'lose':
			document.getElementById('game').innerHTML +=
				'<h2 class="result-header lose">You lost :(</h2>';
			break;
		case 'quit':
			logo.classList.remove('logo-sm');
			document.getElementById('hangman-img').remove();
			break;
		default:
			break;
	}

	document.getElementById(
		'game',
	).innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="button-primary px-5 py-3 mt-5 text-center">Play again</button>`;
	document.getElementById('play-again').onclick = startGame;
};
