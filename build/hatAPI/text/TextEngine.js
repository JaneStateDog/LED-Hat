import Jimp from "../../_snowpack/pkg/jimp/browser/lib/jimp.js";
export class TextEngine {
  constructor(spritePath = "C:\\Users\\jedid\\Desktop\\LED-Hat\\app\\hatAPI\\text\\a-z.png") {
    this._ready = false;
    this._spritePath = spritePath;
    this._spriteSheetCharacters = "abcdefghijklmnopqrstuvwxyz";
  }
  async loadSprites() {
    try {
      this._spriteSheet = await Jimp.read(this._spritePath);
      this._ready = true;
    } catch (ex) {
      console.log(ex);
    }
  }
  async rasterize(input) {
    this.ensureReady();
    const result = ["", "", "", "", "", "", "", "", "", "", "", ""];
    const letters = input.split("");
    for (let character of letters) {
      const spritIndex = this._spriteSheetCharacters.indexOf(character[0]);
      let charPixels;
      if (spritIndex > -1) {
        charPixels = this.pixelsFromSpritesheet(character[0]);
      } else {
        charPixels = await this.generateUnspritedCharacter(character[0]);
      }
      for (let y in charPixels) {
        result[y] += charPixels[y] + " ";
      }
    }
    return result;
  }
  pixelsFromSpritesheet(input) {
    const spriteWidth = 6;
    const letterOffset = this._spriteSheetCharacters.indexOf(input[0]) * spriteWidth;
    console.log("Loaded from spritesheet", input);
    return this.pixelsFromImage(this._spriteSheet, spriteWidth, letterOffset, (rgba) => {
      return rgba.r <= 100;
    });
  }
  async generateUnspritedCharacter(input) {
    if (input[0] === " ") {
      return ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "];
    }
    try {
      const image = new Jimp(30, 12);
      const font = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);
      await image.print(font, 0, 2, input);
      console.log("Generated dynamically", input);
      return this.pixelsFromImage(image, 6, 0, (rgba) => {
        return rgba.a >= 20;
      });
    } catch (ex) {
      console.log(ex);
    }
  }
  pixelsFromImage(image, spriteWidth, spriteOffset, predicate) {
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
  ensureReady() {
    if (!this._ready) {
      throw Error("Please await loadSprites first.");
    }
  }
}
