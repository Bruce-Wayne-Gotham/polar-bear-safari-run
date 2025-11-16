class DinosaurGame {
    constructor() {
        this.dinosaur = document.getElementById('dinosaur');
        this.obstacle = document.getElementById('obstacle');
        this.cloud = document.getElementById('cloud');
        this.gameArea = document.getElementById('game-area');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.restartBtn = document.getElementById('restart-btn');
        this.gameOverRestartBtn = document.getElementById('game-over-restart');
        
        this.score = 0;
        this.highScore = localStorage.getItem('dinoHighScore') || 0;
        this.isJumping = false;
        this.isGameOver = false;
        this.gameSpeed = 5;
        this.obstacleSpeed = 2000;
        this.cloudSpeed = 15000;
        
        this.init();
    }
    
    init() {
        this.highScoreElement.textContent = this.highScore;
        this.setupEventListeners();
        this.startGame();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isGameOver) {
                e.preventDefault();
                this.jump();
            }
        });
        
        this.gameArea.addEventListener('click', () => {
            if (!this.isGameOver) {
                this.jump();
            }
        });
        
        this.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
        
        this.gameOverRestartBtn.addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    jump() {
        if (this.isJumping) return;
        
        this.isJumping = true;
        this.dinosaur.classList.add('jumping');
        
        setTimeout(() => {
            this.dinosaur.classList.remove('jumping');
            this.isJumping = false;
        }, 300);
    }
    
    startGame() {
        this.isGameOver = false;
        this.score = 0;
        this.gameSpeed = 5;
        this.obstacleSpeed = 2000;
        
        this.startObstacleMovement();
        this.startCloudMovement();
        this.startScoreCounter();
        this.checkCollision();
    }
    
    startObstacleMovement() {
        this.moveObstacle();
        this.obstacleInterval = setInterval(() => {
            if (!this.isGameOver) {
                this.moveObstacle();
            }
        }, this.obstacleSpeed);
    }
    
    moveObstacle() {
        this.obstacle.classList.remove('moving');
        void this.obstacle.offsetWidth;
        this.obstacle.classList.add('moving');
        
        this.obstacle.addEventListener('animationend', () => {
            if (!this.isGameOver) {
                this.obstacle.classList.remove('moving');
            }
        }, { once: true });
    }
    
    startCloudMovement() {
        this.moveCloud();
        this.cloudInterval = setInterval(() => {
            if (!this.isGameOver) {
                this.moveCloud();
            }
        }, this.cloudSpeed + Math.random() * 5000);
    }
    
    moveCloud() {
        this.cloud.classList.remove('moving');
        void this.cloud.offsetWidth;
        this.cloud.classList.add('moving');
        
        this.cloud.addEventListener('animationend', () => {
            if (!this.isGameOver) {
                this.cloud.classList.remove('moving');
            }
        }, { once: true });
    }
    
    startScoreCounter() {
        this.scoreInterval = setInterval(() => {
            if (!this.isGameOver) {
                this.score++;
                this.scoreElement.textContent = this.score;
                
                if (this.score % 100 === 0) {
                    this.increaseDifficulty();
                }
            }
        }, 100);
    }
    
    increaseDifficulty() {
        if (this.obstacleSpeed > 1000) {
            this.obstacleSpeed -= 100;
            clearInterval(this.obstacleInterval);
            this.startObstacleMovement();
        }
    }
    
    checkCollision() {
        this.collisionInterval = setInterval(() => {
            if (this.isGameOver) return;
            
            const dinoRect = this.dinosaur.getBoundingClientRect();
            const obstacleRect = this.obstacle.getBoundingClientRect();
            
            if (
                dinoRect.left < obstacleRect.left + obstacleRect.width &&
                dinoRect.left + dinoRect.width > obstacleRect.left &&
                dinoRect.top < obstacleRect.top + obstacleRect.height &&
                dinoRect.top + dinoRect.height > obstacleRect.top
            ) {
                this.gameOver();
            }
        }, 10);
    }
    
    gameOver() {
        this.isGameOver = true;
        clearInterval(this.obstacleInterval);
        clearInterval(this.cloudInterval);
        clearInterval(this.scoreInterval);
        clearInterval(this.collisionInterval);
        
        this.obstacle.classList.remove('moving');
        this.cloud.classList.remove('moving');
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dinoHighScore', this.highScore);
            this.highScoreElement.textContent = this.highScore;
        }
        
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
    }
    
    restartGame() {
        this.gameOverElement.style.display = 'none';
        this.scoreElement.textContent = '0';
        
        clearInterval(this.obstacleInterval);
        clearInterval(this.cloudInterval);
        clearInterval(this.scoreInterval);
        clearInterval(this.collisionInterval);
        
        this.obstacle.classList.remove('moving');
        this.cloud.classList.remove('moving');
        
        setTimeout(() => {
            this.startGame();
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DinosaurGame();
});
