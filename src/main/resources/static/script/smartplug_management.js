const API_BASE = "/api/smartplugs"
const token = localStorage.getItem("jwt")

async function loadSmartPlugs() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load smart plugs")
    const plugs = await resp.json()
    const tbody = document.getElementById("plugTable").querySelector("tbody")
    tbody.innerHTML = ""
    plugs.forEach((plug) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${plug.id}</td>
        <td>${plug.name}</td>
        <td>${plug.isOn ? "ON" : "OFF"}</td>
        <td>${plug.currentConsumption}</td>
        <td>
          <button onclick="deleteSmartPlug('${plug.id}')" class="delete">Delete</button>
          <button onclick="controlSmartPlug('${plug.id}')">Control</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function addSmartPlug() {
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
    loadSmartPlugs()
  } catch (e) {
    document.getElementById("message").textContent = "Error adding smart plug: " + e.message
  }
}

async function deleteSmartPlug(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadSmartPlugs()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting smart plug: " + e.message
  }
}

function controlSmartPlug(id) {
  window.location.href = `/smartplug_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}
document.getElementById("backBtn").addEventListener("click", backToDashboard)

document.getElementById("addBtn").addEventListener("click", addSmartPlug)
document.getElementById("refreshBtn").addEventListener("click", loadSmartPlugs)

loadSmartPlugs()
