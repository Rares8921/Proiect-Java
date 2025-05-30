const urlParams = new URLSearchParams(window.location.search)
const chargerId = urlParams.get("id")
const API_BASE = "/api/carchargers"
const token = localStorage.getItem("jwt")

async function loadCharger() {
  try {
    const resp = await fetch(`${API_BASE}/${chargerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!resp.ok) throw new Error("Failed to load charger data")
    const data = await resp.json()
    document.getElementById("chargerId").textContent = data.id
    document.getElementById("chargerName").textContent = data.name
    document.getElementById("chargingStatus").textContent = data.isCharging ? "Charging" : "Stopped"
    document.getElementById("current").textContent = data.current + " A"
    document.getElementById("voltage").textContent = data.voltage + " V"
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function toggleCharging() {
  try {
    const resp = await fetch(`${API_BASE}/${chargerId}/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to toggle charging")
    document.getElementById("message").textContent = "Charging state toggled"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadCharger()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function goBack() {
  window.location.href = "/carcharger_management.html"
}

loadCharger()
