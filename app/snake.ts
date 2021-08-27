import { EmIngMask } from "./hatAPI/EmIngMask";

const mask = new EmIngMask("GLASSES-006A63");



var isConnected = false;

var loc = {x: 0, y: 0};
var snake = [{x: loc.x, y: loc.y}, {x: loc.x, y: loc.y + 1}];

var direction = "RIGHT";

function getRandomInt(max: number) { return Math.floor(Math.random() * max); }

var food = {x: getRandomInt(35), y: getRandomInt(11)};

var gameState = "RUNNING";


//On click of connect, connect
document.getElementById("connect").addEventListener("click", async () => {

    await mask.connect();
    await mask.screen.clear();

    isConnected = true;

});



//On keyboard press, move
document.getElementById("everything").addEventListener("keypress", async (e: KeyboardEvent) => {

    if (!isConnected) return;

    if (e.key == "d") direction = "RIGHT";
    else if (e.key == "a") direction = "LEFT";
    else if (e.key == "s") direction = "DOWN";
    else if (e.key == "w") direction = "UP";
    else return;

});


setInterval(async () => {

    if (!isConnected) return;


    if (gameState == "RUNNING") {

        if (direction == "RIGHT") loc.x++;
        else if (direction == "LEFT") loc.x--;
        else if (direction == "DOWN") loc.y++;
        else if (direction == "UP") loc.y--;
        else return;


        if (loc.x >= 36 || loc.x < 0 || loc.y >= 12 || loc.y < 0) {
            gameState = "GAME OVER";
            return;
        }

        for (let i = 1; i < snake.length; i++) {
            if (loc.x == snake[i].x && loc.y == snake[i].y) {
                gameState = "GAME OVER";
                return;
            }
        }



        await mask.pixels.set(loc, {r: 1, g: 255, b: 1});

        snake.unshift({x: loc.x, y: loc.y});
        if (loc.x == food.x && loc.y == food.y) {
            food = {x: getRandomInt(35), y: getRandomInt(11)};
        } else {
            await mask.pixels.set(snake[snake.length - 1], {r: 1, g: 1, b: 1});
            snake.pop();
        }

        await mask.pixels.set(food, {r: 255, g: 150, b: 1});

    } else if (gameState == "GAME OVER") {
        await mask.screen.clear();
        let filled = [];
        for (let i = 0; i < 12; i++) filled.push("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        await mask.pixels.setAll(filled, {r: 255, g: 1, b: 1});

        gameState = "DONE";
    }

}, 350);