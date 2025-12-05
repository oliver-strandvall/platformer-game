import Input, { Keys, MouseButtons } from './input.js';
import Button from './button.js';
const canvas = document.getElementById("canvas");
const input = new Input(canvas);
const StartButton = new Button(input, {x: canvas.width / 2 - 150, y: canvas.height / 1.3, text: "Start", width: 300, height: 150, fillColor: "rgba(75, 145, 250, 1)", hoverFillColor: "rgba(45, 145, 250, 1)"});
const MenuButton = new Button(input, {x: canvas.width / 2 - 150, y: canvas.height / 1.3, text: "Menu", width: 300, height: 150, fillColor: "rgba(75, 145, 250, 1)", hoverFillColor: "rgba(45, 145, 250, 1)"});
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d")

let allowJump = false
let selectedLevel = 0

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50
}

let velocity = {
    y: 0,
    x: 0
}

const acceleration = {
    x: 400,
    y: 400
}

const gravity = 750;

const friction = 0.75;

let menuLeft = {
    x: 50,
    y: canvas.height / 2 - 25,
    width: 100,
    height: 100,
}

let menuRight = {
    x: canvas.width - 50,
    y: canvas.height / 2 - 25,
    width: 100,
    height: 100,
}

let lava = {
    x: 0,
    y: canvas.height + 200,
    width: canvas.width,
    height: canvas.height
}

const levelData = [
    {level: 1, distance: 1850, best: 0, cleared: "no", attempts: 0, bestattempts: 0, currentattempts: 0, difficulty: "Easy", lavaspeed: 1, levelname: "The Basics", levelcolor: "rgba(35, 65, 115, 1)"},
    {level: 2, distance: 2750, best: 0, cleared: "no", attempts: 0, bestattempts: 0, currentattempts: 0, difficulty: "Medium", lavaspeed: 1.2, levelname: "Tower of Spikes", levelcolor: "rgba(35, 42, 115, 1)"},
    {level: 2, distance: 2000, best: 0, cleared: "no", attempts: 0, bestattempts: 0, currentattempts: 0, difficulty: "Hard", lavaspeed: 1.4, levelname: "?", levelcolor: "rgba(58, 35, 115, 1)"}
]

