
  const API_BASE = "/api/ovens";

  async function loadOvens() {
    try {
      const token = localStorage.getItem("jwt");
const resp = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
      if (!resp.ok) throw new Error("Failed to load ovens");
      const ovens = await resp.json();
      const tbody = document.getElementById("ovenTable").querySelector("tbody");
      tbody.innerHTML = "";
      ovens.forEach(oven => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${oven.id}</td>
          <td>${oven.name}</td>
          <td>${oven.isOn ? "On" : "Off"}</td>
          <td>${oven.temperature}</td>
          <td>${oven.timer}</td>
          <td>${oven.preheat ? "Active" : "Inactive"}</td>
          <td>
            <button onclick="toggleOven('${oven.id}')">Toggle</button>
            <button onclick="controlOven('${oven.id}')">Control</button>
            <button onclick="deleteOven('${oven.id}')">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function addOven() {
    const id = document.getElementById("newId").value;
    const name = document.getElementById("newName").value;
    try {
      const resp = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadOvens();
    } catch (e) {
      document.getElementById("message").textContent = "Error adding oven: " + e.message;
    }
  }

  async function deleteOven(id) {
    try {
      const resp = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const msg = await resp.text();
      document.getElementById("message").textContent = msg;
      loadOvens();
    } catch (e) {
      document.getElementById("message").textContent = "Error deleting oven: " + e.message;
    }
  }

  function toggleOven(id) {
    fetch(`${API_BASE}/${id}/toggle`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => loadOvens())
    .catch(err => {
      document.getElementById("message").textContent = "Error toggling oven: " + err;
    });
  }

  function controlOven(id) {
    window.location.href = `/oven_control.html?id=${id}`;
  }

  function backToDashboard() {
    window.location.href = '/dashboard.html';
  }
  document.getElementById("backBtn").addEventListener("click", backToDashboard);

  document.getElementById("addBtn").addEventListener("click", addOven);
  document.getElementById("refreshBtn").addEventListener("click", loadOvens);

  loadOvens();
