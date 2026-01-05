import { Enemy } from './classes/Enemy.js';
import { Laser } from './classes/Laser.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

export class Game {
    constructor(ctx, uiElements) {
        this.ctx = ctx;
        this.scoreEl = uiElements.scoreEl;
        this.gameOverScreen = uiElements.gameOverScreen;
        this.pauseScreen = uiElements.pauseScreen;
        this.playerInput = uiElements.playerInput;
        
        this.reset();
        this.bindInput();
    }

    reset() {
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.enemies = [];
        this.lasers = [];
        this.currentTarget = null;
        this.spawnRate = 2000; //spawna um a cada 2 segundos
        this.lastSpawn = 0;
        
        this.scoreEl.innerText = 0;
        this.gameOverScreen.classList.add('hidden');
    }

    bindInput() {
        this.playerInput.focus();
        
        this.playerInput.addEventListener('keydown', (e) => {
            // 1. Pausa (Sempre checar primeiro)
            if (e.key === "Escape") {
                e.preventDefault(); 
                this.togglePause();
                return; 
            }
    
            // 2. Lógica de GAME OVER
            if (this.gameOver) {
                if (e.key === "Enter") {
                    this.reset();
                    this.playerInput.value = ''; // Limpa o input para o novo jogo
                }
                return; 
            }
    
            // 3. Bloqueio se estiver pausado (não deixa digitar enquanto pausado)
            if (this.paused) return;
    
            // 4. Lógica de Jogo 
            if (e.key === "Enter") {
                const value = this.playerInput.value.trim();
                if (value) {
                    this.handleTyping(value);
                    this.playerInput.value = '';
                }
                return;
            }
    
            const isNumber = /[0-9]/.test(e.key);
            const isControl = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key);
    
            if (!isNumber && !isControl) {
                e.preventDefault();
            }
        });
    
        //botões do Modal de Pause
        document.getElementById('btnResume')?.addEventListener('click', () => this.togglePause());
        document.getElementById('btnMenu')?.addEventListener('click', () => window.location.href = 'index.html');
    }
    
    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.pauseScreen.classList.remove('hidden');
        } else {
            this.pauseScreen.classList.add('hidden');
            document.getElementById('playerInput').focus();
            // Resetamos o lastSpawn para o tempo atual ao despausar
            // Isso evita que nasçam vários inimigos de uma vez ao voltar
            this.lastSpawn = performance.now(); 
        }
    }

    spawnEnemy() {

        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 10);
        const word = `${n1} + ${n2}` + ' = ?';
        const answer = (n1 + n2).toString();

        this.enemies.push(new Enemy(word, answer));
    }

    handleTyping(key) {
        // Lógica de Lock-on
        if (this.currentTarget) {
            if (this.currentTarget.answer === key) {
                this.shoot(this.currentTarget);
                //this.currentTarget.text = this.currentTarget.text.substring(1);
                
                this.destroyEnemy(this.currentTarget);
                this.currentTarget = null;
                
            }
        } else {
            // Busca novo alvo
            const targets = this.enemies.filter(e => e.answer === key);
            if (targets.length > 0) {
                targets.sort((a, b) => b.y - a.y); // Prioriza o mais baixo
                if (targets.length > 1){
                    targets.forEach(e => {
                        this.currentTarget = e;
                        this.handleTyping(key);
                    });
                }
                this.currentTarget = targets[0];
                this.handleTyping(key); // Chama recursivamente para processar o primeiro hit
            }else{
                this.shoot(null); // Dispara aleatoriamente se não houver alvo
            }
        }
    }

    shoot(target) {
        if (target != null){
            this.lasers.push(new Laser(CANVAS_WIDTH / 2, CANVAS_HEIGHT, target.x, target.y));
        }else{
            this.lasers.push(new Laser(CANVAS_WIDTH / 2, CANVAS_HEIGHT, Math.random() * (CANVAS_WIDTH - 100) + 50, CANVAS_HEIGHT / 2));
        }
    }

    destroyEnemy(enemy) {
        this.enemies = this.enemies.filter(e => e !== enemy);
        this.score += 10;
        this.scoreEl.innerText = this.score;
        if (this.spawnRate > 500) this.spawnRate -= 20; //aumenta a taxa de spawn
    }

    update(timestamp) {
        if (this.gameOver || this.paused) return;

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
                document.getElementById('finalScore').innerText = `Score Final: ${this.score}`;
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
        // O loop sempre roda, mas o update checa internamente se está pausado
        this.update(timestamp);
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }
    
    start() {
        requestAnimationFrame((t) => this.loop(t));
    }
}
