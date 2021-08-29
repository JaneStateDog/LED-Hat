import {CharacteristicWrapper} from "./CharacteristicWrapper.js";
export class PixelApi extends CharacteristicWrapper {
  constructor(characteristic) {
    super(characteristic);
  }
  async clear() {
    await this.setAll([
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    ",
      "                                    "
    ], "#000000", true);
  }
  async setAll(pixelMap, color, clearEmpty = false) {
    const coords = [];
    const removeCoords = [];
    for (let item of this.itemsIn(pixelMap)) {
      if (item.data !== " ") {
        coords.push(item);
      }
      if (item.data === " ") {
        removeCoords.push(item);
      }
    }
    if (clearEmpty && removeCoords.length > 0) {
      await this.set(removeCoords, "#000000");
    }
    if (coords.length > 0) {
      await this.set(coords, color);
    }
  }
  async setDiff(diff, color) {
    const addCoords = [];
    const removeCoords = [];
    for (let item of this.itemsIn(diff)) {
      if (item.data === "+") {
        addCoords.push(item);
      }
      if (item.data === "-") {
        removeCoords.push(item);
      }
    }
    if (removeCoords.length > 0) {
      await this.set(removeCoords, "#000000");
    }
    if (addCoords.length > 0) {
      await this.set(addCoords, color);
    }
  }
  async set(locations, color) {
    const coords = Array.isArray(locations) ? locations : [locations];
    const actualColor = typeof color === "string" ? hexToRgb(color) : color;
    const asArray = coords.map((loc) => [loc.x, loc.y]);
    if (asArray.length === 0) {
      return;
    }
    let payload = asArray.reduce((acc, curr) => [...acc, ...curr]);
    const batchSize = 100;
    do {
      const sendBuffer = payload.slice(0, batchSize);
      payload = payload.slice(batchSize);
      await this.sendRaw([sendBuffer.length + 3, actualColor.r, actualColor.g, actualColor.b, ...sendBuffer]);
    } while (payload.length > 0);
  }
  *itemsIn(pixelMap) {
    for (let y in pixelMap) {
      const row = pixelMap[y].split("");
      for (let x in row) {
        yield {x, y, data: row[x]};
      }
    }
  }
}
export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
