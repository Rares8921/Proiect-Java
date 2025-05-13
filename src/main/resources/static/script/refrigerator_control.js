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
    document.getElementById("inventory").textContent = JSON.stringify(data.inventory)
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
  const item = document.getElementById("itemName").value
  const expiry = document.getElementById("expiryDate").value
  try {
    const resp = await fetch(`${API_BASE}/${refId}/addItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ item, expiry }),
    })
    if (!resp.ok) throw new Error("Failed to add item")
    document.getElementById("message").textContent = "Item added"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadRefrigerator()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function removeItem() {
  const item = document.getElementById("itemName").value
  try {
    const resp = await fetch(`${API_BASE}/${refId}/removeItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ item }),
    })
    if (!resp.ok) throw new Error("Failed to remove item")
    document.getElementById("message").textContent = "Item removed"
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 3000)
    loadRefrigerator()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function checkExpired() {
  try {
    const resp = await fetch(`${API_BASE}/${refId}/checkExpired`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to check expired items")
    const result = await resp.text()
    document.getElementById("message").textContent = result
    setTimeout(() => {
      document.getElementById("message").textContent = ""
    }, 5000)
    loadRefrigerator()
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

function goBack() {
  window.location.href = "/refrigerator_management.html"
}

loadRefrigerator()
