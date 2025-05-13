const token = localStorage.getItem("jwt")
const urlParams = new URLSearchParams(window.location.search)
const lightId = urlParams.get("id")
const API_BASE = "/api/lights"

async function loadLight() {
  try {
    const resp = await fetch(`${API_BASE}/${lightId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load light data")
    const data = await resp.json()
    document.getElementById("lightId").textContent = data.id
    document.getElementById("lightName").textContent = data.name
    document.getElementById("powerStatus").textContent = data.isOn ? "On" : "Off"
    document.getElementById("brightness").textContent = data.brightness
    document.getElementById("color").textContent = data.color
    document.getElementById("brightnessInput").value = data.brightness
    document.getElementById("colorInput").value = data.color
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function updateBrightness() {
  const brightness = document.getElementById("brightnessInput").value
  try {
    const resp = await fetch(`${API_BASE}/${lightId}/updateBrightness?brightness=${brightness}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Update brightness")
    document.getElementById("message").textContent = "Brightness updated"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadLight()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function updateColor() {
  const color = document.getElementById("colorInput").value
  try {
    const resp = await fetch(`${API_BASE}/${lightId}/updateColor?color=${encodeURIComponent(color)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Update color")
    document.getElementById("message").textContent = "Color updated"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadLight()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function toggleLight() {
  fetch(`${API_BASE}/${lightId}/toggle`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => loadLight())
    .catch((err) => (document.getElementById("message").textContent = "Error toggling light: " + err))
}

function goBack() {
  window.location.href = "/light_management.html"
}

loadLight()
