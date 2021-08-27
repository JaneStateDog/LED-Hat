import { EmIngMask } from "./hatAPI/EmIngMask";

const mask = new EmIngMask("GLASSES-006A63");




var loc = {x: 5, y: 5};

var isConnected = false;

document.getElementById("go").addEventListener("click", async () => {

    await mask.connect();
    await mask.screen.clear();

    mask.pixels.set(loc, {r: 255, g: 1, b: 1});

    isConnected = true;

});


document.getElementById("everything").addEventListener("keypress", async (e: KeyboardEvent) => {

    if (!isConnected) return;

    await mask.pixels.set(loc, {r: 1, g: 1, b: 1});

    if (e.key == "d" && loc.x + 1 < 36) loc.x++;
    else if (e.key == "a" && loc.x - 1 >= 0) loc.x--;
    else if (e.key == "s" && loc.y + 1 < 12) loc.y++;
    else if (e.key == "w" && loc.y - 1 >= 0) loc.y--;

    await mask.pixels.set(loc, {r: 255, g: 1, b: 1});

});