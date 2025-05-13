const urlParams = new URLSearchParams(window.location.search)
const plugId = urlParams.get("id")
const API_BASE = "/api/smartplugs"
const token = localStorage.getItem("jwt")

async function loadSmartPlug() {
  try {
    const resp = await fetch(`${API_BASE}/${plugId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load smart plug data")
    const data = await resp.json()
    document.getElementById("plugId").textContent = data.id
    document.getElementById("plugName").textContent = data.name
    document.getElementById("powerStatus").textContent = data.isOn ? "ON" : "OFF"
    document.getElementById("consumption").textContent = data.currentConsumption
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function togglePower() {
  try {
    const resp = await fetch(`${API_BASE}/${plugId}/toggle`, {
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
    loadSmartPlug()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function goBack() {
  window.location.href = "/smartplug_management.html"
}

loadSmartPlug()
