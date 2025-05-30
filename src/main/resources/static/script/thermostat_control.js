const urlParams = new URLSearchParams(window.location.search);
const thermoId = urlParams.get("id");
const API_BASE = "/api/thermostats";
const token = localStorage.getItem("jwt");

function populateThermostatUI(data) {
  document.getElementById("thermoId").textContent = data.id;
  document.getElementById("thermoName").textContent = data.name;
  document.getElementById("powerStatus").textContent = data.isOn ? "ON" : "OFF";
  document.getElementById("modeLabel").textContent = data.mode;
  document.getElementById("currentTemp").textContent = data.temperature;
  document.getElementById("tempSlider").value = data.temperature;
  document.getElementById("targetTemp").textContent = data.temperature;
}

async function loadThermostat() {
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) throw new Error("Failed to load thermostat");
    const data = await resp.json();
    populateThermostatUI(data);
  } catch (e) {
    document.getElementById("message").textContent = e.message;
  }
}

document.getElementById("tempSlider").addEventListener("input", function () {
  document.getElementById("targetTemp").textContent = this.value;
});
document.getElementById("tempSlider").addEventListener("change", updateTemperature);

async function updateTemperature() {
  const newTemp = document.getElementById("tempSlider").value;
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ temperature: newTemp }),
    });

    const contentType = resp.headers.get("Content-Type");
    if (!resp.ok) throw new Error(await resp.text() || "Failed to update temperature");
    const updated = contentType.includes("application/json") ? await resp.json() : null;
    if (updated) populateThermostatUI(updated);
    document.getElementById("message").textContent = `Temperature updated to ${newTemp}°C`;
    setTimeout(() => (document.getElementById("message").textContent = ""), 3000);
  } catch (e) {
    document.getElementById("message").textContent = e.message;
  }
}

async function updateMode(mode) {
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mode: mode }),
    });

    const contentType = resp.headers.get("Content-Type");
    if (!resp.ok) throw new Error(await resp.text() || "Failed to update mode");
    const updated = contentType.includes("application/json") ? await resp.json() : null;
    if (updated) populateThermostatUI(updated);
    document.getElementById("message").textContent = `Mode updated to ${mode}`;
    setTimeout(() => (document.getElementById("message").textContent = ""), 3000);
  } catch (e) {
    document.getElementById("message").textContent = e.message;
  }
}

async function togglePower() {
  try {
    const resp = await fetch(`${API_BASE}/${thermoId}/toggle`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const contentType = resp.headers.get("Content-Type");
    if (!resp.ok) throw new Error(await resp.text() || "Failed to toggle power");
    const updated = contentType.includes("application/json") ? await resp.json() : null;
    if (updated) populateThermostatUI(updated);
    document.getElementById("message").textContent = "Power toggled";
    setTimeout(() => (document.getElementById("message").textContent = ""), 3000);
  } catch (e) {
    document.getElementById("message").textContent = e.message;
  }
}

async function fetchAmbientTempFromLocation() {
  try {
    const resp = await fetch(`/api/thermostats/weather`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(resp);
    if (!resp.ok) throw new Error("Weather API failed");
    const data = await resp.json();
    return data.temperature;
  } catch (e) {
    console.error("Weather fetch error:", e);
    return null;
  }
}


async function autoAdjust() {
  const ambientTemp = await fetchAmbientTempFromLocation();
  if (ambientTemp === null) {
    document.getElementById("message").textContent = "Failed to get ambient temp";
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/${thermoId}/autoAdjust`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ambientTemp }),
    });

    const contentType = resp.headers.get("Content-Type");
    if (!resp.ok) throw new Error(await resp.text() || "Auto adjust failed");
    const updated = contentType.includes("application/json") ? await resp.json() : null;
    if (updated) populateThermostatUI(updated);
    document.getElementById("message").textContent = "Auto-adjusted with " + ambientTemp.toFixed(1) + "°C";
    setTimeout(() => (document.getElementById("message").textContent = ""), 3000);
  } catch (e) {
    document.getElementById("message").textContent = e.message;
  }
}

function goBack() {
  window.location.href = "/thermostat_management.html";
}

document.addEventListener("DOMContentLoaded", loadThermostat);
