const API_BASE = "/api/cameras"
const token = localStorage.getItem("jwt")

async function loadCameras() {
  try {
    const resp = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!resp.ok) throw new Error("Failed to load cameras")
    const cameras = await resp.json()
    const tbody = document.getElementById("cameraTable").querySelector("tbody")
    tbody.innerHTML = ""
    cameras.forEach((cam) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${cam.id}</td>
        <td>${cam.name}</td>
        <td>${cam.isRecording ? "Recording" : "Stopped"}</td>
        <td>${cam.resolution}</td>
        <td>${cam.detectionSensitivity}</td>
        <td>
          <button onclick="deleteCamera('${cam.id}')" class="delete">Delete</button>
          <button onclick="controlCamera('${cam.id}')">Control</button>
        </td>
      `
      tbody.appendChild(tr)
    })
  } catch (e) {
    document.getElementById("message").textContent = e.message
  }
}

async function addCamera() {
  const id = document.getElementById("newId").value
  const name = document.getElementById("newName").value
  const resolution = document.getElementById("newResolution").value
  const sensitivity = Number.parseInt(document.getElementById("newSensitivity").value)
  try {
    const resp = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        name,
        resolution,
        detectionSensitivity: sensitivity,
        // Implicit, valoare default pentru isRecording: false
        lastReading: 0, // nu se aplică la camera, dar se poate ignora
      }),
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadCameras()
  } catch (e) {
    document.getElementById("message").textContent = "Error adding camera: " + e.message
  }
}

async function deleteCamera(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const msg = await resp.text()
    document.getElementById("message").textContent = msg
    loadCameras()
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting camera: " + e.message
  }
}

function changeSensitivity(step) {
  const input = document.getElementById("newSensitivity");
  let val = parseInt(input.value) || 5;
  val = Math.max(1, Math.min(10, val + step));
  input.value = val;
}

function validateSensitivity(input) {
  let val = parseInt(input.value);
  if (isNaN(val)) input.value = '';
  else input.value = Math.max(1, Math.min(10, val));
}

function controlCamera(id) {
  window.location.href = `/camera_control.html?id=${id}`
}

function backToDashboard() {
  window.location.href = "/dashboard.html"
}

document.getElementById("addBtn").addEventListener("click", addCamera)
document.getElementById("refreshBtn").addEventListener("click", loadCameras)
document.getElementById("backBtn").addEventListener("click", backToDashboard)

loadCameras()
