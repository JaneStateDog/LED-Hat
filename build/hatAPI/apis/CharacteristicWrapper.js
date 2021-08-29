export class CharacteristicWrapper {
  constructor(characteristic) {
    this._characteristic = characteristic;
  }
  async sendRaw(data) {
    await this.sendBytes(new Uint8Array(data));
  }
  async sendBytes(data) {
    console.log(data);
    await this._characteristic.writeValue(data.buffer);
  }
}
