/** Component catalog photography — electronics and robotics imagery */

export const componentImages: Record<string, string> = {
  "arduino-uno-r3":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85&auto=format&fit=crop",
  "esp32-devkit":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop",
  "raspberry-pi-5":
    "https://images.unsplash.com/photo-1535378917022-76240dbc3f92?w=800&q=85&auto=format&fit=crop",
  "hc-sr04":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=85&auto=format&fit=crop",
  "ir-sensor":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=85&auto=format&fit=crop",
  "l298n":
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=85&auto=format&fit=crop",
  "servo-sg90":
    "https://images.unsplash.com/photo-1473965768615-bbb7acb08979?w=800&q=85&auto=format&fit=crop",
  "dc-geared-motor":
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=85&auto=format&fit=crop",
  "stepper-nema17":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=85&auto=format&fit=crop",
  "jumper-wires":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85&auto=format&fit=crop",
  breadboard:
    "https://images.unsplash.com/photo-1501504905252-473bdc47e830?w=800&q=85&auto=format&fit=crop",
  "oled-display":
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=85&auto=format&fit=crop",
  "lcd-16x2":
    "https://images.unsplash.com/photo-1592214539128-2d9a2d0949b2?w=800&q=85&auto=format&fit=crop",
  "relay-module":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=85&auto=format&fit=crop",
  "bluetooth-hc05":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop",
  "wifi-esp8266":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop",
  mpu6050:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=85&auto=format&fit=crop",
  "flame-sensor":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=85&auto=format&fit=crop",
  "gas-sensor-mq2":
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=85&auto=format&fit=crop",
  "soil-moisture":
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=85&auto=format&fit=crop",
  "pir-motion":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=85&auto=format&fit=crop",
  dht11:
    "https://images.unsplash.com/photo-1592214539128-2d9a2d0949b2?w=800&q=85&auto=format&fit=crop",
  dht22:
    "https://images.unsplash.com/photo-1592214539128-2d9a2d0949b2?w=800&q=85&auto=format&fit=crop",
  buzzer:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85&auto=format&fit=crop",
  "led-pack":
    "https://images.unsplash.com/photo-1501504905252-473bdc47e830?w=800&q=85&auto=format&fit=crop",
  "resistor-kit":
    "https://images.unsplash.com/photo-1501504905252-473bdc47e830?w=800&q=85&auto=format&fit=crop",
  "capacitor-kit":
    "https://images.unsplash.com/photo-1501504905252-473bdc47e830?w=800&q=85&auto=format&fit=crop",
  "battery-holder":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=85&auto=format&fit=crop",
  "18650-battery":
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=85&auto=format&fit=crop",
  "power-module":
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=85&auto=format&fit=crop",
};

export function getComponentImage(slug: string): string {
  return (
    componentImages[slug] ??
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85&auto=format&fit=crop"
  );
}
