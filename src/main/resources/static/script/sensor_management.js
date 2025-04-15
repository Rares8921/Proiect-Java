
    const API_BASE = "/api/sensors";

    async function loadSensors() {
        try {
            const token = localStorage.getItem("jwt");
const resp = await fetch(API_BASE, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
            if (!resp.ok) throw new Error("Failed to load sensors");
            const sensors = await resp.json();
            const tbody = document.getElementById("sensorTable").querySelector("tbody");
            tbody.innerHTML = "";
            sensors.forEach(sensor => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${sensor.id}</td>
          <td>${sensor.name}</td>
          <td>${sensor.sensorType}</td>
          <td>${sensor.lastReading}</td>
          <td>
            <button onclick="deleteSensor('${sensor.id}')">Delete</button>
            <button onclick="controlSensor('${sensor.id}')">Control</button>
          </td>
        `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            document.getElementById("message").textContent = e.message;
        }
    }

    async function addSensor() {
        const id = document.getElementById("newId").value;
        const name = document.getElementById("newName").value;
        const sensorType = document.getElementById("newType").value;
        try {
            const resp = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, sensorType, lastReading: 0 })
            });
            const msg = await resp.text();
            document.getElementById("message").textContent = msg;
            loadSensors();
        } catch (e) {
            document.getElementById("message").textContent = "Error adding sensor: " + e.message;
        }
    }

    async function deleteSensor(id) {
        try {
            const resp = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            const msg = await resp.text();
            document.getElementById("message").textContent = msg;
            loadSensors();
        } catch (e) {
            document.getElementById("message").textContent = "Error deleting sensor: " + e.message;
        }
    }

    function controlSensor(id) {
        window.location.href = `/sensor_control.html?id=${id}`;
    }

    function backToDashboard() {
        window.location.href = '/dashboard.html';
    }
    document.getElementById("backBtn").addEventListener("click", backToDashboard);

    document.getElementById("addBtn").addEventListener("click", addSensor);
    document.getElementById("refreshBtn").addEventListener("click", loadSensors);

    loadSensors();
