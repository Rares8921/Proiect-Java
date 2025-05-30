const urlParams = new URLSearchParams(window.location.search)
const refId = urlParams.get("id")
const API_BASE = "/api/refrigerators"
const token = localStorage.getItem("jwt")

async function loadRefrigerator() {
  try {
    const resp = await fetch(`${API_BASE}/${refId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load refrigerator data")
    const data = await resp.json()
    document.getElementById("refId").textContent = data.id
    document.getElementById("refName").textContent = data.name
    document.getElementById("currentTemp").textContent = data.temperature
    document.getElementById("doorStatus").textContent = data.doorOpen ? "Open" : "Closed"
    document.getElementById("tempInput").value = data.temperature
    loadInventory()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function updateTemperature() {
  const newTemp = document.getElementById("tempInput").value
  try {
    const resp = await fetch(`${API_BASE}/${refId}/updateTemperature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ temperature: newTemp }),
    })
    if (!resp.ok) throw new Error("Update temperature")
    document.getElementById("message").textContent = "Temperature updated to " + newTemp + "°C"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadRefrigerator()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function toggleDoor() {
  try {
    const resp = await fetch(`${API_BASE}/${refId}/toggleDoor`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to toggle door")
    document.getElementById("message").textContent = "Door toggled"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadRefrigerator()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function addItem() {
  const name = document.getElementById("itemName").value
  const expiryDate = document.getElementById("expiryDate").value
  try {
    const resp = await fetch(`${API_BASE}/${refId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, expiryDate }),
    })
    if (!resp.ok) throw new Error("Failed to add item")
    document.getElementById("message").textContent = "Item added"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadInventory()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function loadInventory() {
  try {
    const resp = await fetch(`${API_BASE}/${refId}/items`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const items = await resp.json()
    const ul = document.getElementById("inventoryItems")
    ul.innerHTML = ""
    items.forEach(item => {
      const li = document.createElement("li")
      li.innerHTML = `
        ${item.name} – expires ${item.expiryDate}
        <button onclick="removeItem(${item.id})">Delete</button>
      `
      ul.appendChild(li)
    })
  } catch (e) {
    console.error("Error loading inventory:", e)
  }
}

async function removeItem(itemId) {
  try {
    const resp = await fetch(`${API_BASE}/${refId}/items/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadInventory()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function removeExpiredItems() {
  try {
    const resp = await fetch(`${API_BASE}/${refId}/items/expired`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadInventory()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function changeTemp(step) {
  const input = document.getElementById("tempInput")
  let value = parseFloat(input.value)
  if (isNaN(value)) value = 0
  let newValue = value + step
  newValue = Math.max(-5, Math.min(10, newValue))
  input.value = (newValue % 1 === 0) ? newValue.toFixed(0) : newValue.toFixed(1)
}

function validateTemp(input) {
  let value = parseFloat(input.value.replace(',', '.'))
  if (isNaN(value)) {
    input.value = ''
    return
  }
  value = Math.max(-5, Math.min(10, value))
  input.value = (value % 1 === 0) ? value.toFixed(0) : value.toFixed(1)
}

async function checkExpired() {
  try {
    const resp = await fetch(`${API_BASE}/${refId}/checkExpired`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await resp.text();
    document.getElementById("message").textContent = result;

    setTimeout(() => {
      document.getElementById("message").textContent = "";
    }, 5000);
  } catch (e) {
    document.getElementById("message").textContent = "Error checking expired items";
  }
}


function goBack() {
  window.location.href = "/refrigerator_management.html"
}

document.addEventListener("DOMContentLoaded", () => {
  loadRefrigerator()
})
