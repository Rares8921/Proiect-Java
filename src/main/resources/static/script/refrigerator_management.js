const API_BASE = "/api/refrigerators"
const token = localStorage.getItem("jwt")

async function loadRefrigerators() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load refrigerators")
    const refrigerators = await resp.json()
    const tbody = document.getElementById("refTable").querySelector("tbody")
    tbody.innerHTML = ""
    refrigerators.forEach((ref) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${ref.id}</td>
        <td>${ref.name}</td>
        <td>${ref.temperature}</td>
        <td>${ref.doorOpen ? "Open" : "Closed"}</td>
        <td>${ref.inventorySize || 0}</td>
        <td>
          <button onclick="deleteRefrigerator('${ref.id}')">Delete</button>
          <button onclick="controlRefrigerator('${ref.id}')">Control</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function addRefrigerator() {
  const id = document.getElementById("newId").value
  const name = document.getElementById("newName").value
  try {
    const resp = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, name, temperature: 4 }),
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadRefrigerators()
  } catch (e) {
    document.getElementById("message").textContent = "Error adding refrigerator: " + e.message
  }
}

async function deleteRefrigerator(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadRefrigerators()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting refrigerator: " + e.message
  }
}

function controlRefrigerator(id) {
  window.location.href = `/refrigerator_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}
document.getElementById("backBtn").addEventListener("click", backToDashboard)

document.getElementById("addBtn").addEventListener("click", addRefrigerator)
document.getElementById("refreshBtn").addEventListener("click", loadRefrigerators)

loadRefrigerators()