const level = [
    [
    {y: canvas.height - 50, width: canvas.width, height: 100, x: canvas.width / 2 - canvas.width / 2, type:"block"},
    {x: 0, y: -levelData[0].distance, width: 50, height: canvas.height + levelData[0].distance, type:"block"},
    {x: canvas.width - 50, y: -levelData[0].distance, width: 50, height: canvas.height + levelData[0].distance, type:"block"},
    {x: 0, y: 600, width: 300, height: 150, type:"block"},
    {x: 900, y: 600, width: 300, height: 150, type:"block"},
    {x: 450, y: 450, width: 300, height: 50, type:"block"},
    {x: 0, y: -425, width: 450, height: 750, type:"block"},
    {x: 750, y: -125, width: 450, height: 450, type:"block"},
    {x: 450, y: 300, width: 75, height: 25, type:"block"},
    {x: 675, y: 150, width: 75, height: 25, type:"block"},
    {x: 450, y: 0, width: 75, height: 25, type:"block"},
    {x: 450, y: -275, width: 75, height: 25, type:"block"},
    {x: 0, y: -550, width: 250, height: 150, type:"block"},
    {x: 550, y: -650, width: 100, height: 25, type:"block"},
    {x: 950, y: -750, width: 250, height: 150, type:"block"},
    {x: 550, y: -850, width: 100, height: 25, type:"block"},
    {x: 0, y: -950, width: 250, height: 150, type:"block"},
    {x: 475, y: -1095, width: 250, height: 20, type:"block"},
    {x: 485, y: -1096, width: 230, height: 5, type:"finish"},
    ],
    [
    {y: canvas.height - 50, width: canvas.width, height: 100, x: canvas.width / 2 - canvas.width / 2, type:"block"},
    {x: 0, y: -levelData[0].distance, width: 50, height: canvas.height + levelData[0].distance, type:"block"},
    {x: canvas.width - 50, y: -levelData[0].distance, width: 50, height: canvas.height + levelData[0].distance, type:"block"},
    {x: 300, y: 600, width: 50, height: 150, type:"block"},
    {x: 850, y: 600, width: 50, height: 150, type:"block"},
    {x: 475, y: 450, width: 250, height: 25, type:"block"},
    {x: 475, y: 300, width: 250, height: 25, type:"block"},
    {x: 0, y: 150, width: 250, height: 50, type:"block"},
    {x: 950, y: 150, width: 250, height: 50, type:"block"},
    {x: 475, y: 0, width: 250, height: 25, type:"block"},
    {x: 575, y: -50, width: 50, height: 50, type:"spike"},
    {x: 275, y: -150, width: 200, height: 25, type:"block"},
    {x: 725, y: -150, width: 200, height: 25, type:"block"},
    {x: 0, y: -320, width: 475, height: 50, type:"block"},
    {x: 725, y: -320, width: 475, height: 50, type:"block"},
    {x: 365, y: -370, width: 50, height: 50, type:"spike"},
    {x: 315, y: -370, width: 50, height: 50, type:"spike"},
    {x: 180, y: -370, width: 50, height: 50, type:"spike"},
    {x: 130, y: -370, width: 50, height: 50, type:"spike"},
    {x: 785, y: -370, width: 50, height: 50, type:"spike"},
    {x: 835, y: -370, width: 50, height: 50, type:"spike"},
    {x: 970, y: -370, width: 50, height: 50, type:"spike"},
    {x: 1030, y: -370, width: 50, height: 50, type:"spike"},
    {x: 50, y: -490, width: 25, height: 25, type:"block"},
    {x: 1125, y: -490, width: 25, height: 25, type:"block"},
    {x: 250, y: -640, width: 100, height: 25, type:"block"},
    {x: 825, y: -640, width: 100, height: 25, type:"block"},
    {x: 825, y: -640, width: 100, height: 25, type:"block"},
    {x: 550, y: -640, width: 100, height: 25, type:"block"},
    {x: 300, y: -645, width: 50, height: 5, type:"jumpad"},
    {x: 825, y: -645, width: 50, height: 5, type:"jumpad"},
    {x: 550, y: -740, width: 100, height: 100, type:"spike"},
    {x: 0, y: -925, width: 250, height: 50, type:"block"},
    {x: 950, y: -925, width: 250, height: 50, type:"block"},
    {x: 575, y: -1000, width: 50, height: 25, type:"block"},
    {x: 575, y: -1150, width: 50, height: 25, type:"block"},
    {x: 0, y: -1300, width: 400, height: 50, type:"block"},
    {x: 800, y: -1300, width: 400, height: 50, type:"block"},
    {x: 175, y: -1450, width: 850, height: 50, type:"block"},
    {x: 0, y: -1600, width: 150, height: 25, type:"block"},
    {x: 1050, y: -1600, width: 150, height: 25, type:"block"},
    {x: 400, y: -1725, width: 50, height: 25, type:"block"},
    {x: 400, y: -1730, width: 50, height: 5, type:"jumpad"},
    {x: 750, y: -1725, width: 50, height: 25, type:"block"},
    {x: 750, y: -1730, width: 50, height: 5, type:"jumpad"},
    {x: 555, y: -2000, width: 100, height: 25, type:"block"},
    {x: 565, y: -2001, width: 80, height: 5, type:"finish"},
    ],
    [
    {y: canvas.height - 50, width: canvas.width, height: 100, x: canvas.width / 2 - canvas.width / 2, type:"block"},
    {x: 0, y: -levelData[0].distance, width: 50, height: canvas.height + levelData[0].distance, type:"block"},
    {x: canvas.width - 50, y: -levelData[0].distance, width: 50, height: canvas.height + levelData[0].distance, type:"block"},
    {x: 300, y: 745, width: 50, height: 5, type:"jumpad"},
    ]
]

