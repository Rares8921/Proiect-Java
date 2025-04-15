
  const urlParams = new URLSearchParams(window.location.search);
  const cameraId = urlParams.get('id');
  const API_BASE = "/api/cameras";

  async function loadCamera() {
    try {
      const resp = await fetch(`${API_BASE}/${cameraId}`);
      if (!resp.ok) throw new Error("Failed to load camera data");
      const data = await resp.json();
      document.getElementById("cameraId").textContent = data.id;
      document.getElementById("cameraName").textContent = data.name;
      document.getElementById("recordingStatus").textContent = data.isRecording ? "Recording" : "Stopped";
      document.getElementById("resolution").textContent = data.resolution;
      document.getElementById("sensitivity").textContent = data.detectionSensitivity;
      document.getElementById("sensitivityInput").value = data.detectionSensitivity;
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function toggleRecording() {
    try {
      const resp = await fetch(`${API_BASE}/${cameraId}/toggle`, { method: 'POST' });
      if (!resp.ok) throw new Error("Failed to toggle recording");
      document.getElementById("message").textContent = "Recording toggled";
      setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
      loadCamera();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function updateSensitivity() {
    const newSensitivity = document.getElementById("sensitivityInput").value;
    try {
      const resp = await fetch(`${API_BASE}/${cameraId}/updateSensitivity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detectionSensitivity: newSensitivity })
      });
      if (!resp.ok) throw new Error("Failed to update sensitivity");
      document.getElementById("message").textContent = "Detection sensitivity updated to " + newSensitivity;
      setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
      loadCamera();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  function goBack() {
    window.location.href = "/camera_management.html";
  }

  loadCamera();
