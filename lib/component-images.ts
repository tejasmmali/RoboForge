/** Component product images — Google Shopping thumbnails */

const LOCAL_FALLBACK = "/components/arduino-uno-r3.jpg";

export const componentImages: Record<string, string> = {
  "arduino-uno-r3":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRWgR5BS6VsblzPHBdH3Chi6hbv5u_7JMsXn2ZTO50VK8FVgQU1PXDl737vbvP1GB99lAb5ZynzDdO490cs3bmxLUYOZiiYGg",
  "esp32-devkit":
    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSlNSm7ukUA9TrD4UlsQbcdL8LVFZa0sUV3fQJ2ijpo8uepMhmPGqCr4HGK6BMPQb2Vt7J0xdL1FOY79adqKJU6PYSXlJfTDdQhC2HksljJrD4XvkYm2mOf",
  "raspberry-pi-5":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRj-3317z11JK3BJXXCrs6EhTXkwTlWYp8dj-rAzQ8rrsLW8dsrEqu7ySua92o0PLzcP1LTfDfrs6eioDRubC546u8ZIpmT8J8Eusialvs5P51UKc0eEP_i",
  "hc-sr04":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT267S6ppU84sXgi7Of-lRvC-ctHiAJLb3f4knQN7er8j3V4LD7_aRxdixg0UFyh5cyrTtZ7Xs93MrvaGc9WQiibfKpOINzhPALAumqz-Xb9qEYazRv7PaTPA",
  "ir-sensor":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSXlsx9mTVft4fP0LA_fPLE-1_sGNQVgyzWOdvaNgW5HuXXaUGQj1J_XDeNmV9ry2hPi7hc2uX1cb6FLKPMRXHBqkC_Aw41VztXED2iCPSJ2DNwjattS4Z4ng",
  l298n:
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRZIlm19pgsPJK-A3TrqLWzP0ZJoeUUHGIIcsqLiv6VjXy0e3RssmFnyQBQmbddO6pvC9lpRISDBYlXJNeH9zN_S_o9e1jsCuSIXmX9wwN7eiewfQW9XKy1",
  "servo-sg90":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSDgTp-8p7GVOrXMnSLvMubw1YqY4mf7E7111-3GmZhzYU6pJBMp1HlwH7XXjBmFA99Ma5FUWJeDjV3ZmldmuIVUl-YvlBy_KcjR891sJK-QgT-ndm9TSEM7tQ",
  "dc-geared-motor":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQhd9hhFvND0TxjgVyv_n-xvxJT51BODrSt8lIe8Qbs-o5arKEQRFZXEbj7SvUSE48OSnHLL2pm6SX8qbB6NauHR6_CGd1YtTwDOeh5eIrRP8I1bg16HBL_zjVr",
  "stepper-nema17":
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTrnbaeFK5Yld8JNwjXwPw1uZXvsofoU7NdBgCR5_f74GliSSbZTfN-HtbEf2Dvwdmokl8Dr1-uetGpvrM83ITNSe1Bfgn98eH8YYJKrpszAPYPB7oRs7q8SA",
  "jumper-wires":
    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQi2OOvHV2H0NuytyqM3PAS3Msh2Xm14hjw7x0ygGXEKunqbJEBz9oMcUmXbel10YW6uD14GWOQ1EkOG1lThxukv_MvMkyCItfrsoB6wXBaQXQWxTgVe4nP",
  breadboard:
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSOZIVDfZf5aNNqY2f4pDJVMxCEUH2PyeEh7I4ISviI8czKz5vqWZudimw6PJbQBGrr2q3iPWIqGEEu5DoBTYbYqmAcXJnrzowNXfekpxwWW5Z_Q7EfWsRk",
  "oled-display":
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR-NBAmAxJCVxCIPqa6lHOJK-YshllYfpW3U0OIWAV5fY31AxMnyHCgNNNiJKrh3G8Bf1iQNN0S0jNaz2zWEDTFMJE8rzeE7DplAjswHrZDBG2IlstE5gE7tSfY",
  "lcd-16x2":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRq4ZKy2UdT8rL3KHD-3yaM0mI4YN_g7NpJa1rQD18okqGuD0haI-aFE5HL7wefnf8gwL_FCMNla7IKFkf7KGzzR-6enJ-yWz8m6H2UdryyHbMjEjsOPXXQ",
  "relay-module":
    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQx6NvUiU4Wh6I-J5oDZbmV5Vwc-_GGbfxxm0M730N98hc5U6NE4ROS2bDNk_Z_Ukl165nAmI_Qb8n54FTx_DcZmAyVFo5KTya-F5PWXBFEVJyprNXK8GPn",
  "bluetooth-hc05":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTtdRDVcYg_bAtyLMVYTaFuTQlzd8nrQKyCj9amufM2QyeZcf2fzzw8uOrr-xvQmSoIbYEVEmgCnfiA9aE7EmMGqv4oXekly9euICfFICaDy6KxtCRRBlxb",
  "wifi-esp8266":
    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcScis-rgTO3CTdLL9GXvkWpTQ6kJexr6WyezBtdbFUJ33xRTSTcxQuGYdrjLTIfMu7JBvZFTkc2c-PTkDbjWmCEZczz4vHfdA",
  mpu6050:
    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSFEZRRgNCewQr6R9Nefrtm-MfoZEJOoHebWfm-2WOYPpWopqf26FGPqZPtzmgkngk8bNUyyHhYGq7HAtkw2He1Y_Gnil6zjLViwC2ITizNtby0qsN8kplAWZWY",
  "flame-sensor":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRJxEAVaXK9V2BgvaHDWaY51E5njeIZq4KcqnIIA25mKtp1C5YTLRZgkCX9LU9nmjnUVx0wvk9DHkuAr8aFO6ppM2FbVTEeCkX7b-lPwWudfgRZ01fTHnQ1rg",
  "gas-sensor-mq2":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRdijspbr-KPkHoxteEY2tkjWxS0qJOykBSalB2keKy0y19bMnKh2UNgX5xAkQDD3WzpcLlKsO5qnkmM-lHM4rn6JquYGJpQDZh0t9T7PXF0rQKW599V3k5LQ",
  "soil-moisture":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTsB5mBj1NRPGGajjIyWZ5gSHJ1FWCHEKpIFWdYu2G76oNveNc0PAF508WXwtTSUhl_7s_dDKD-MUwvL5pprdGYZ53O-MAN5QWPzBJJYs0O",
  "pir-motion":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT46CpUH9o7jEUtgLgKI_7Nz2rGNJ_Y4s3k0xafELBOvg0LjwTnW5uinEkxnnTCsvBlCBAdMZvijSZIPKvoZ9hOe65c6vWvNZR2fI9-wg0pRFD02hdEImP7",
  dht11:
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQRrUbLfukfPl6haLsrkf_s0AL1qGigRIFYBpe4ZT_z9eh-5MtWvWt0pk7H33G66BDgn_LQ-e0nfl6YKCuLZehbklefMGKGLPiwvToAcLS9lXDlqv9VxVvzvw",
  dht22:
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTftCVOytcMrUdhOMTSd6mdfSHxK0hxJYfgaZi-tcbtwxBuIcXzDy7w6Rf4sU-NQPZ8ND2C7xM5iPCKFsWZB5Qhay6GQgvRe1p3khPle9uhMSQL0Vm1jlgPRA",
  buzzer:
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSf6wZIGQ_mjj9Y2zld85ikd3wLp0AkPHWpEcOk2NVqsoY2VQhvScranygGA9BTJMFqYv6m9H-Ek26cQpbd9w2exjVY_PtNLeK6rrxZ6S8Ribn0mBQRFYG5",
  "led-pack":
    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTdwsToqew56O_s2cr8aE4BcIhAt1QUdbwQ6gW_yUIIXNBvVnpYAV9eOUdrbjO137-1f4EPe7wQE4TV8LegNgrQrn_Hso9VHfiiTp7LtyrjwWWxVIvYYx2E",
  "resistor-kit":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRyVL0fHTgJZ_xB8CyQQ90FbBVjlEACYQa1ut2u4jrpgv9HRrntxqFOdg3qQ9oVDo2g6f0PpSpjQsMLf5zHkwCc76csjJpa2crfhL8YEXY0olPolTcaFw4MOIA",
  "capacitor-kit":
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSkKZWvTmY_qiHzO-jLAtebcb-TXQhQ26xfjjMpti1QgUTvgglsmjawjv5Ewizsgmk5WDHez-6njqTAG--w2dR5xS-L0wQnrFSNwit5ylHsy8YFQwJ0tfeUnQ",
  "battery-holder":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQsZZcARXH_vLcE2cU8uW1ouQ9Kn86vLLNhMkIpbGSPC_khNIdOem856T_c0rGKHUw_fAZN8JDXAhf7pfIQIT5eUgOMXJHsE8Znvmf8CFJaD7ov5yACVh0Hag",
  "18650-battery":
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTzPd_Z_nZNriAKVqcVXzTQJj6BWu5rs5wl3M7BVsF6VP0t82FrGcPh3oLOWrKUdIfvvxHkWVljdsxMDCBrE9fW31JH-SRcScL0F4dYRthfD8AygP86hHrIsQ",
  "power-module":
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSeag_q62A1AGUvEoH5QF61tYWoWYxeojCPtx7ojWNrZbv7s4yzjkqHJNb2Pih3DHChDV5muMTgbbxAeLhqvePW8WiLm1wT",
};

export function getComponentImage(slug: string): string {
  return componentImages[slug] ?? LOCAL_FALLBACK;
}
