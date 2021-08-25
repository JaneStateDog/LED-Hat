import { DrawingBox } from "./DrawingBox";
import { EmIngMask } from "./EmIngMask";

const mask = new EmIngMask("GLASSES-006A63");
const drawingBox = new DrawingBox("lightGrid", mask);

async function connect() {

    await mask.connect();

    const display = [
        "x                                  x",
        "                                    ",
        "                                    ",
        "           x                        ",
        "                                    ",
        "                                    ",
        "                                    ",
        "                                    ",
        "                     XXX            ",
        "                                    ",
        "                                    ",
        "x                                  x",
    ];

    // await mask.pixels.setAll(display, "#fff000");

    await mask.displayText("David says hi");

    // Different kind of message
    // different service id for this one - d44bc439abfd45a2b575925416129600
    // The first is before all the drawings, the second, at the end
    // await mask.sendBytes([0x6b, 0xcc, 0x37, 0x29, 0x51, 0xce, 0xeb, 0x63, 0x45, 0x51, 0x37, 0x22, 0x5c, 0xe4, 0x38, 0x31]);
    // await mask.sendBytes([0x4c, 0xd4, 0x56, 0x19, 0xe0, 0x39, 0x03, 0x37, 0x3a, 0xa0, 0x6e, 0x00, 0xaf, 0x26, 0xff, 0x7e]);

}

document.getElementById("go").addEventListener("click", async () => {
    await connect();
    drawingBox.display();
});