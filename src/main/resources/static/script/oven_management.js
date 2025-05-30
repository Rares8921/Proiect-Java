const API_BASE = "/api/ovens"
const token = localStorage.getItem("jwt")

async function loadOvens() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load ovens")
    const ovens = await resp.json()
    const tbody = document.getElementById("ovenTable").querySelector("tbody")
    tbody.innerHTML = ""
    ovens.forEach((oven) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${oven.id}</td>
        <td>${oven.name}</td>
        <td>${oven.isOn ? "On" : "Off"}</td>
        <td>${oven.temperature}</td>
        <td>${oven.timer}</td>
        <td>${oven.preheat ? "Active" : "Inactive"}</td>
        <td>
          <button onclick="toggleOven('${oven.id}')">Toggle</button>
          <button onclick="controlOven('${oven.id}')">Control</button>
          <button onclick="deleteOven('${oven.id}')" class="delete">Delete</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function addOven() {
  const id = document.getElementById("newId").value.trim()
  const name = document.getElementById("newName").value.trim()
  const temperature = parseFloat(document.getElementById("newTemperature").value)

  if (!id || !name || isNaN(temperature)) {
    document.getElementById("message").textContent = "Please enter all fields"
    return
  }

  const oven = {
    id,
    name,
    isOn: false,
    temperature,
    timer: 0,
    preheat: false
  }

  try {
    const resp = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(oven),
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadOvens()
  } catch (e) {
    document.getElementById("message").textContent = "Error adding oven: " + e.message
  }
}

async function deleteOven(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadOvens()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting oven: " + e.message
  }
}

function toggleOven(id) {
  fetch(`${API_BASE}/${id}/toggle`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => loadOvens())
    .catch((err) => {
      document.getElementById("message").textContent = "Error toggling oven: " + err
    })
}

function changeTemp(step, inputId) {
  const input = document.getElementById(inputId)
  let value = parseFloat(input.value)
  if (isNaN(value)) value = 0
  let newValue = value + step
  newValue = Math.max(50, Math.min(300, newValue))
  input.value = newValue
}

function validateTemp(input) {
  let value = parseFloat(input.value)
  if (isNaN(value)) {
    input.value = ''
    return
  }
  value = Math.max(50, Math.min(300, value))
  input.value = value
}


function controlOven(id) {
  window.location.href = `/oven_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}
document.getElementById("backBtn").addEventListener("click", backToDashboard)

document.getElementById("addBtn").addEventListener("click", addOven)
document.getElementById("refreshBtn").addEventListener("click", loadOvens)

loadOvens()
