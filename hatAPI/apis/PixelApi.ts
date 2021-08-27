import { BluetoothRemoteGATTCharacteristic, Coord, Rgb } from "../types";
import { CharacteristicWrapper } from "./CharacteristicWrapper";

export class PixelApi extends CharacteristicWrapper {
    constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
        super(characteristic);
    }

    public async clear() {
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
            "                                    ",
        ], "#000000", true);
    }

    public async setAll(pixelMap: string[], color: Rgb | string, clearEmpty: boolean = false) {
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

    public async setDiff(diff: string[], color: Rgb | string) {
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

    public async set(locations: Coord | Coord[], color: Rgb | string) {
        // First byte of message is the message length
        // Then three bytes for R, G and B
        // Then the rest are x, y, x, y, x, y pixel locations.
        // A batch of 100 seems to be the most reliable.

        // This can support sending one or many pixels at once.
        const coords = Array.isArray(locations) ? locations : [locations];
        const actualColor = typeof color === "string" ? hexToRgb(color) : color;

        const asArray = coords.map(loc => [loc.x, loc.y]);
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

    private *itemsIn(pixelMap: string[]) {
        for (let y in pixelMap) {
            const row = pixelMap[y].split('');
            for (let x in row) {
                yield { x, y, data: row[x] };
            }
        }
    }
}

export function hexToRgb(hex: string): Rgb {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}