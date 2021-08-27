import Jimp from 'jimp/browser/lib/jimp'; // For browser support.
//import Jimp from 'jimp';

export class TextEngine {

    private _spritePath: string | Buffer;
    private _spriteSheet: any;
    private _spriteSheetCharacters: string;
    private _ready: boolean;

    constructor(spritePath: string | Buffer = "C:\\Users\\jedid\\Desktop\\LED-Hat\\app\\hatAPI\\text\\a-z.png") {
        this._ready = false;
        this._spritePath = spritePath;
        this._spriteSheetCharacters = "abcdefghijklmnopqrstuvwxyz";
    }

    public async loadSprites() {
        try {
            this._spriteSheet = await Jimp.read(this._spritePath as any);
            this._ready = true;
        }
        catch (ex) {
            console.log(ex);
        }
    }

    public async rasterize(input: string): Promise<string[]> {
        this.ensureReady();

        const result = ["", "", "", "", "", "", "", "", "", "", "", ""];

        const letters = input.split('');
        for (let character of letters) {

            const spritIndex = this._spriteSheetCharacters.indexOf(character[0]);
            let charPixels: string[];

            if (spritIndex > -1) {
                charPixels = this.pixelsFromSpritesheet(character[0]);
            } else {
                charPixels = await this.generateUnspritedCharacter(character[0]);
            }

            for (let y in charPixels) {
                result[y] += (charPixels[y] + " ");
            }
        }

        return result;
    }

    private pixelsFromSpritesheet(input: string): string[] {
        const spriteWidth = 6; // fixed width fonts
        const letterOffset = this._spriteSheetCharacters.indexOf(input[0]) * spriteWidth;

        console.log("Loaded from spritesheet", input);

        return this.pixelsFromImage(this._spriteSheet, spriteWidth, letterOffset, (rgba: Rgba) => {
            return rgba.r <= 100;
        });
    }

    private async generateUnspritedCharacter(input: string): Promise<string[]> {

        if (input[0] === " ") {
            return ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "];
        }

        try {
            const image = new Jimp(30, 12);
            const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);
            await image.print(font, 0, 2, input);

            console.log("Generated dynamically", input);

            return this.pixelsFromImage(image, 6, 0, (rgba: Rgba) => {
                return rgba.a >= 20;
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    private pixelsFromImage(image: any, spriteWidth: number, spriteOffset: number, predicate: CallableFunction) {
        const result = [];

        for (let y = 0; y < 12; y++) {

            let line = "";

            for (let pixelX = 0; pixelX < spriteWidth; pixelX++) {
                const x = spriteOffset + pixelX;
                const pixelValue = image.getPixelColor(x, y);
                const rgba = Jimp.intToRGBA(pixelValue);

                line += predicate(rgba) ? "█" : " ";
            }

            result.push(line);
        }
        return result;
    }

    private ensureReady() {
        if (!this._ready) {
            throw Error("Please await loadSprites first.");
        }
    }
}


type Rgba = { r: number, b: number; g: number, a: number };