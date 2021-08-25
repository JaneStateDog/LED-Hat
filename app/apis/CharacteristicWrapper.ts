import { BluetoothRemoteGATTCharacteristic } from "../types";

export class CharacteristicWrapper {
    protected _characteristic: BluetoothRemoteGATTCharacteristic;

    constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
        this._characteristic = characteristic;
    }

    protected async sendRaw(data: number[]) {
        await this.sendBytes(new Uint8Array(data));
    }

    protected async sendBytes(data: Uint8Array) {
        console.log(data);
        await this._characteristic.writeValue(data.buffer);
    }
}