let currentScene = "gamestart"

let firstPlay = true

let newBest = false

let lastTime = performance.now();

let opacity = 1;

gameLoop(performance.now());

function gameLoop(currentTime) {
    input.update();

    ctx.fillStyle = levelData[selectedLevel].levelcolor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const deltaTime = Math.min(0.1, (currentTime - lastTime) / 1000);
    lastTime = currentTime;

    if(currentScene === "gameplay") {
        updateGame(deltaTime)
        renderGame()
    } else if(currentScene === "gameover") {
        updategameOver()
    } else if(currentScene === "gamestart") {
        updateGameStart()
    } else if(currentScene === "levelcleared") {
        updatelevelCleared()
    }


    requestAnimationFrame(gameLoop);

}

function updateGame(deltaTime) {

    // Reset jump state each frame
    allowJump = false

    velocity.x *= Math.pow(1 - friction, deltaTime);
    velocity.y *= Math.pow(1 - friction, deltaTime);

    velocity.y += gravity * deltaTime;

    if (input.getKey(Keys.A) || input.getKey(Keys.LeftArrow)) {
        velocity.x -= acceleration.x * deltaTime; 
    }

    if (input.getKey(Keys.D) || input.getKey(Keys.RightArrow)) {
        velocity.x += acceleration.x * deltaTime;
    }

    // Move player X
    player.x += velocity.x * deltaTime;

    // Check Collisions X
    for(let i = 0; i < level[selectedLevel].length; i++) {
        const other = level[selectedLevel][i].type === "spike" ? {
            x: level[selectedLevel][i].x + 10,
            y: level[selectedLevel][i].y + 10,
            width: level[selectedLevel][i].width - 10,
            height: level[selectedLevel][i].height - 10
        } : level[selectedLevel][i];

        if(isOverlapping(player, other)) {
            if(level[selectedLevel][i].type === "block") {
                fixOverlapX(player, other)
                velocity.x = 0
            }
        }
    }

    // Move player Y
    player.y += velocity.y * deltaTime;

    // Check collision Y
    for(let i = 0; i < level[selectedLevel].length; i++) {
        const other = level[selectedLevel][i].type === "spike" ? {
            x: level[selectedLevel][i].x + 10,
            y: level[selectedLevel][i].y + 10,
            width: level[selectedLevel][i].width - 10,
            height: level[selectedLevel][i].height - 10
        } : level[selectedLevel][i];

        if(isOverlapping(player, other)) {
            if(level[selectedLevel][i].type === "spike") {
                   if(player.x > levelData[selectedLevel].best) {
                        levelData[selectedLevel].best = player.x
                   }
            restartGame()
            } else if(level[selectedLevel][i].type === "block") {
                if(velocity.y > 0) {
                    allowJump = true
                }
                velocity.y = 0
                fixOverlapY(player, level[selectedLevel][i])
            } else if(level[selectedLevel][i].type === "jumpad") {
                velocity.y = -1000;
                allowJump = false
            } else if(level[selectedLevel][i].type === "jumpblock") {
                if (input.getKeyDown(Keys.W) || input.getKeyDown(Keys.Space) || input.getMouseButtonDown(MouseButtons.Left)) {
                    velocity.y = -10; 
                }
            } else if(level[selectedLevel][i].type === "finish") {
                currentScene = "levelcleared"
                levelData[selectedLevel].cleared = "yes"
            }
        }
    }

    // Handle jump input AFTER collision detection
    if (allowJump && (input.getKey(Keys.W) || input.getKey(Keys.UpArrow))) {
        velocity.y = -700;
        allowJump = false
    }

    if(Math.round(Math.abs(player.y - 700)) > levelData[selectedLevel].best) {
        levelData[selectedLevel].best = Math.round(Math.abs(player.y - 700))
    }

    if(input.getKeyDown(Keys.E)) {
        toMenu()
    }

    lava.y-= levelData[selectedLevel].lavaspeed;

    if(isOverlapping(player, lava)) {
        restartGame()
    }
}

