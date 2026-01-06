//import { SHIP_SPRITE_URL } from '../constants.js'; // Ou defina o caminho do sprite aqui

export class Projectile {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.sprite.src = './assets/bullet.png'; 
        this.sprite.rot
        this.speed = 10;
        this.radius = 5;
        this.active = true;

        // Cálculo da direção (Vetor unitário)
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;
        
        // Ângulo para rotacionar o sprite na direção do alvo
        this.angle = Math.atan2(dy, dx) + Math.PI / 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Desativa se sair da tela
        if (this.y < -50 || this.x < 0 || this.x > 800) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.rotate(this.angle - Math.PI / 2);
        
        // Desenha o Sprite do Projétil (ex: um missil 16x16)
        ctx.drawImage(this.sprite, -8, -8, 32, 32);
        
        ctx.restore();
    }
}