const API_BASE = "/api/alarm"
const token = localStorage.getItem("jwt")

async function loadAlarms() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load alarm systems")
    const alarms = await resp.json()
    const tbody = document.getElementById("alarmTable").querySelector("tbody")
    tbody.innerHTML = ""
    alarms.forEach((alarm) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${alarm.id}</td>
        <td>${alarm.name}</td>
        <td>${alarm.isArmed ? "Armed" : "Disarmed"}</td>
        <td>${alarm.alarmTriggered ? "Triggered" : "Normal"}</td>
        <td>
          <button onclick="deleteAlarm('${alarm.id}')" class="delete">Delete</button>
          <button onclick="controlAlarm('${alarm.id}')" class="control">Control</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function addAlarm() {
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
    loadAlarms()
  } catch (e) {
    document.getElementById("message").textContent = "Error adding alarm: " + e.message
  }
}

async function deleteAlarm(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadAlarms()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting alarm: " + e.message
  }
}

function controlAlarm(id) {
  window.location.href = `/alarm_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}
document.getElementById("backBtn").addEventListener("click", backToDashboard)

document.getElementById("addBtn").addEventListener("click", addAlarm)
document.getElementById("refreshBtn").addEventListener("click", loadAlarms)

loadAlarms()
