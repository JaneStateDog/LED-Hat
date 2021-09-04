from time import sleep, time
import gatt
from random import randrange
import threading
from evdev import InputDevice



direction = "RIGHT"
pause = True

pixelChar = None
screenChar = None

snakeHead = [10, 5]
snake = [[snakeHead[0] - 1, snakeHead[1]], [snakeHead[0] - 2, snakeHead[1]]]

ogSnakeHead = snakeHead.copy()
ogSnake = snake.copy()

food = [randrange(34) + 1, randrange(10) + 1]


thisTime = time()



def lookForInput():
    global direction
    global pause

    while True:
        gamepad = InputDevice('/dev/input/event2')
        for event in gamepad.read_loop():

            if event.value != 0:
                if event.code == 16 and event.value == 1:
                    direction = "RIGHT"
                elif event.code == 17 and event.value == 1:
                    direction = "DOWN"
                elif event.code == 16 and event.value == -1:
                    direction = "LEFT"
                elif event.code == 17 and event.value == -1:
                    direction = "UP"

                elif event.code == 315 and event.value == 1:
                    pause = not pause



if __name__ == "__main__":

    sendQueue = []
    def queueData(data):
        global sendQueue
        sendQueue.append(data)

    def cleanScreen():
        print("Clearing screen")
        queueData([0x6b, 0xcc, 0x37, 0x29, 0x51, 0xce, 0xeb, 0x63, 0x45, 0x51, 0x37, 0x22, 0x5c, 0xe4, 0x38, 0x31])



        print("Queuing border")

        data = [0, 255, 1, 1]
        
        for i in range(36):
            data.append(i)
            data.append(0)

        data[0] = len(data)
        queueData(data)
        print("1")


        data = [0, 255, 1, 1]

        for i in range(36):
            data.append(i)
            data.append(11)

        data[0] = len(data)
        queueData(data)
        print("2")


        data = [0, 255, 1, 1]

        for i in range(11):
            if i == 0 or i == 11:
                continue

            data.append(0)
            data.append(i)

        data[0] = len(data)
        queueData(data)
        print("3")


        data = [0, 255, 1, 1]

        for i in range(11):
            if i == 0 or i == 11:
                continue

            data.append(35)
            data.append(i)

        data[0] = len(data)
        queueData(data)
        print("4")


        screenChar.write_value(sendQueue[0])
        sendQueue.pop(0)

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
            global pixelChar
            global screenChar

            global screenCleared

            super().services_resolved()

            print("Services resolved")


            device_information_service = next(
                s for s in self.services
                if s.uuid == '0000fff0-0000-1000-8000-00805f9b34fb')



            pixelChar = next(
                c for c in device_information_service.characteristics
                if c.uuid == "d44bc439-abfd-45a2-b575-92541612960b")

            screenChar = next(
                c for c in device_information_service.characteristics
                if c.uuid == "d44bc439-abfd-45a2-b575-925416129600")


            cleanScreen()

        def characteristic_write_value_succeeded(self, characteristic):
            global snakeHead
            global snake
            global direction
            global food
            global pause
            global thisTime

            if pause and sendQueue == []:
                pixelChar.write_value([0, 1, 1, 1, 0, 0])
                return

            try:
                data = sendQueue.pop(0)
                pixelChar.write_value(data)
            except:
                sleepTime = 0.175
                clamp = max(0, min(time() - thisTime, sleepTime))
                sleep(sleepTime - clamp)


                if direction == "RIGHT":
                    snakeHead[0] += 1
                elif direction == "LEFT":
                    snakeHead[0] -= 1
                elif direction == "DOWN":
                    snakeHead[1] += 1
                elif direction == "UP":
                    snakeHead[1] -= 1


                if snakeHead[0] >= 35 or snakeHead[0] <= 0 or snakeHead[1] >= 12 or snakeHead[1] <= 0:
                    print("GAME OVER")
                    pause = True

                    snakeHead = ogSnakeHead.copy()
                    snake = ogSnake.copy()

                    cleanScreen()
                    return

                for i in snake:
                    if snakeHead[0] == i[0] and snakeHead[1] == i[1]:
                        print("GAME OVER")
                        pause = True

                        snakeHead = ogSnakeHead.copy()
                        snake = ogSnake.copy()

                        cleanScreen()
                        return


                queueData([6, 1, 255, 1, snakeHead[0], snakeHead[1]])

                snake.insert(0, [snakeHead[0], snakeHead[1]])

                if snakeHead == food:
                    food = [randrange(34) + 1, randrange(10) + 1]
                else:
                    queueData([6, 1, 1, 1, snake[len(snake) - 1][0], snake[len(snake) - 1][1]])
                    snake.pop()

                queueData([6, 255, 150, 1, food[0], food[1]])


                pixelChar.write_value(sendQueue[0])
                sendQueue.pop(0)

                thisTime = time()



    #Get devices
    hat = AnyDevice(mac_address="00:41:20:00:6a:63", manager=manager)
    hat.connect()


    #Start looking for input
    thread = threading.Thread(target=lookForInput)
    thread.start()


    #Start main loop
    manager.run()