function renderGame() {

    ctx.fillStyle = levelData[selectedLevel].levelcolor;
    ctx.fillRect(0, 0, 800, 600);

    const cameraY = player.y - canvas.height + 150;

    if(levelData[selectedLevel].currentattempts === 1 && selectedLevel === 0) {
        firstPlay = true
    } else {
        firstPlay = false
    }

    // Paint player
    ctx.fillStyle = "rgba(75, 145, 250, 1)"
    ctx.fillRect(player.x, player.y - cameraY, player.width, player.height)
    ctx.strokeRect(player.x, player.y - cameraY, player.width, player.height)


    for(let i = 0; i < level[selectedLevel].length; i++) {
        if(level[selectedLevel][i].type === "block") {
            ctx.fillStyle = "rgba(0, 0, 0, 1)"
            ctx.fillRect(level[selectedLevel][i].x, level[selectedLevel][i].y - cameraY, level[selectedLevel][i].width, level[selectedLevel][i].height)
        }

        if(level[selectedLevel][i].type === "finish") {
            ctx.fillStyle = "rgba(255, 255, 255, 1)"
            ctx.fillRect(level[selectedLevel][i].x, level[selectedLevel][i].y - cameraY, level[selectedLevel][i].width, level[selectedLevel][i].height)
        }

        if(level[selectedLevel][i].type === "spike") {
            ctx.fillStyle = "rgba(0, 0, 0, 1)"
            ctx.beginPath()
            ctx.moveTo(level[selectedLevel][i].x + level[selectedLevel][i].width / 2, level[selectedLevel][i].y - cameraY)
            ctx.lineTo(level[selectedLevel][i].x, level[selectedLevel][i].y - cameraY + level[selectedLevel][i].height)
            ctx.lineTo(level[selectedLevel][i].x + level[selectedLevel][i].width, level[selectedLevel][i].y + level[selectedLevel][i].height - cameraY)
            ctx.closePath()
            ctx.fill()
        }

        if(level[selectedLevel][i].type === "jumpad") {
            ctx.fillStyle = "rgba(255, 235, 0, 1)"
            ctx.fillRect(level[selectedLevel][i].x, level[selectedLevel][i].y - cameraY, level[selectedLevel][i].width, level[selectedLevel][i].height)
        }

        if(level[selectedLevel][i].type === "jumpblock") {
            ctx.fillStyle = "rgba(255, 234, 0, 0.35)"
            ctx.beginPath();
            ctx.arc(level[selectedLevel][i].x, level[selectedLevel][i].y - cameraY, level[selectedLevel][i].radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }

    ctx.fillStyle = "rgba(220, 90, 15, 0.9)"
    ctx.fillRect(lava.x, lava.y - cameraY, lava.width, lava.height)

    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.textAlign = "center";
    ctx.fillText(Math.round(Math.abs(player.y - 700)) + " / " + levelData[selectedLevel].distance, canvas.width / 2, 100);
    ctx.textAlign = "left"
    ctx.font = "40px Arial";
    ctx.fillText("Exit (E)", 15, 40)

    if (opacity > 0) {
        ctx.globalAlpha = opacity;
        ctx.font = "50px Arial"; 
        ctx.textAlign = "center";
        if(firstPlay && levelData[selectedLevel].attempts === 0) {
            ctx.fillStyle = "rgba(220, 90, 15, 1)"
            ctx.fillText("Get To The Top,", canvas.width / 2, canvas.height / 2 - cameraY);
            ctx.fillText("The Lava Is Rising!", canvas.width / 2, canvas.height / 1.6 - cameraY);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
        } else {
            ctx.fillText("Attempt: " + levelData[selectedLevel].currentattempts, canvas.width / 2, canvas.height / 2 - cameraY);
        }
        ctx.textAlign = "left"

        if(firstPlay && levelData[selectedLevel].attempts === 0) {
            opacity -= 0.005;
        } else {
            opacity -= 0.01;
        }

        if (opacity < 0) opacity = 0;
  }

    ctx.globalAlpha = 1;
}

function updateGameStart() {
    
    StartButton.draw(ctx);

    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.textAlign = "center";
    ctx.fillText("Choose Level:", canvas.width / 2, canvas.height / 5);
    ctx.font = "40px Arial";
    ctx.fillText("Platformer Game", canvas.width / 2, canvas.height / 15);
    ctx.font = "25px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";

    // Left Menu Arrow
    if(selectedLevel > 0) {
    ctx.beginPath()
    ctx.moveTo(menuLeft.x, menuLeft.y);
    ctx.lineTo(menuLeft.x + menuLeft.width, menuLeft.y - menuLeft.height);
    ctx.lineTo(menuLeft.x + menuLeft.width, menuLeft.y + menuLeft.height);
    ctx.closePath()
    ctx.fill()

    if(input.mousePosition.x > menuLeft.x - menuLeft.width &&
        input.mousePosition.x < menuLeft.x + menuLeft.width &&
        input.mousePosition.y > menuLeft.y - menuLeft.height &&
        input.mousePosition.y < menuLeft.y + menuLeft.height &&
        input.getMouseButtonDown(MouseButtons.Left)
    ) {
        selectedLevel--
    }
    }

    // Right Menu Arrow
    if(selectedLevel < levelData.length - 1) {
    ctx.beginPath()
    ctx.moveTo(menuRight.x, menuRight.y);
    ctx.lineTo(menuRight.x - menuRight.width, menuRight.y + menuRight.height);
    ctx.lineTo(menuRight.x - menuRight.width, menuRight.y - menuRight.height);
    ctx.closePath()
    ctx.fill()

    if(
        input.mousePosition.x > menuRight.x - menuRight.width &&
        input.mousePosition.x < menuRight.x + menuRight.width &&
        input.mousePosition.y > menuRight.y - menuRight.height &&
        input.mousePosition.y < menuRight.y + menuRight.height &&
        input.getMouseButtonDown(MouseButtons.Left)
    ) {
        selectedLevel++
    }
    }

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(300, 225, 600, 350)
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.font = "35px Arial";
    ctx.fillText(levelData[selectedLevel].levelname, canvas.width / 2, canvas.height / 2.5);
    ctx.fillText("Difficulty:", canvas.width / 2.25, canvas.height / 2);

    if(levelData[selectedLevel].difficulty === "Easy") {
        ctx.fillStyle = "rgba(65, 200, 0, 1)";
    } else if(levelData[selectedLevel].difficulty === "Medium") {
        ctx.fillStyle = "rgba(255, 165, 0, 1)";
    } else if(levelData[selectedLevel].difficulty === "Hard") {
        ctx.fillStyle = "rgba(255, 0, 0, 1)";
    }

    ctx.fillText(levelData[selectedLevel].difficulty, canvas.width / 1.75, canvas.height / 2);
        if(levelData[selectedLevel].cleared === "yes") {
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillText("Total Attempts: " + levelData[selectedLevel].attempts, canvas.width / 2, canvas.height / 1.65)
            ctx.fillStyle = "rgba(65, 200, 0, 1)";
            ctx.fillText("Level Cleared! | Best Attempts: " + levelData[selectedLevel].bestattempts, canvas.width / 2, canvas.height / 1.5)
        } else {
            if(selectedLevel > 0) {
                if(levelData[selectedLevel - 1].cleared === "yes") {
                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    ctx.fillText("Total Attempts: " + levelData[selectedLevel].attempts, canvas.width / 2, canvas.height / 1.65)
                    ctx.fillText("Best: " + levelData[selectedLevel].best + " / " + levelData[selectedLevel].distance, canvas.width / 2, canvas.height / 1.5)
                } else {
                    ctx.fillStyle = "rgba(255, 0, 0, 1)";
                    ctx.fillText("Complete Previous Level To Unlock", canvas.width / 2, canvas.height / 1.5)
                }
            } else {
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                 ctx.fillText("Total Attempts: " + levelData[selectedLevel].attempts, canvas.width / 2, canvas.height / 1.65)
                ctx.fillText("Best: " + levelData[selectedLevel].best + " / " + levelData[selectedLevel].distance, canvas.width / 2, canvas.height / 1.5)
            }
        }
        ctx.textAlign = "left";

    if(StartButton.clicked()) {
        // if(selectedLevel > 0) {
        //     if(levelData[selectedLevel - 1].cleared === "yes") {
                restartGame()
        //     }
        // } else {
    //         restartGame()
    //     }
    }
}

function updatelevelCleared() {

    MenuButton.draw(ctx);

    if(levelData[selectedLevel].currentattempts < levelData[selectedLevel].bestattempts || levelData[selectedLevel].bestattempts === 0) {
        levelData[selectedLevel].bestattempts = levelData[selectedLevel].currentattempts
        newBest = true
    }

    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.textAlign = "center";
    ctx.fillText("Level Cleared!", canvas.width / 2, canvas.height / 2.5);

    if(newBest) {
        ctx.fillStyle = "rgba(65, 200, 0, 1)";
        ctx.fillText("New Best!", canvas.width / 2, canvas.height / 5);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
    }

    ctx.fillText("Attempts: " + levelData[selectedLevel].currentattempts, canvas.width / 2, canvas.height / 1.5);
    ctx.textAlign = "left"
    ctx.fillStyle = "rgba(0, 0, 0, 1)"

    if(MenuButton.clicked()) {
        toMenu()
    }
}

// function clamp(value, min, max) {
//     if(value > min && value < max) {
//         return value

//     } else if(value > max) {
//         return max

//     } else if(value < min) {
//         return min
//     }
// }

function restartGame() {
    player.x = canvas.width / 2 - 25,
    player.y = canvas.height - 150,
    velocity.y = 0
    velocity.x = 0
    currentScene = "gameplay"
    levelData[selectedLevel].currentattempts += 1
    lava.y = canvas.height + 200
    opacity = 1;
}

function toMenu() {
    currentScene = "gamestart"

    levelData[selectedLevel].attempts = levelData[selectedLevel].attempts + levelData[selectedLevel].currentattempts
    levelData[selectedLevel].currentattempts = 0
    newBest = false
}

// function circleRectOverlaps(coins, player) {
//     closestX = clamp(coins.x, player.x, player.x + player.width)
//     closestY = clamp(coins.y, player.y, player.y + player.height)

//     dx = coins.x - closestX
//     dy = coins.y - closestY

//     if((dx * dx + dy * dy) < (coins.radius * coins.radius)) {
//         return true
//     } else {
//         return false
//     }
// }

// function randomPos() {
//     coin.x = Math.floor(Math.random() * (750 - 50 + 1)) + 50
//     coin.y = Math.floor(Math.random() * (550 - 50 + 1)) + 50 
// }

function isOverlapping(rect1, rect2) {
    if ((rect1.x < rect2.x + rect2.width) &&
        (rect1.x + rect1.width > rect2.x) &&
        (rect1.y < rect2.y + rect2.height) &&
        (rect1.y + rect1.height > rect2.y)) {
        return true
   } else {
        return false
   }
}

function fixOverlapY(rect1, rect2) {
    let rect1middle = rect1.y + rect1.height / 2
    let rect2middle = rect2.y + rect2.height / 2
    if(rect1middle < rect2middle) {
        rect1.y = rect2.y - rect1.height
    } else {
        rect1.y = rect2.y + rect2.height
    }
}


function fixOverlapX(rect1, rect2) {
    let rect1middle = rect1.x + rect1.width / 2
    let rect2middle = rect2.x + rect2.width / 2
    if(rect1middle < rect2middle) {
        rect1.x = rect2.x - rect1.width
    } else {
        rect1.x = rect2.x + rect2.width
    }
}