const urlParams = new URLSearchParams(window.location.search)
const curtainsId = urlParams.get("id")
const API_BASE = "/api/curtains"
const token = localStorage.getItem("jwt")

async function loadCurtains() {
  try {
    const resp = await fetch(`${API_BASE}/${curtainsId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load curtains data")
    const data = await resp.json()
    document.getElementById("curtainsId").textContent = data.id
    document.getElementById("curtainsName").textContent = data.name
    document.getElementById("position").textContent = data.position
    document.getElementById("positionInput").value = data.position
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function toggleCurtains() {
  try {
    const resp = await fetch(`${API_BASE}/${curtainsId}/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to toggle curtains")
    document.getElementById("message").textContent = "Curtains toggled"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadCurtains()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function updatePosition() {
  const pos = document.getElementById("positionInput").value
  try {
    const resp = await fetch(`${API_BASE}/${curtainsId}/updatePosition`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ position: pos }),
    })
    if (!resp.ok) throw new Error("Update position")
    document.getElementById("message").textContent = "Position updated to " + pos
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadCurtains()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function goBack() {
  window.location.href = "/curtains_management.html"
}

loadCurtains()
