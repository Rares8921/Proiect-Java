const urlParams = new URLSearchParams(window.location.search)
const sprinklerId = urlParams.get("id")
const API_BASE = "/api/sprinklers"
const token = localStorage.getItem("jwt")

async function loadSprinkler() {
  try {
    const resp = await fetch(`${API_BASE}/${sprinklerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load sprinkler data")
    const data = await resp.json()
    document.getElementById("sprinklerId").textContent = data.id
    document.getElementById("sprinklerName").textContent = data.name
    document.getElementById("powerStatus").textContent = data.isOn ? "ON" : "OFF"
    document.getElementById("duration").textContent = data.wateringDuration
    document.getElementById("durationInput").value = data.wateringDuration
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function togglePower() {
  try {
    const resp = await fetch(`${API_BASE}/${sprinklerId}/toggle`, {
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
    loadSprinkler()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function updateDuration() {
  const newDuration = document.getElementById("durationInput").value
  try {
    const resp = await fetch(`${API_BASE}/${sprinklerId}/updateDuration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ wateringDuration: newDuration }),
    })
    if (!resp.ok) throw new Error("Update duration")
    document.getElementById("message").textContent = "Duration updated to " + newDuration + " min"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadSprinkler()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function goBack() {
  window.location.href = "/sprinkler_management.html"
}

loadSprinkler()
