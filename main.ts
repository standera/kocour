let isWiFI = false
let WIFI_PW = "Lcdm5454"
let WIFI_SSID = "Samkova"
let WRITE_KEY = "AQBEVJGJQIZUI0RR"
let DELAY = 1800000
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
let isUpploading = false
basic.forever(function () {
    if (ESP8266_IoT.wifiState(true)) {
        isWiFI = true
        basic.clearScreen()
        ESP8266_IoT.connectThingSpeak()
        if (ESP8266_IoT.thingSpeakState(true)) {
            isUpploading = true
            basic.clearScreen()
            basic.showLeds(`
                . . . . .
                . . . . .
                . . # . .
                . . . . .
                . . . . .
                `)
            ESP8266_IoT.setData(
            WRITE_KEY,
            Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C),
            input.temperature(),
            Environment.octopus_BME280(Environment.BME280_state.BME280_humidity),
            Environment.octopus_BME280(Environment.BME280_state.BME280_pressure)
            )
            ESP8266_IoT.uploadData()
            isUpploading = false
            basic.clearScreen()
            basic.pause(DELAY)
        } else {
            basic.showIcon(IconNames.No)
        }
    } else {
        isWiFI = false
        basic.showIcon(IconNames.No)
        ESP8266_IoT.connectWifi(WIFI_SSID, WIFI_PW)
    }
})
loops.everyInterval(30000, function () {
    if (control.millis() >= 60000 && isWiFI) {
        if (!(isUpploading)) {
            basic.showString("V: " + input.temperature())
            basic.pause(500)
        }
        if (!(isUpploading)) {
            basic.showString("K: " + Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C))
            basic.pause(500)
        }
        basic.clearScreen()
    }
})
