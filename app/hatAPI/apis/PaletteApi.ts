import { BluetoothRemoteGATTCharacteristic } from "../types";
import { CharacteristicWrapper } from "./CharacteristicWrapper";
import { ScreenApi } from "./ScreenApi";

export class PaletteApi extends CharacteristicWrapper {

    private _screen: ScreenApi;

    constructor(characteristic: BluetoothRemoteGATTCharacteristic, screenApi: ScreenApi) {
        super(characteristic);
        this._screen = screenApi;
    }

    public async enablePaletteMode() {
        await this.sendRaw([0x0b, 0xdb, 0x89, 0x22, 0x7b, 0xe7, 0x10, 0xa5, 0xb1, 0xda, 0x48, 0x71, 0x2c, 0x5f, 0x68, 0xad]);
    }

    public async a() {
        await this.enablePaletteMode();

        const data = [
            // 31, // Number of bytes to parse
            // These are in pairs, some kind of palette of patterns?
            0, 5,
            128, 10,
            64, 10,
            64, 7,
            128, 0,
            64, 0,

            0,

            // Column colours - RGB
            0, 255, 0,
            0, 255, 0,
            0, 255, 0,
            0, 255, 0,
            0, 255, 0,
            0, 255, 0,
        ];

        await this.sendRaw([data.length, ...data]);
        await this._screen.save();
    }

    public async ab() {
        await this.enablePaletteMode();

        const data = [
            0x00, 0x05, 0x80, 0x0a, 0x40, 0x0a, 0x40, 0x07, 0x80, 0x00, 0x40, 0x00, 0x00, 0x7f, 0xc0,
            0x08, 0x40, 0x08, 0x40, 0x08, 0x40, 0x07, 0x80, 0x00, 0x00, 0x12, 0xff, 0x00, 0x12, 0xff, 0x00,
            0x12, 0xff, 0x00, 0x12, 0xff, 0x00, 0x12, 0xff, 0x00, 0x12, 0xff, 0x00, 0x12, 0xff, 0x00, 0x12,
            0xff, 0x00, 0x12, 0xff, 0x00, 0x12, 0xff, 0x00, 0x12, 0xff, 0x00, 0x12, 0xff, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00
        ];

        await this.sendRaw([data.length, ...data]);
        await this._screen.save();
    }

    public async b() {
        await this.enablePaletteMode();

        const data = [
            0, 127, 192, 8, 64, 8, 64, 8, 64, 7, 128, 0, 0, 18, 255,
            0, 18, 255, 0, 18, 255, 0, 18, 255, 0, 18, 255, 0, 18, 255, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];

        await this.sendRaw([data.length, ...data]);
        await this._screen.save();
    }

    public async clear() {
        const data = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0
        ];

        await this.sendRaw([data.length, ...data]);
        await this._screen.save();
    }

    public async cycle() {
        for (let i = 0; i < 255; i++) {
            for (let ii = 0; ii < 255; ii++) {

                const data = [
                    // These are in pairs, some kind of palette of patterns?
                    i, ii,
                    i, ii,
                    i, ii,
                    i, ii,
                    i, ii,
                    i, ii,

                    0,

                    // Column colours - RGB
                    0, 255, 0,
                    0, 255, 0,
                    0, 255, 0,
                    0, 255, 0,
                    0, 255, 0,
                    0, 255, 0,
                ];

                await this.sendRaw([data.length, ...data]);
                await this._screen.save();
            }
        }
    }
}
