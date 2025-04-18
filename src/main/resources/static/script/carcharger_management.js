
  const API_BASE = "/api/carchargers";

  async function loadChargers() {
    try {
      const token = localStorage.getItem("jwt");
const resp = await fetch(API_BASE, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
      if (!resp.ok) throw new Error("Failed to load car chargers");
      const chargers = await resp.json();
      const tbody = document.getElementById("chargerTable").querySelector("tbody");
      tbody.innerHTML = "";
      chargers.forEach(charger => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${charger.id}</td>
          <td>${charger.name}</td>
          <td>${charger.isCharging ? "Charging" : "Stopped"}</td>
          <td>${charger.current}</td>
          <td>${charger.voltage}</td>
          <td>
            <button onclick="deleteCharger('${charger.id}')">Delete</button>
            <button onclick="controlCharger('${charger.id}')">Control</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function addCharger() {
    const id = document.getElementById("newId").value;
    const name = document.getElementById("newName").value;
    try {
      const resp = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadChargers();
    } catch (e) {
      document.getElementById("message").textContent = "Error adding car charger: " + e.message;
    }
  }

  async function deleteCharger(id) {
    try {
      const resp = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadChargers();
    } catch (e) {
      document.getElementById("message").textContent = "Error deleting charger: " + e.message;
    }
  }

  function controlCharger(id) {
    window.location.href = `/carcharger_control.html?id=${id}`;
  }

  function backToDashboard() {
    window.location.href = '/dashboard.html';
  }

  document.getElementById("addBtn").addEventListener("click", addCharger);
  document.getElementById("refreshBtn").addEventListener("click", loadChargers);
  document.getElementById("backBtn").addEventListener("click", backToDashboard);

  loadChargers();
