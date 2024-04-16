import '../css/style.css';
import { darkModeHandle } from './utils';
import { startGame } from './game';

darkModeHandle();

const startGameButton = document.getElementById('startGame');
startGameButton.addEventListener('click', startGame);
