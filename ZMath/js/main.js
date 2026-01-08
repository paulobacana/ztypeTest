import { Game } from './Game.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuração do Canvas
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Elementos de UI
const uiElements = {
    scoreEl: document.getElementById('scoreEl'),
    lifeBar : document.getElementById('playerLifeBar'),
    lifeText : document.getElementById('lifeText'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    pauseScreen : document.getElementById('pauseModal'),
    playerInput: document.getElementById('playerInput'),
};

// Iniciar o Jogo
const game = new Game(ctx, uiElements);
game.start();