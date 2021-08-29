import {PaletteApi} from "./apis/PaletteApi.js";
import {PixelApi} from "./apis/PixelApi.js";
import {ScreenApi} from "./apis/ScreenApi.js";
import {DisplayBuffer} from "./text/DisplayBuffer.js";
import {TextEngine} from "./text/TextEngine.js";
export class EmIngMask {
  get deviceName() {
    return this._deviceName;
  }
  get pixels() {
    return this._pixelApi;
  }
  get screen() {
    return this._screenApi;
  }
  get palette() {
    return this._paletteApi;
  }
  constructor(deviceName) {
    if (!("bluetooth" in navigator)) {
      throw Error("This runtime does not support Web Bluetooth");
    }
    if (!deviceName) {
      throw Error("You must provide your device name");
    }
    this._deviceName = deviceName;
    this._deviceBleServices = 65520;
    this._characteristics = new Map();
    this._textEngine = new TextEngine();
  }
  async connect() {
    const webBluetooth = navigator["bluetooth"];
    const device = await webBluetooth.requestDevice({
      filters: [{name: this.deviceName}],
      optionalServices: [this._deviceBleServices]
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(this._deviceBleServices);
    const allCharacteristics = await service.getCharacteristics();
    for (let api of allCharacteristics) {
      this._characteristics.set(api.uuid, api);
    }
    this._pixelApi = new PixelApi(this._characteristics.get(KnownCharacteristic.SetPixel));
    this._screenApi = new ScreenApi(this._characteristics.get(KnownCharacteristic.Screen));
    this._paletteApi = new PaletteApi(this._characteristics.get(KnownCharacteristic.Palette), this._screenApi);
    await this.pixels.clear();
    await this._textEngine.loadSprites();
  }
  async displayText(content, color = "#fff000") {
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
  async test() {
    await this.pixels.clear();
    await this.palette.a();
    await this.palette.b();
  }
}
var KnownCharacteristic;
(function(KnownCharacteristic2) {
  KnownCharacteristic2["Screen"] = "d44bc439-abfd-45a2-b575-925416129600";
  KnownCharacteristic2["Palette"] = "d44bc439-abfd-45a2-b575-92541612960a";
  KnownCharacteristic2["SetPixel"] = "d44bc439-abfd-45a2-b575-92541612960b";
})(KnownCharacteristic || (KnownCharacteristic = {}));
