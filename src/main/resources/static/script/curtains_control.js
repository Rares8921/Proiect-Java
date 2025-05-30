const token = localStorage.getItem("jwt");
const urlParams = new URLSearchParams(window.location.search);
const curtainsId = urlParams.get("id");
const API_BASE = "/api/curtains";

async function loadCurtains() {
  try {
    const resp = await fetch(`${API_BASE}/${curtainsId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    document.getElementById("curtainsId").textContent = data.id;
    document.getElementById("curtainsName").textContent = data.name;
    document.getElementById("position").textContent = data.position;
    document.getElementById("positionInput").value = data.position;
  } catch (e) {
    document.getElementById("message").textContent = e.message;
  }
}

async function updatePosition() {
  const newPos = parseInt(document.getElementById("positionInput").value);
  if (isNaN(newPos) || newPos < 0 || newPos > 100) {
    document.getElementById("message").textContent = "Position must be between 0 and 100.";
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/${curtainsId}/updatePosition`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ position: newPos })
    });

    const msg = await resp.text();
    document.getElementById("message").textContent = msg;
    loadCurtains();
  } catch (e) {
    document.getElementById("message").textContent = "Error updating position: " + e.message;
  }
}


function changePosition(step) {
  const input = document.getElementById("positionInput");
  let value = parseInt(input.value) || 0;
  value = Math.max(0, Math.min(100, value + step));
  input.value = value;
}

function validatePosition(input) {
  let val = parseInt(input.value);
  if (isNaN(val)) input.value = "";
  else input.value = Math.max(0, Math.min(100, val));
}

function goBack() {
  window.location.href = "/curtains_management.html";
}

document.addEventListener("DOMContentLoaded", loadCurtains);
