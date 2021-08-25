import { BluetoothRemoteGATTCharacteristic } from "../types";
import { CharacteristicWrapper } from "./CharacteristicWrapper";

export class ScreenApi extends CharacteristicWrapper {
    constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
        super(characteristic);
    }

    public async clear() {
        // This magic incantation appears to clear the screen.
        await this.sendRaw([0x6b, 0xcc, 0x37, 0x29, 0x51, 0xce, 0xeb, 0x63, 0x45, 0x51, 0x37, 0x22, 0x5c, 0xe4, 0x38, 0x31]);
    }

    public async save() {
        await this.sendRaw([0xe7, 0x99, 0xad, 0x01, 0xaa, 0x48, 0xae, 0x0a, 0xee, 0x0b, 0x72, 0x03, 0xe8, 0xed, 0xe5, 0x20]);
    }
}
