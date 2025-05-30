
  const API_BASE = "/api/hubs";
  const token = localStorage.getItem("jwt");

  async function loadHubs() {
    try {
      const resp = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!resp.ok) throw new Error("Failed to load hubs");
      const hubs = await resp.json();
      const tbody = document.getElementById("hubTable").querySelector("tbody");
      tbody.innerHTML = "";
      hubs.forEach(hub => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${hub.id}</td>
          <td>${hub.name}</td>
          <td>${hub.eventLogSize}</td>
          <td>
            <button onclick="deleteHub('${hub.id}')" class="delete">Delete</button>
            <button onclick="controlHub('${hub.id}')">Control</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function addHub() {
    const id = document.getElementById("newId").value;
    const name = document.getElementById("newName").value;
    try {
      const resp = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name })
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadHubs();
    } catch (e) {
      document.getElementById("message").textContent = "Error adding hub: " + e.message;
    }
  }

  async function deleteHub(id) {
    try {
      const resp = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadHubs();
    } catch (e) {
      document.getElementById("message").textContent = "Error deleting hub: " + e.message;
    }
  }

  function controlHub(id) {
    window.location.href = `/hub_control.html?id=${id}`;
  }

  function backToDashboard() {
    window.location.href = '/dashboard.html';
  }

  document.getElementById("addBtn").addEventListener("click", addHub);
  document.getElementById("refreshBtn").addEventListener("click", loadHubs);
  document.getElementById("backBtn").addEventListener("click", backToDashboard);

  loadHubs();
