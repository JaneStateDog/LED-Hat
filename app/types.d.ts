export type Coord = { x: number, y: number };
export type Rgb = { r: number, g: number, b: number };

export interface BluetoothScanFilters {
    name: string | null;
    namePrefix?: string;
}

export interface RequestDeviceOptions {
    filters: BluetoothScanFilters[];
    optionalServices: number[];
    acceptAllDevices?: boolean;
}

export interface Bluetooth {
    getAvailability(): Promise<boolean>;
    onavailabilitychanged: CallableFunction;

    readonly referringDevice: BluetoothDevice;

    getDevices(): Promise<BluetoothDevice[]>;
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
}

export interface BluetoothDevice {
    readonly id: string;
    readonly name?: string | null;
    readonly gatt?: BluetoothRemoteGATTServer | null;
    readonly uuids: string[];
    readonly watchingAdvertisements: boolean;

    watchAdvertisements(): Promise<void>;
    unwatchAdvertisements(): Promise<void>;
}

export interface BluetoothRemoteGATTService {
    readonly uuid: string;
    readonly isPrimary: boolean;
    readonly device: BluetoothDevice;

    getCharacteristic(characteristic: string): Promise<BluetoothGATTCharacteristic>;
    getCharacteristics(characteristic?: string | null): Promise<BluetoothGATTCharacteristic[]>;
    getIncludedService(service: string): Promise<BluetoothGATTService>;
    getIncludedServices(service?: string | null): Promise<BluetoothGATTService[]>;
}

export interface BluetoothRemoteGATTServer {
    readonly device: BluetoothDevice;
    readonly connected: boolean;

    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: number): Promise<BluetoothRemoteGATTService>;
    getPrimaryServices(service?: number | null): Promise<BluetoothRemoteGATTService[]>;
}

export interface BluetoothRemoteGATTCharacteristic {
    readonly uuid: string;
    readonly service: any;
    readonly properties: any;
    readonly DataView: any;

    getDescriptor(descriptor: any): Promise<any>;
    getDescriptors(descriptor: any): Promise<any[]>;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
    startNotifications(): Promise<void>;
    stopNotifications(): Promise<void>;
}

export type BluetoothGATTCharacteristic = BluetoothRemoteGATTCharacteristic;
export type BluetoothGATTService = BluetoothRemoteGATTService;