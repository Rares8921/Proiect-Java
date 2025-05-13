const API_BASE = "/api/sprinklers"
const token = localStorage.getItem("jwt")

async function loadSprinklers() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load sprinklers")
    const sprinklers = await resp.json()
    const tbody = document.getElementById("sprinklerTable").querySelector("tbody")
    tbody.innerHTML = ""
    sprinklers.forEach((s) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.isOn ? "ON" : "OFF"}</td>
        <td>${s.wateringDuration}</td>
        <td>
          <button onclick="deleteSprinkler('${s.id}')">Delete</button>
          <button onclick="controlSprinkler('${s.id}')">Control</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function addSprinkler() {
  const id = document.getElementById("newId").value
  const name = document.getElementById("newName").value
  const duration = Number.parseInt(document.getElementById("newDuration").value)
  try {
    const resp = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name, wateringDuration: duration }),
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadSprinklers()
  } catch (e) {
    document.getElementById("message").textContent = "Error adding sprinkler: " + e.message
  }
}

async function deleteSprinkler(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadSprinklers()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting sprinkler: " + e.message
  }
}

function controlSprinkler(id) {
  window.location.href = `/sprinkler_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}
document.getElementById("backBtn").addEventListener("click", backToDashboard)

document.getElementById("addBtn").addEventListener("click", addSprinkler)
document.getElementById("refreshBtn").addEventListener("click", loadSprinklers)

loadSprinklers()
