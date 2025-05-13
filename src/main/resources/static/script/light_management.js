const API_BASE = "/api/lights"
const token = localStorage.getItem("jwt")

async function loadLights() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load lights")
    const lights = await resp.json()
    const tbody = document.getElementById("lightTable").querySelector("tbody")
    tbody.innerHTML = ""
    lights.forEach((light) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${light.id}</td>
        <td>${light.name}</td>
        <td>${light.isOn ? "On" : "Off"}</td>
        <td>${light.brightness}</td>
        <td>${light.color}</td>
        <td>
          <button onclick="toggleLight('${light.id}')">Toggle</button>
          <button onclick="controlLight('${light.id}')">Control</button>
          <button onclick="deleteLight('${light.id}')">Delete</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function addLight() {
  const id = document.getElementById("newId").value
  const name = document.getElementById("newName").value
  try {
    const resp = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name }),
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadLights()
  } catch (e) {
    document.getElementById("message").textContent = "Error adding light: " + e.message
  }
}

async function deleteLight(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadLights()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting light: " + e.message
  }
}

function toggleLight(id) {
  fetch(`${API_BASE}/${id}/toggle`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => loadLights())
    .catch((err) => (document.getElementById("message").textContent = "Error toggling light: " + err))
}

function controlLight(id) {
  window.location.href = `/light_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}
document.getElementById("backBtn").addEventListener("click", backToDashboard)

document.getElementById("addBtn").addEventListener("click", addLight)
document.getElementById("refreshBtn").addEventListener("click", loadLights)

loadLights()
