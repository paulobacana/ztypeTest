import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants.js";

export class Player {
  constructor() {
    this.life = 100;

    this.width = 40;
    this.height = 40;

    // Carregando a imagem
    this.sprite = new Image();
    this.sprite.src = "./assets/Ship_1.png"; // Verifique o caminho do seu arquivo

    // Variáveis para animação
    this.hoverOffset = 0; // Vai controlar o movimento de flutuar
    this.hoverSpeed = 0.05; // Velocidade da oscilação
  }

  draw(ctx) {
    if (!this.sprite.complete) return; // Só desenha se a imagem carregou

    // LÓGICA DE ANIMAÇÃO:
    // Math.sin cria um movimento de onda (sobe e desce suavemente)
    this.hoverOffset += this.hoverSpeed;
    const animationY = Math.sin(this.hoverOffset) * 5; // O 5 é a altura do movimento

    const x = CANVAS_WIDTH / 2 - this.width / 2;
    const y = CANVAS_HEIGHT - 50 + animationY;

    // Desenha a Imagem
    ctx.drawImage(this.sprite, x, y, this.width, this.height);

    this.drawEngineThruster(ctx, x + this.width / 2, y + this.height);
  }

  //desenha o fogo do motor 
  drawEngineThruster(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fillStyle = "#00d2ff";
    ctx.fill();
  }

}
