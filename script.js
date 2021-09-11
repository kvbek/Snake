const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

class Snake {
    constructor(snakeX, snakeY, width, height, color) {
        //this.x = x;
        //this.y = y;
        this.snakeBody = [
            {x: snakeX, y: snakeY}
        ]
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocity = 20;
        this.direction = null;
    }

    draw() {
        ctx.fillStyle = this.color;
        for (let i in this.snakeBody) {
            ctx.fillRect(this.snakeBody[i].x, this.snakeBody[i].y, this.width, this.height);
            ctx.strokeRect(this.snakeBody[i].x, this.snakeBody[i].y, this.width, this.height);
        }
    }

    move(event) {
        if (event.key === 'ArrowUp' && this.direction !== 'down') {
            // up
            this.direction = 'up';
        }
        else if (event.key === 'ArrowDown' && this.direction !== 'up') {
            // down
            this.direction = 'down';
        }
        else if (event.key === 'ArrowLeft' && this.direction !== 'right') {
            // left
            this.direction = 'left';
        }
        else if (event.key === 'ArrowRight' && this.direction !== 'left') {
            // right
            this.direction = 'right';
        }
    }

    update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const savedX = this.snakeBody[0].x;
        const savedY = this.snakeBody[0].y
        if (this.direction === 'up') {
            if (this.snakeBody[0].y <= 0) {
                this.snakeBody.unshift(
                    {
                        x: this.snakeBody[0].x,
                        y: canvas.height - this.height
                    })
            } else {
                this.snakeBody.unshift(
                    {
                        x: this.snakeBody[0].x,
                        y: this.snakeBody[0].y -= this.velocity
                    }
                )
            }
            this.snakeBody[1].x = savedX;
            this.snakeBody[1].y = savedY;
            this.snakeBody.pop();
        }
        else if (this.direction === 'down'){
            if (this.snakeBody[0].y >= canvas.height - this.height) {
                this.snakeBody.unshift(
                    {
                        x: this.snakeBody[0].x,
                        y: 0
                    })
            } else {
                this.snakeBody.unshift(
                    {
                        x: this.snakeBody[0].x,
                        y: this.snakeBody[0].y += this.velocity
                    }
                )
            }
            this.snakeBody[1].x = savedX;
            this.snakeBody[1].y = savedY;
            this.snakeBody.pop();
        }
        else if (this.direction === 'left') {
            if (this.snakeBody[0].x <= 0) {
                this.snakeBody.unshift(
                    {
                        x: canvas.width - this.width,
                        y: this.snakeBody[0].y
                    })
            } else {
                this.snakeBody.unshift(
                    {
                        x: this.snakeBody[0].x -= this.velocity,
                        y: this.snakeBody[0].y
                    }
                )
            }

            this.snakeBody[1].x = savedX;
            this.snakeBody[1].y = savedY;
            this.snakeBody.pop();
        }
        else if (this.direction === 'right') {
            if (this.snakeBody[0].x >= canvas.width - this.width) {
                this.snakeBody.unshift(
                    {
                        x: 0,
                        y: this.snakeBody[0].y
                    })
            } else {
                this.snakeBody.unshift(
                    {
                        x: this.snakeBody[0].x += this.velocity,
                        y: this.snakeBody[0].y
                    }
                )
            }

            this.snakeBody[1].x = savedX;
            this.snakeBody[1].y = savedY;
            this.snakeBody.pop();
        }
    }
    checkForCollisionWithTail() {
        for (let i = 1; i < this.snakeBody.length; i++) {
            if (this.snakeBody[0].x === this.snakeBody[i].x && this.snakeBody[0].y === this.snakeBody[i].y) {
                this.snakeBody = [{
                    x: 100,
                    y: 100
                }]
                this.direction = '';
                this.draw();
                score = 0;
            }
        }
    }

    eatApple() {
        if (this.snakeBody.length <= 0) {
            for(let i = 0; i < 2; i++) {
                this.snakeBody.unshift(
                    {
                        x: this.snakeBody[0].x,
                        y: this.snakeBody[0].y
                    }
                )
            }
        } else {
            this.snakeBody.unshift(
                {
                    x: this.snakeBody[0].x,
                    y: this.snakeBody[0].y
                })
        }
    }
}


class Apple {
    constructor(radius, color) {
        this.x = null;
        this.y = null;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    setRandomCoordinates() {
        let coordinatesList = [];
        for (let j = this.radius; j <= canvas.width - this.radius; j = j + 20) {
            coordinatesList.unshift(j);
        }
        let coordinatesCollideWithSnake = true;
        while (coordinatesCollideWithSnake) {
            let randomCoordinateX = coordinatesList[Math.floor(Math.random() * coordinatesList.length)];
            let randomCoordinateY = coordinatesList[Math.floor(Math.random() * coordinatesList.length)];
            for(let i = 0; i < snake.snakeBody.length; i++) {
                while (randomCoordinateX === snake.snakeBody[i].x + this.radius && randomCoordinateY === snake.snakeBody[i].y + this.radius) {
                    randomCoordinateX = coordinatesList[Math.floor(Math.random() * coordinatesList.length)];
                    randomCoordinateY = coordinatesList[Math.floor(Math.random() * coordinatesList.length)];
                }
            }
            this.x = randomCoordinateX
            this.y = randomCoordinateY
            coordinatesCollideWithSnake = false;
        }
    }

    setCollisionCoordinates() {
        this.collisionX = this.x - this.radius;
        this.collisionY = this.y - this.radius;
    }
}


function spawnApple() {
    apple = new Apple(10, 'red');
    apple.setRandomCoordinates();
    apple.setCollisionCoordinates();
    apple.draw();
}


let score = 0;
function increaseScore() {
    score ++;
    console.log(`Score: ${score}`);
    const scoreLabel = document.getElementById('score');
    scoreLabel.innerText = `Score: ${score}`;
}

// To make the snake go slower
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function animate() {
    await sleep(100);
    requestAnimationFrame(animate);
    snake.update();
    snake.checkForCollisionWithTail();
    if (snake.snakeBody[0].x === apple.collisionX && snake.snakeBody[0].y === apple.collisionY) {
        snake.eatApple();
        spawnApple();
        apple.draw();
        increaseScore();
    }
    snake.draw();
    apple.draw();
}
animate();

document.addEventListener('keydown', (event) => {
    snake.move(event);
});

const snake = new Snake(canvas.width/5,canvas.height/5,20, 20, 'green');
spawnApple();

















