from time import sleep, time
import gatt
from random import randrange
import threading
from evdev import InputDevice
import ast


screenClear = [0x6b, 0xcc, 0x37, 0x29, 0x51, 0xce, 0xeb, 0x63, 0x45, 0x51, 0x37, 0x22, 0x5c, 0xe4, 0x38, 0x31]

pixelChar = None
screenChar = None

inProgress = False


sendQueue = []
def queueData(data, char):
    global sendQueue
    sendQueue.append([data, char])





def updateDisplay(display, onHat):
    pixelsToSend = {}

    toPutOnHat = []
    subHat = [str(i) for i in onHat]

    outHat = onHat.copy()


    for pixel in display:
        if str(pixel) not in subHat:
            if str(pixel["rgb"]) in pixelsToSend:
                pixelsToSend[str(pixel["rgb"])].append(pixel)
            else:
                pixelsToSend[str(pixel["rgb"])] = [pixel]

            toPutOnHat.append(pixel)


    for pixel in toPutOnHat:
        i = 0
        for pixelHat in outHat:
            if pixelHat["xy"] == pixel["xy"]:
                outHat[i] = pixel
                break

            i += 1

            

    for rgb in pixelsToSend:
        print(rgb)
        newRgb = ast.literal_eval(rgb)
        pixels = []

        for pixel in pixelsToSend[rgb]:
            pixels.append([pixel["xy"]["x"], pixel["xy"]["y"]])

        data = [0, newRgb["r"], newRgb["g"], newRgb["b"]]
        ogData = data.copy()

        i = 0
        b = 0
        for pixel in pixels:
            data.extend(pixel)

            if i > 50 or b == len(pixels) - 1:
                data[0] = len(data)
                queueData(data, pixelChar)

                data = ogData.copy()

                i = 0

            i += 1
            b += 1

    return outHat


canGo = False
def main():
    global sendQueue
    global inProgress

    display = []
    onHat = [{
                "xy": {"x": x, "y": y}, 
                "rgb": {"r": 1, "g": 1, "b": 1}
            } for x in range(36) for y in range(12)]

    world = [{
                "xy": {"x": x, "y": y}, 
                "rgb": {"r": 255, "g": 1, "b": 255}
            } for x in range(36) for y in range(12)]
    camera = {"x": 0, "y": 0}

    first = True

    while True:
        if not canGo:
            continue

        if not inProgress and len(sendQueue) > 0:
            data, char = sendQueue.pop(0)
            char.write_value(data)

            inProgress = True


        sleep(2)

        if first:
            updateDisplay(onHat, onHat)
            first = False



        camera["x"] -= 1
        camera["y"] -= 1
        print(camera)




        
        #Convert display to what's on hat
        display = []

        for i in range(36):
            for b in range(12):
                placeX = camera["x"] + i
                placeY = camera["y"] + b

                found = False

                for pixel in world:
                    if pixel["xy"] == {"x": placeX, "y": placeY}:
                        display.append({"xy": {"x": i, "y": b}, "rgb": pixel["rgb"]})
                        found = True

                        break

                if not found:
                    display.append({"xy": {"x": i, "y": b}, "rgb": {"r": 1, "g": 1, "b": 1}})

        onHat = updateDisplay(display, onHat)







if __name__ == "__main__":

    t = threading.Thread(target=main)
    t.start()

    manager = gatt.DeviceManager(adapter_name="hci0")
    class AnyDevice(gatt.Device):

        def connect_succeeded(self):
            super().connect_succeeded()
            print("[%s] Connected" % (self.mac_address))

        def connect_failed(self, error):
            super().connect_failed(error)
            print("[%s] Connection failed: %s" % (self.mac_address, str(error)))

        def disconnect_succeeded(self):
            super().disconnect_succeeded()
            print("[%s] Disconnected" % (self.mac_address))

        def characteristic_write_value_failed(self, characteristic, error):
            print(f"Write value failed... {error}")




        def services_resolved(self):
            super().services_resolved()
            print("Services resolved")

            global pixelChar
            global screenChar
            global canGo


            neededService = next(s for s in self.services if s.uuid == '0000fff0-0000-1000-8000-00805f9b34fb')

            #Get chars
            pixelChar = next(c for c in neededService.characteristics if c.uuid == "d44bc439-abfd-45a2-b575-92541612960b")
            screenChar = next(c for c in neededService.characteristics if c.uuid == "d44bc439-abfd-45a2-b575-925416129600")

            #Start
            canGo = True
            queueData(screenClear, screenChar)

        def characteristic_write_value_succeeded(self, characteristic):
            global inProgress
            global sendQueue

            if len(sendQueue) > 0:
                data, char = sendQueue.pop(0)
                char.write_value(data)
            else:
                inProgress = False



    #Get devices
    hat = AnyDevice(mac_address="00:41:20:00:6a:63", manager=manager)
    hat.connect()


    #Start main loop
    manager.run()