
  const token = localStorage.getItem("jwt");
  const urlParams = new URLSearchParams(window.location.search);
  const ovenId = urlParams.get('id');
  const API_BASE = "/api/ovens";

  async function loadOven() {
    try {
      const resp = await fetch(`${API_BASE}/${ovenId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error("Failed to load oven data");
      const data = await resp.json();
      document.getElementById("ovenId").textContent = data.id;
      document.getElementById("ovenName").textContent = data.name;
      document.getElementById("powerStatus").textContent = data.isOn ? "On" : "Off";
      document.getElementById("temperature").textContent = data.temperature;
      document.getElementById("timer").textContent = data.timer;
      document.getElementById("preheatStatus").textContent = data.preheat ? "Active" : "Inactive";
      document.getElementById("temperatureInput").value = data.temperature;
      document.getElementById("timerInput").value = data.timer;
      document.getElementById("preheatSelect").value = data.preheat;
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function updateTemperature() {
    const temperature = document.getElementById("temperatureInput").value;
    try {
      const resp = await fetch(`${API_BASE}/${ovenId}/updateTemperature?temperature=${temperature}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error("Update temperature");
      document.getElementById("message").textContent = "Temperature updated";
      setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
      loadOven();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function updateTimer() {
    const timer = document.getElementById("timerInput").value;
    try {
      const resp = await fetch(`${API_BASE}/${ovenId}/updateTimer?timer=${timer}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error("Update timer");
      document.getElementById("message").textContent = "Timer updated";
      setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
      loadOven();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function updatePreheat() {
    const preheat = document.getElementById("preheatSelect").value;
    try {
      const resp = await fetch(`${API_BASE}/${ovenId}/setPreheat?preheat=${preheat}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error("Update preheat");
      document.getElementById("message").textContent = "Preheat state updated";
      setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
      loadOven();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  function toggleOven() {
    fetch(`${API_BASE}/${ovenId}/toggle`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
            .then(() => loadOven())
            .catch(err => {
              document.getElementById("message").textContent = "Error toggling oven: " + err;
            });
  }

  function goBack() {
    window.location.href = "/oven_management.html";
  }

  loadOven();
