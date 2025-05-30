const urlParams = new URLSearchParams(window.location.search)
const sensorId = urlParams.get("id")
const API_BASE = "/api/sensors"
const token = localStorage.getItem("jwt")

async function loadSensor() {
  try {
    const resp = await fetch(`${API_BASE}/${sensorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load sensor data")
    const data = await resp.json()
    document.getElementById("sensorId").textContent = data.id
    document.getElementById("sensorName").textContent = data.name
    document.getElementById("sensorType").textContent = data.sensorType
    document.getElementById("lastReading").textContent = data.lastReading
    setUnitForSensor(data.sensorType)
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function updateReading() {
  const newReading = document.getElementById("readingInput").value
  try {
    const resp = await fetch(`${API_BASE}/${sensorId}/updateReading`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lastReading: newReading }),
    })
    if (!resp.ok) throw new Error("Update sensor reading")
    document.getElementById("message").textContent = "Sensor reading updated"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadSensor()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function changeReading(step) {
  const input = document.getElementById("readingInput")
  let value = parseFloat(input.value)
  if (isNaN(value)) value = 0
  let newValue = value + step
  newValue = Math.max(0, Math.min(1000, newValue))
  input.value = (newValue % 1 === 0) ? newValue.toFixed(0) : newValue.toFixed(1)
}

function validateReading(input) {
  let value = parseFloat(input.value.replace(',', '.'))
  if (isNaN(value) || value < 0) {
    input.value = ''
    return
  }
  value = Math.min(1000, value)
  input.value = (value % 1 === 0) ? value.toFixed(0) : value.toFixed(1)
}

function setUnitForSensor(type) {
  const unitSpan = document.querySelector(".reading-wrapper .unit")
  const units = {
    TEMPERATURE: "°C",
    HUMIDITY: "%",
    LIGHT: "lx",
    GAS: "ppm",
    SMOKE: "ppm",
    SOUND: "dB",
    WATERLEAK: "⚠",
    DOOR: "",
    WINDOW: "",
    MOTION: ""
  }
  unitSpan.textContent = units[type] || ""
}

function goBack() {
  window.location.href = "/sensor_management.html"
}

document.addEventListener("DOMContentLoaded", () => {
  loadSensor()
})
