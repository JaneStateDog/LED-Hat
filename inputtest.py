#import evdev
from evdev import InputDevice

#creates object 'gamepad' to store the data
#you can call it whatever you like
gamepad = InputDevice('/dev/input/event2')

#prints out device info at start
print(gamepad)

#evdev takes care of polling the controller in a loop
for event in gamepad.read_loop():
    if event.code == 0 or event.code == 3:
        continue



    print(str(event.code) + "     " + str(event.value))