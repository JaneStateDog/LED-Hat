# Notes

Uses Low Energy Attribute Protocol (ATT)



Frame 114: 54 bytes on wire (432 bits), 54 bytes captured (432 bits)
Bluetooth
Bluetooth HCI H4
Bluetooth HCI Event - LE Meta
    Event Code: LE Meta (0x3e)
    Parameter Total Length: 51
    Sub Event: LE Extended Advertising Report (0x0d)
    Num Reports: 1
    Event Type: 0x0013, Connectable, Scannable, Legacy, Data Status: Complete
    Peer Address Type: Public Device Address (0x00)
    BD_ADDR: 00:41:10:00:0a:35 (00:41:10:00:0a:35)
    Primary PHY: LE 1M (0x01)
    Secondary PHY: No packets on the secondary advertising channel (0x00)
    Advertising SID: 0xff (not available)
    TX Power: 127dBm (not available)
    RSSI: -65dBm
    Periodic Advertising Interval: 0x0000 (no periodic advertising)
    Direct Address Type: Public Device Address (0x00)
    Direct BD_ADDR: 00:00:00_00:00:00 (00:00:00:00:00:00)
    Data Length: 25
    Advertising Data
        Flags
            Length: 2
            Type: Flags (0x01)
            000. .... = Reserved: 0x0
            ...0 .... = Simultaneous LE and BR/EDR to Same Device Capable (Host): false (0x0)
            .... 0... = Simultaneous LE and BR/EDR to Same Device Capable (Controller): false (0x0)
            .... .1.. = BR/EDR Not Supported: true (0x1)
            .... ..1. = LE General Discoverable Mode: true (0x1)
            .... ...0 = LE Limited Discoverable Mode: false (0x0)
        Device Name (shortened): GLASSES-000A35
            Length: 15
            Type: Device Name (shortened) (0x08)
            Device Name: GLASSES-000A35
        Manufacturer Specific
            Length: 5
            Type: Manufacturer Specific (0xff)
            Company ID: Unknown (0x5254)
            Data: 0041
                [Expert Info (Note/Undecoded): Undecoded]
                    [Undecoded]
                    [Severity level: Note]
                    [Group: Undecoded]
                    
# Conversations

I think the following is setting pixel colours:

Frame 1476: 32 bytes on wire (256 bits), 32 bytes captured (256 bits)
Bluetooth
    [Source: Google_cc:67:31 (f0:5c:77:cc:67:31)]
    [Destination: 00:41:10:00:0a:35 (00:41:10:00:0a:35)]
Bluetooth HCI H4
    [Direction: Sent (0x00)]
    HCI Packet Type: ACL Data (0x02)
Bluetooth HCI ACL Packet
Bluetooth L2CAP Protocol
Bluetooth Attribute Protocol
    Opcode: Write Command (0x52)
    Handle: 0x0018 (Unknown: Unknown)
        [Service UUID: Unknown (0xfff0)]
        [UUID: d44bc439abfd45a2b57592541612960b]
    Value: 0f11ff0011041205130514051406150600000000

