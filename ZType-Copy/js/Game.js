import { Enemy } from './classes/Enemy.js';
import { Laser } from './classes/Laser.js';
import { WORDS_LIST, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

export class Game {
    constructor(ctx, uiElements) {
        this.ctx = ctx;
        this.scoreEl = uiElements.scoreEl;
        this.gameOverScreen = uiElements.gameOverScreen;
        
        this.reset();
        this.bindInput();
    }

    reset() {
        this.score = 0;
        this.gameOver = false;
        this.enemies = [];
        this.lasers = [];
        this.currentTarget = null;
        this.spawnRate = 2000; //spawna um a cada 2 segundos
        this.lastSpawn = 0;
        
        this.scoreEl.innerText = 0;
        this.gameOverScreen.classList.add('hidden');
    }

    bindInput() {
        window.addEventListener('keydown', (e) => {
            if (this.gameOver) {
                if (e.key === "Enter") this.reset();
                return;
            }
            this.handleTyping(e.key.toUpperCase());
        });
    }

    spawnEnemy() {
        const word = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
        this.enemies.push(new Enemy(word));
    }

    handleTyping(key) {
        // Lógica de Lock-on
        if (this.currentTarget) {
            if (this.currentTarget.text[0] === key) {
                this.shoot(this.currentTarget);
                this.currentTarget.text = this.currentTarget.text.substring(1);
                
                if (this.currentTarget.text.length === 0) {
                    this.destroyEnemy(this.currentTarget);
                    this.currentTarget = null;
                }
            }
        } else {
            // Busca novo alvo
            const targets = this.enemies.filter(e => e.text[0] === key);
            if (targets.length > 0) {
                targets.sort((a, b) => b.y - a.y); // Prioriza o mais baixo
                this.currentTarget = targets[0];
                this.handleTyping(key); // Chama recursivamente para processar o primeiro hit
            }
        }
    }

    shoot(target) {
        this.lasers.push(new Laser(CANVAS_WIDTH / 2, CANVAS_HEIGHT, target.x, target.y));
    }

    destroyEnemy(enemy) {
        this.enemies = this.enemies.filter(e => e !== enemy);
        this.score += 10;
        this.scoreEl.innerText = this.score;
        if (this.spawnRate > 500) this.spawnRate -= 20; //aumenta a taxa de spawn
    }

    update(timestamp) {
        if (this.gameOver) return;

        // Spawner
        if (timestamp - this.lastSpawn > this.spawnRate) {
            this.spawnEnemy();
            this.lastSpawn = timestamp;
        }

        // Atualizar Inimigos
        this.enemies.forEach(enemy => {
            const hitBottom = enemy.update();
            if (hitBottom) {
                this.gameOver = true;
                this.gameOverScreen.classList.remove('hidden');
            }
        });

        // Atualizar Lasers (remove os antigos)
        this.lasers = this.lasers.filter(l => l.life > 0);
    }

    draw() {
        // Limpa tela
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Player
        this.ctx.fillStyle = '#00a8ff';
        this.ctx.beginPath();
        this.ctx.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
        this.ctx.lineTo((CANVAS_WIDTH / 2) - 10, CANVAS_HEIGHT);
        this.ctx.lineTo((CANVAS_WIDTH / 2) + 10, CANVAS_HEIGHT);
        this.ctx.fill();

        // Desenha Entidades
        this.lasers.forEach(l => l.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx, e === this.currentTarget));
    }

    loop(timestamp) {
        this.update(timestamp);
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }
    
    start() {
        requestAnimationFrame((t) => this.loop(t));
    }
}
