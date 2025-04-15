
  const API_BASE = "/api/thermostats";

  async function loadThermostats() {
    try {
      const token = localStorage.getItem("jwt");
const resp = await fetch(API_BASE, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
      if (!resp.ok) throw new Error("Failed to load thermostats");
      const thermostats = await resp.json();
      const tbody = document.getElementById("thermoTable").querySelector("tbody");
      tbody.innerHTML = "";
      thermostats.forEach(th => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${th.id}</td>
          <td>${th.name}</td>
          <td>${th.temperature}</td>
          <td>${th.mode}</td>
          <td>${th.isOn ? "ON" : "OFF"}</td>
          <td>
            <button onclick="deleteThermostat('${th.id}')">Delete</button>
            <button onclick="controlThermostat('${th.id}')">Control</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function addThermostat() {
    const id = document.getElementById("newId").value;
    const name = document.getElementById("newName").value;
    try {
      const resp = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, temperature: 22, mode: "AUTO" })
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadThermostats();
    } catch (e) {
      document.getElementById("message").textContent = "Error adding thermostat: " + e.message;
    }
  }

  async function deleteThermostat(id) {
    try {
      const resp = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadThermostats();
    } catch (e) {
      document.getElementById("message").textContent = "Error deleting thermostat: " + e.message;
    }
  }

  function controlThermostat(id) {
    window.location.href = `/thermostat_control.html?id=${id}`;
  }

  function backToDashboard() {
    window.location.href = '/dashboard.html';
  }

  document.getElementById("addBtn").addEventListener("click", addThermostat);
  document.getElementById("refreshBtn").addEventListener("click", loadThermostats);
  document.getElementById("backBtn").addEventListener("click", backToDashboard);

  loadThermostats();
