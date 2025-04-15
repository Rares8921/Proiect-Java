
  const API_BASE = "/api/assistant";
  const token = localStorage.getItem("jwt");

  async function loadAssistants() {
    try {
      const resp = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!resp.ok) throw new Error("Failed to load assistants");
      const assistants = await resp.json();
      const tbody = document.getElementById("assistantTable").querySelector("tbody");
      tbody.innerHTML = "";
      assistants.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.name}</td>
          <td>${a.hubId}</td>
          <td>${a.eventLogSize}</td>
          <td>
            <button onclick="deleteAssistant('${a.id}')">Delete</button>
            <button onclick="controlAssistant('${a.id}')">Control</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function addAssistant() {
    const id = document.getElementById("newId").value;
    const name = document.getElementById("newName").value;
    const hubId = document.getElementById("newHubId").value;
    try {
      const resp = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name, hubId })
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadAssistants();
    } catch (e) {
      document.getElementById("message").textContent = "Error adding assistant: " + e.message;
    }
  }

  async function deleteAssistant(id) {
    try {
      const resp = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadAssistants();
    } catch (e) {
      document.getElementById("message").textContent = "Error deleting assistant: " + e.message;
    }
  }

  function controlAssistant(id) {
    window.location.href = `/assistant_control.html?id=${id}`;
  }

  function backToDashboard() {
    window.location.href = '/dashboard.html';
  }

  document.getElementById("addBtn").addEventListener("click", addAssistant);
  document.getElementById("refreshBtn").addEventListener("click", loadAssistants);
  document.getElementById("backBtn").addEventListener("click", backToDashboard);

  loadAssistants();
