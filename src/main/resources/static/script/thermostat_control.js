const urlParams = new URLSearchParams(window.location.search)
const thermoId = urlParams.get("id")
const API_BASE = "/api/thermostats"
const token = localStorage.getItem("jwt")

async function loadThermostat() {
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load thermostat data")
    const data = await resp.json()
    document.getElementById("thermoId").textContent = data.id
    document.getElementById("thermoName").textContent = data.name
    document.getElementById("powerStatus").textContent = data.isOn ? "ON" : "OFF"
    document.getElementById("modeLabel").textContent = data.mode
    document.getElementById("currentTemp").textContent = data.temperature
    document.getElementById("tempSlider").value = data.temperature
    document.getElementById("targetTemp").textContent = data.temperature
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

document.getElementById("tempSlider").addEventListener("input", function () {
  document.getElementById("targetTemp").textContent = this.value
})
document.getElementById("tempSlider").addEventListener("change", updateTemperature)

async function updateTemperature() {
  const newTemp = document.getElementById("tempSlider").value
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ temperature: newTemp }),
    })
    if (!resp.ok) throw new Error("Update temperature")
    document.getElementById("message").textContent = "Temperature updated to " + newTemp + "°C"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadThermostat()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function updateMode(mode) {
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mode: mode }),
    })
    if (!resp.ok) throw new Error("Update mode")
    document.getElementById("message").textContent = "Mode updated to " + mode
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadThermostat()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function togglePower() {
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to toggle power")
    document.getElementById("message").textContent = "Power toggled"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadThermostat()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function autoAdjust() {
  const ambientTemp = document.getElementById("ambientInput").value
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}/autoAdjust`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ambientTemp: ambientTemp }),
    })
    if (!resp.ok) throw new Error("Failed to auto adjust")
    document.getElementById("message").textContent = "Auto adjust successful"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadThermostat()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function goBack() {
  window.location.href = "/thermostat_management.html"
}

loadThermostat()
