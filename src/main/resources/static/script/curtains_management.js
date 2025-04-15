
  const API_BASE = "/api/curtains";

  async function loadCurtains() {
    try {
      const token = localStorage.getItem("jwt");
const resp = await fetch(API_BASE, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
      if (!resp.ok) throw new Error("Failed to load curtains");
      const curtains = await resp.json();
      const tbody = document.getElementById("curtainsTable").querySelector("tbody");
      tbody.innerHTML = "";
      curtains.forEach(curtain => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${curtain.id}</td>
          <td>${curtain.name}</td>
          <td>${curtain.position}</td>
          <td>
            <button onclick="deleteCurtains('${curtain.id}')">Delete</button>
            <button onclick="controlCurtains('${curtain.id}')">Control</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function addCurtains() {
    const id = document.getElementById("newId").value;
    const name = document.getElementById("newName").value;
    const position = parseInt(document.getElementById("newPosition").value);
    try {
      const resp = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, position })
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadCurtains();
    } catch (e) {
      document.getElementById("message").textContent = "Error adding curtains: " + e.message;
    }
  }

  async function deleteCurtains(id) {
    try {
      const resp = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadCurtains();
    } catch (e) {
      document.getElementById("message").textContent = "Error deleting curtains: " + e.message;
    }
  }

  function controlCurtains(id) {
    window.location.href = `/curtains_control.html?id=${id}`;
  }

  function backToDashboard() {
    window.location.href = '/dashboard.html';
  }

  document.getElementById("addBtn").addEventListener("click", addCurtains);
  document.getElementById("refreshBtn").addEventListener("click", loadCurtains);
  document.getElementById("backBtn").addEventListener("click", backToDashboard);

  loadCurtains();
