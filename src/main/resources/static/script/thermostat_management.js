const API_BASE = "/api/thermostats"
const token = localStorage.getItem("jwt")

async function loadThermostats() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load thermostats")
    const thermostats = await resp.json()
    const tbody = document.getElementById("thermoTable").querySelector("tbody")
    tbody.innerHTML = ""
    thermostats.forEach(renderThermostatRow)
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function renderThermostatRow(th) {
  const tbody = document.getElementById("thermoTable").querySelector("tbody")
  const tr = document.createElement("tr")
  tr.innerHTML = `
    <td>${th.id}</td>
    <td>${th.name}</td>
    <td>${th.temperature}</td>
    <td>${th.mode}</td>
    <td>${th.isOn ? "ON" : "OFF"}</td>
    <td class="vertical-buttons">
      <button onclick="deleteThermostat('${th.id}')" class="delete">Delete</button>
      <button onclick="controlThermostat('${th.id}')" class="control">Control</button>
    </td>
  `
  tbody.appendChild(tr)
}

async function addThermostat() {
  const id = document.getElementById("newId").value.trim();
  const name = document.getElementById("newName").value.trim();

  if (!id || !name) {
    document.getElementById("message").textContent = "ID and Name are required.";
    return;
  }

  try {
    const resp = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name, temperature: 22, mode: "AUTO" }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(errorText || "Add thermostat failed");
    }

    const added = await resp.json();
    renderThermostatRow(added);
    document.getElementById("message").textContent = `Thermostat ${added.id} added`;
    setTimeout(() => {
      document.getElementById("message").textContent = "";
    }, 3000);
    document.getElementById("newId").value = "";
    document.getElementById("newName").value = "";
  } catch (e) {
    document.getElementById("message").textContent = "Error: " + e.message;
  }
}


async function deleteThermostat(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Delete failed")
    document.getElementById("message").textContent = `Thermostat ${id} deleted`
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadThermostats()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting thermostat: " + e.message
  }
}

function controlThermostat(id) {
  window.location.href = `/thermostat_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}

document.getElementById("addBtn").addEventListener("click", addThermostat)
document.getElementById("refreshBtn").addEventListener("click", loadThermostats)
document.getElementById("backBtn").addEventListener("click", backToDashboard)

loadThermostats()
