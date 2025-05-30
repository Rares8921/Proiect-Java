const API_BASE = "/api/carchargers"
const token = localStorage.getItem("jwt")

async function loadChargers() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load car chargers")
    const chargers = await resp.json()
    const tbody = document.getElementById("chargerTable").querySelector("tbody")
    tbody.innerHTML = ""
    chargers.forEach((charger) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${charger.id}</td>
        <td>${charger.name}</td>
        <td>${charger.isCharging ? "Charging" : "Stopped"}</td>
        <td>${charger.current}</td>
        <td>${charger.voltage}</td>
        <td>
          <button onclick="deleteCharger('${charger.id}')" class="delete">Delete</button>
          <button onclick="controlCharger('${charger.id}')">Control</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function changeCurrent(step) {
  const input = document.getElementById("newCurrent")
  let value = parseFloat(input.value) || 0
  input.value = Math.max(0, Math.min(100, value + step))
}

function validateCurrent(input) {
  let val = parseFloat(input.value)
  if (isNaN(val)) input.value = ""
  else input.value = Math.max(0, Math.min(100, val))
}

function changeVoltage(step) {
  const input = document.getElementById("newVoltage")
  let value = parseFloat(input.value) || 0
  input.value = Math.max(0, Math.min(500, value + step))
}

function validateVoltage(input) {
  let val = parseFloat(input.value)
  if (isNaN(val)) input.value = ""
  else input.value = Math.max(0, Math.min(500, val))
}

async function addCharger() {
  const id = document.getElementById("newId").value.trim()
  const name = document.getElementById("newName").value.trim()
  const current = parseFloat(document.getElementById("newCurrent").value)
  const voltage = parseFloat(document.getElementById("newVoltage").value)

  if (!id || !name || isNaN(current) || isNaN(voltage)) {
    document.getElementById("message").textContent = "Please complete all fields correctly."
    return
  }

  try {
    const resp = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name, current, voltage }),
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadChargers()
  } catch (e) {
    document.getElementById("message").textContent = "Error adding car charger: " + e.message
  }
}

async function deleteCharger(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadChargers()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting charger: " + e.message
  }
}

function controlCharger(id) {
  window.location.href = `/carcharger_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}

document.getElementById("addBtn").addEventListener("click", addCharger)
document.getElementById("refreshBtn").addEventListener("click", loadChargers)
document.getElementById("backBtn").addEventListener("click", backToDashboard)

loadChargers()
