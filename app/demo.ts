import { EmIngMask } from "./EmIngMask";

const mask = new EmIngMask("GLASSES-006A63");




document.getElementById("go").addEventListener("click", async () => {
    await mask.connect();
    await mask.screen.clear();

    for (let i = 0; i < 36; i++) {
        for (let b = 0; b < 12; b++) {
            await mask.pixels.set({x: i, y: b}, {r: 200, g: 200, b: 100});
        };
    };
});