
    const urlParams = new URLSearchParams(window.location.search);
    const sensorId = urlParams.get('id');
    const API_BASE = "/api/sensors";

    async function loadSensor() {
        try {
            const resp = await fetch(`${API_BASE}/${sensorId}`);
            if (!resp.ok) throw new Error("Failed to load sensor data");
            const data = await resp.json();
            document.getElementById("sensorId").textContent = data.id;
            document.getElementById("sensorName").textContent = data.name;
            document.getElementById("sensorType").textContent = data.sensorType;
            document.getElementById("lastReading").textContent = data.lastReading;
        } catch (e) {
            document.getElementById("message").textContent = e.message;
        }
    }

    async function updateReading() {
        const newReading = document.getElementById("readingInput").value;
        try {
            const resp = await fetch(`${API_BASE}/${sensorId}/updateReading`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lastReading: newReading })
            });
            if (!resp.ok) throw new Error("Failed to update sensor reading");
            document.getElementById("message").textContent = "Sensor reading updated";
            setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
            loadSensor();
        } catch (e) {
            document.getElementById("message").textContent = e.message;
        }
    }

    function goBack() {
        window.location.href = "/sensor_management.html";
    }

    loadSensor();
