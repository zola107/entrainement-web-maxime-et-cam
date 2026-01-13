





const gameModal = document.getElementById('gameModal');
const openGameBtn = document.getElementById('openGame');
const closeGameBtn = document.getElementById('closeGame');
const restartBtn = document.getElementById('restartGame');

openGameBtn.addEventListener('click', () => {
    gameModal.classList.add('active');
    startGame();
});

closeGameBtn.addEventListener('click', () => {
    gameModal.classList.remove('active');
    gameRunning = false;
});

restartBtn.addEventListener('click', () => {
    startGame();
});

// Jeu Space Invaders
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let gameRunning = false;
let score = 0;
let player, bullets, enemies, gameLoop;

class Player {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - 60;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = '#00d4ff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#8a2be2';
        ctx.fillRect(this.x + 10, this.y - 10, 20, 10);
    }

    move(direction) {
        if (direction === 'left' && this.x > 0) {
            this.x -= this.speed;
        }
        if (direction === 'right' && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 15;
        this.speed = 7;
    }

    draw() {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= this.speed;
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 45;
        this.height = 45;
        this.speed = 1;
    }

    draw() {
        ctx.fillStyle = '#ff0066';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x + 10, this.y + 10, 5, 5);
        ctx.fillRect(this.x + 20, this.y + 10, 5, 5);
    }

    update() {
        this.y += this.speed;
    }
}

function createEnemies() {
    enemies = [];
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 8; col++) {
            enemies.push(new Enemy(col * 70 + 20, row * 50 + 30));
        }
    }
}

function startGame() {
    gameRunning = true;
    score = 0;
    scoreDisplay.textContent = score;
    player = new Player();
    bullets = [];
    createEnemies();
    
    if (gameLoop) cancelAnimationFrame(gameLoop);
    update();
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();

    // Bullets
    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw();
        
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }

        // Collision avec ennemis
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                bullets.splice(index, 1);
                enemies.splice(eIndex, 1);
                score += 10;
                scoreDisplay.textContent = score;
            }
        });
    });

    // Enemies
    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();

        if (enemy.y > canvas.height) {
            gameRunning = false;
            ctx.fillStyle = '#ff0000';
            ctx.font = '40px Arial';
            ctx.fillText('GAME OVER!', canvas.width/2 - 120, canvas.height/2);
        }
    });

    if (enemies.length === 0) {
        gameRunning = false;
        ctx.fillStyle = '#00ff00';
        ctx.font = '40px Arial';
        ctx.fillText('YOU WIN!', canvas.width/2 - 100, canvas.height/2);
    }

    gameLoop = requestAnimationFrame(update);
}

// Contrôles
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ' && gameRunning) {
        e.preventDefault();
        bullets.push(new Bullet(player.x + player.width/2 - 2, player.y));
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

setInterval(() => {
    if (gameRunning) {
        if (keys['ArrowLeft']) player.move('left');
        if (keys['ArrowRight']) player.move('right');
    }
}, 1000/60);