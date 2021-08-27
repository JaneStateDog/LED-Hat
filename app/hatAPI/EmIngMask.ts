import { PaletteApi } from "./apis/PaletteApi";
import { PixelApi } from "./apis/PixelApi";
import { ScreenApi } from "./apis/ScreenApi";
import { DisplayBuffer } from "./text/DisplayBuffer";
import { TextEngine } from "./text/TextEngine";
import { BluetoothRemoteGATTCharacteristic, Bluetooth, Rgb } from "./types";

export class EmIngMask {

    public get deviceName(): string { return this._deviceName; }
    public get pixels(): PixelApi { return this._pixelApi; }
    public get screen(): ScreenApi { return this._screenApi; }
    public get palette(): PaletteApi { return this._paletteApi; }

    private _deviceName: string;
    private _deviceBleServices: number;
    private _characteristics: Map<KnownCharacteristic, BluetoothRemoteGATTCharacteristic>;

    private _pixelApi: PixelApi;
    private _screenApi: ScreenApi;
    private _paletteApi: PaletteApi;

    private _textEngine: TextEngine;

    constructor(deviceName: string) {
        if (!('bluetooth' in navigator)) {
            throw Error("This runtime does not support Web Bluetooth");
        }

        if (!deviceName) {
            throw Error("You must provide your device name");
        }

        this._deviceName = deviceName;
        this._deviceBleServices = 0xfff0;
        this._characteristics = new Map<KnownCharacteristic, BluetoothRemoteGATTCharacteristic>();
        this._textEngine = new TextEngine();
    }

    public async connect() {
        const webBluetooth = <Bluetooth>navigator['bluetooth'];

        const device = await webBluetooth.requestDevice({
            filters: [{ name: this.deviceName }],
            optionalServices: [this._deviceBleServices]
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(this._deviceBleServices);
        const allCharacteristics = await service.getCharacteristics();

        for (let api of allCharacteristics) {
            this._characteristics.set(api.uuid as KnownCharacteristic, api);
        }

        this._pixelApi = new PixelApi(this._characteristics.get(KnownCharacteristic.SetPixel));
        this._screenApi = new ScreenApi(this._characteristics.get(KnownCharacteristic.Screen));
        this._paletteApi = new PaletteApi(this._characteristics.get(KnownCharacteristic.Palette), this._screenApi);

        await this.pixels.clear();
        await this._textEngine.loadSprites();
    }

    public async displayText(content: string, color: Rgb | string = "#fff000") {
        this.pixels.clear();

        const toDisplayPixels = await this._textEngine.rasterize(content);
        const buffer = new DisplayBuffer(toDisplayPixels);

        buffer.onViewportUpdated(async (snapshot, diff, finished) => {
            await this.pixels.setDiff(diff, color);

            if (finished) {
                await this.pixels.clear();
            }
        });

        buffer.autoScroll();
    }

    public async test() {
        await this.pixels.clear();
        await this.palette.a();
        await this.palette.b();
    }
}

enum KnownCharacteristic {
    Screen = "d44bc439-abfd-45a2-b575-925416129600", // I mean, kind of, it works ;) - always 28 bytes for each command, 16 bytes is the data
    Palette = "d44bc439-abfd-45a2-b575-92541612960a", // 20 bytes of data by default, first bit is always a message length of bytes to read
    SetPixel = "d44bc439-abfd-45a2-b575-92541612960b",
}