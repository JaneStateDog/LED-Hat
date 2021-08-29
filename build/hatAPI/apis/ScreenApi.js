import {CharacteristicWrapper} from "./CharacteristicWrapper.js";
export class ScreenApi extends CharacteristicWrapper {
  constructor(characteristic) {
    super(characteristic);
  }
  async clear() {
    await this.sendRaw([107, 204, 55, 41, 81, 206, 235, 99, 69, 81, 55, 34, 92, 228, 56, 49]);
  }
  async save() {
    await this.sendRaw([231, 153, 173, 1, 170, 72, 174, 10, 238, 11, 114, 3, 232, 237, 229, 32]);
  }
}
