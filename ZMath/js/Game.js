import { Enemy } from './classes/Enemy.js';
import { Projectile } from './classes/Projectile.js';
import { Player } from './classes/Player.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

export class Game {
    constructor(ctx, uiElements) {
        this.ctx = ctx;
        this.scoreEl = uiElements.scoreEl;
        this.gameOverScreen = uiElements.gameOverScreen;
        this.pauseScreen = uiElements.pauseScreen;
        this.playerInput = uiElements.playerInput;
        this.lifeBar = uiElements.lifeBar;
        this.lifeText = uiElements.lifeText; 

        
        this.reset();
        this.bindInput();
    }

    reset() {
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.enemies = [];
        //this.lasers = [];
        this.projectiles = [];
        this.currentTarget = null;
        this.spawnRate = 2000; //spawna um a cada 2 segundos
        this.lastSpawn = 0;
        this.player = new Player();

        this.lifeBar.style.width = `${this.player.life}%`;
        this.lifeText.innerText = `${Math.ceil(this.player.life)}%`;
        this.lifeBar.className = "h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500";
        this.lifeText.className = "text-cyan-400 text-xs font-bold";
        
        this.scoreEl.innerText = 0;
        this.gameOverScreen.classList.add('hidden');
    }

    bindInput() {
        this.playerInput.focus();

        this.playerInput.addEventListener('blur',() => {
            this.playerInput.focus();
        });
        
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
                this.currentTarget.isRightAnswer = true;                
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
            //this.lasers.push(new Laser(CANVAS_WIDTH / 2, CANVAS_HEIGHT, target.x, target.y));

            this.projectiles.push(new Projectile(
                CANVAS_WIDTH / 2, 
                CANVAS_HEIGHT - 50, 
                target.x, 
                target.y,
            ));

        }else{
            this.projectiles.push(new Projectile(
                CANVAS_WIDTH / 2, 
                CANVAS_HEIGHT - 50, 
                Math.random() * (CANVAS_WIDTH - 100) + 50, 
                Math.random() * (CANVAS_HEIGHT),
            ));

            this.player.life -= 10;
            this.triggerDamageFlash();
            this.trackPlayerMove
            this.updateLifeUI(this.player.life);
        }
    }

    destroyEnemy(enemy) {
        this.enemies = this.enemies.filter(e => e !== enemy);
        this.score += 10;
        this.scoreEl.innerText = this.score;
        if (this.spawnRate > 500) this.spawnRate -= 20; //aumenta a taxa de spawn
    }

    updateLifeUI(currentLife) {
        const maxLife = 100;
        const percentage = Math.max(0, (currentLife / maxLife ) * 100); 
    
        // Atualiza a largura
        this.lifeBar.style.width = `${percentage}%`;
        this.lifeText.innerText = `${Math.ceil(percentage)}%`;
    
        // Lógica de cores baseada na saúde
        if (percentage <= 30) {
            this.lifeBar.className = "h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-500";
            this.lifeText.className = "text-red-500 text-xs font-bold animate-pulse";
        } else if (percentage <= 60) {
            this.lifeBar.className = "h-full bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-500";
            this.lifeText.className = "text-yellow-400 text-xs font-bold";
        } else {
            this.lifeBar.className = "h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500";
            this.lifeText.className = "text-cyan-400 text-xs font-bold";
        }
    }

    triggerDamageFlash() {
        const flash = document.getElementById('damageFlash');
        if (!flash) return;
    
        flash.classList.remove('opacity-0'); // Mostra o vermelho
        
        // Após 150ms, esconde novamente
        setTimeout(() => {
            flash.classList.add('opacity-0');
        }, 150);
    
        // Bônus: Pequeno shake (tremida) no canvas
        const canvas = document.getElementById('gameCanvas');
        canvas.classList.add('translate-x-1');
        setTimeout(() => canvas.classList.remove('translate-x-1'), 50);
    }

    update(timestamp) {
        if (this.gameOver || this.paused) return;

        // Spawner
        if (timestamp - this.lastSpawn > this.spawnRate) {
            this.spawnEnemy();
            this.lastSpawn = timestamp;
        }

        // --- ATUALIZAR PROJÉTEIS E CHECAR COLISÃO ---
        this.projectiles.forEach((proj) => {
            proj.update(); // Move o projétil

            // Checa colisão com cada inimigo
            this.enemies.forEach((enemy) => {
                const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
                
                // Se a distância for pequena, houve impacto
                if (dist < 30 && proj.active && enemy.isRightAnswer && enemy.y > 5) { 
                    this.destroyEnemy(enemy);
                    proj.active = false; // Desativa para ser removido no filtro abaixo
                }
            });
        });

        // Remove projéteis que saíram da tela ou colidiram
        this.projectiles = this.projectiles.filter(p => p.active);

        // Atualizar Inimigos
        this.enemies.forEach(enemy => {
            const hitBottom = enemy.update();
            if (hitBottom) {
                this.player.life -= 20;
                this.triggerDamageFlash();
                this.updateLifeUI(this.player.life);
                this.enemies = this.enemies.filter(e => e !== enemy); //remove o inimigo
            }
        });

        if (this.player.life <= 0) {
            this.gameOver = true;
            this.gameOverScreen.classList.remove('hidden');          
            document.getElementById('finalScore').innerText = `Score Final: ${this.score}`;
        }

        // Atualizar Lasers (remove os antigos)
        //this.lasers = this.lasers.filter(l => l.life > 0);
    }

    draw() {
        // Limpa tela
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.player.draw(this.ctx);

        // Desenha Entidades
        this.projectiles.forEach(p => p.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
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
