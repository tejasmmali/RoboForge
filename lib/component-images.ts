/** Local product photography — sourced from Wikimedia Commons, Openverse, and Wikipedia */

const LOCAL_FALLBACK = "/components/arduino-uno-r3.jpg";

export const componentImages: Record<string, string> = {
  "arduino-uno-r3": "/components/arduino-uno-r3.jpg",
  "esp32-devkit": "/components/esp32-devkit.jpg",
  "raspberry-pi-5": "/components/raspberry-pi-5.jpg",
  "hc-sr04": "/components/hc-sr04.jpg",
  "ir-sensor": "/components/ir-sensor.jpg",
  l298n: "/components/l298n.jpg",
  "servo-sg90": "/components/servo-sg90.jpg",
  "dc-geared-motor": "/components/dc-geared-motor.jpg",
  "stepper-nema17": "/components/stepper-nema17.jpg",
  "jumper-wires": "/components/jumper-wires.jpg",
  breadboard: "/components/breadboard.jpg",
  "oled-display": "/components/oled-display.jpg",
  "lcd-16x2": "/components/lcd-16x2.jpg",
  "relay-module": "/components/relay-module.jpg",
  "bluetooth-hc05": "/components/bluetooth-hc05.jpg",
  "wifi-esp8266": "/components/wifi-esp8266.jpg",
  mpu6050: "/components/mpu6050.jpg",
  "flame-sensor": "/components/flame-sensor.jpg",
  "gas-sensor-mq2": "/components/gas-sensor-mq2.jpg",
  "soil-moisture": "/components/soil-moisture.jpg",
  "pir-motion": "/components/pir-motion.jpg",
  dht11: "/components/dht11.jpg",
  dht22: "/components/dht22.jpg",
  buzzer: "/components/buzzer.jpg",
  "led-pack": "/components/led-pack.jpg",
  "resistor-kit": "/components/resistor-kit.jpg",
  "capacitor-kit": "/components/capacitor-kit.jpg",
  "battery-holder": "/components/battery-holder.jpg",
  "18650-battery": "/components/18650-battery.jpg",
  "power-module": "/components/power-module.jpg",
};

export function getComponentImage(slug: string): string {
  return componentImages[slug] ?? LOCAL_FALLBACK;
}
