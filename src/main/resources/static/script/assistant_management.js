const API_BASE = "/api/assistant";
const HUB_API = "/api/hubs";
const token = localStorage.getItem("jwt");

function getUserId() {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.sub;
}

async function loadAssistants() {
  try {
    const resp = await fetch(`${API_BASE}?user_id=${getUserId()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error("Backend error: " + errorText);
    }

    const assistants = await resp.json();
    console.log("Assistants loaded:", assistants);  // vezi direct obiectele

    const tbody = document.getElementById("assistantTable").querySelector("tbody");
    tbody.innerHTML = "";

    assistants.forEach((a) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.id}</td>
        <td>${a.name}</td>
        <td>${a.hubId}</td>
        <td>${a.eventLogSize}</td>
        <td>
          <button onclick="deleteAssistant('${a.id}')" class="delete">Delete</button>
          <button onclick="controlAssistant('${a.id}')">Control</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (e) {
    console.error("loadAssistants error:", e);
    document.getElementById("message").textContent = e.message;
  }
}


async function loadHubs() {
  try {
    const resp = await fetch(`${HUB_API}?user_id=${getUserId()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) throw new Error("Failed to load hubs");
    const hubs = await resp.json();
    const select = document.getElementById("newHubId");
    select.innerHTML = `<option value="">Select a Hub</option>`;
    hubs.forEach((hub) => {
      const opt = document.createElement("option");
      opt.value = hub.id;
      opt.textContent = `${hub.id} - ${hub.name}`;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error("Error loading hubs:", e.message);
  }
}

async function addAssistant() {
  const id = document.getElementById("newId").value.trim();
  const name = document.getElementById("newName").value.trim();
  const hubId = document.getElementById("newHubId").value;

  if (!id || !name || !hubId) {
    document.getElementById("message").textContent = "Please complete all fields.";
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}?user_id=${getUserId()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, hubId })
    });

    const msg = await resp.text();
    document.getElementById("message").textContent = msg;

    if (resp.ok) {
      await loadAssistants();
    }
  } catch (e) {
    document.getElementById("message").textContent = "Error adding assistant: " + e.message;
  }
}

async function deleteAssistant(id) {
  try {
    const resp = await fetch(`${API_BASE}/${id}?user_id=${getUserId()}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const msg = await resp.text();
    document.getElementById("message").textContent = msg;
    if (resp.ok) {
      await loadAssistants();
    }
  } catch (e) {
    document.getElementById("message").textContent = "Error deleting assistant: " + e.message;
  }
}

function controlAssistant(id) {
  window.location.href = `/assistant_control.html?id=${id}`;
}

function backToDashboard() {
  window.location.href = "/dashboard.html";
}

document.getElementById("addBtn").addEventListener("click", addAssistant);
document.getElementById("refreshBtn").addEventListener("click", loadAssistants);
document.getElementById("backBtn").addEventListener("click", backToDashboard);

document.addEventListener("DOMContentLoaded", () => {
  loadAssistants();
  loadHubs();
});