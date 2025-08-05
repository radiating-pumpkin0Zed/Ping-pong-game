const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 15, paddleHeight = 100;
const ballRadius = 10;
const playerX = 10;
const aiX = canvas.width - paddleWidth - 10;

let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() < 0.5 ? 1 : -1);

let playerScore = 0, aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '40px Arial';
    ctx.fillText(text, x, y);
}

function drawNet() {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillRect(canvas.width/2 - 1, i, 2, 20);
    }
}

// Game mechanics
function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() < 0.5 ? 1 : -1);
}

function collision(x, y, rectX, rectY, rectW, rectH) {
    // Closest point on rectangle to circle center
    let closestX = Math.max(rectX, Math.min(x, rectX + rectW));
    let closestY = Math.max(rectY, Math.min(y, rectY + rectH));
    let dx = x - closestX;
    let dy = y - closestY;
    return (dx * dx + dy * dy) < ballRadius * ballRadius;
}

// Main game loop
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Player paddle collision
    if (collision(ballX, ballY, playerX, playerY, paddleWidth, paddleHeight)) {
        ballSpeedX = Math.abs(ballSpeedX);
        // Add some "spin"
        let hitPos = (ballY - (playerY + paddleHeight/2)) / (paddleHeight/2);
        ballSpeedY = 5 * hitPos;
    }

    // AI paddle collision
    if (collision(ballX, ballY, aiX, aiY, paddleWidth, paddleHeight)) {
        ballSpeedX = -Math.abs(ballSpeedX);
        // Add some "spin"
        let hitPos = (ballY - (aiY + paddleHeight/2)) / (paddleHeight/2);
        ballSpeedY = 5 * hitPos;
    }

    // Score
    if (ballX - ballRadius < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Simple AI: follow the ball with some delay
    let aiCenter = aiY + paddleHeight/2;
    if (aiCenter < ballY - 20) {
        aiY += 5;
    } else if (aiCenter > ballY + 20) {
        aiY -= 5;
    }
    // Stay within bounds
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Net
    drawNet();

    // Scores
    drawText(playerScore, canvas.width/4, 60, "#fff");
    drawText(aiScore, 3*canvas.width/4, 60, "#fff");

    // Paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#fff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#fff");

    // Ball
    drawCircle(ballX, ballY, ballRadius, "#fff");
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - paddleHeight/2;
    // Stay within bounds
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

gameLoop();