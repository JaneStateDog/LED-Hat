import { EmIngMask } from "./EmIngMask";

const mask = new EmIngMask("GLASSES-006A63");




document.getElementById("go").addEventListener("click", async () => {
    await mask.connect();


    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')


    for (let i = 0; i < 12; i++) {
        for (let b = 0; b < 36; b++) {
            await mask.pixels.set({x: Math.sin(i) * 10, y: Math.sin(b) * 10}, rgbToHex(255, 0, 0));
        }
    }; 
});