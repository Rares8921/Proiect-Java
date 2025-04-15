
  const urlParams = new URLSearchParams(window.location.search);
  const alarmId = urlParams.get('id');
  const API_BASE = "/api/alarm";

  async function loadAlarm() {
    try {
      const resp = await fetch(`${API_BASE}/${alarmId}`);
      if (!resp.ok) throw new Error("Failed to load alarm data");
      const data = await resp.json();
      document.getElementById("alarmId").textContent = data.id;
      document.getElementById("alarmName").textContent = data.name;
      document.getElementById("armedStatus").textContent = data.isArmed ? "Armed" : "Disarmed";
      document.getElementById("triggeredStatus").textContent = data.alarmTriggered ? "Triggered" : "Normal";
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function armAlarm() {
    try {
      const resp = await fetch(`${API_BASE}/${alarmId}/arm`, { method: 'POST' });
      if (!resp.ok) throw new Error("Failed to arm alarm");
      document.getElementById("message").textContent = "Alarm armed";
      setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
      loadAlarm();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function disarmAlarm() {
    try {
      const resp = await fetch(`${API_BASE}/${alarmId}/disarm`, { method: 'POST' });
      if (!resp.ok) throw new Error("Failed to disarm alarm");
      document.getElementById("message").textContent = "Alarm disarmed";
      setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
      loadAlarm();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function triggerAlarm() {
    try {
      const resp = await fetch(`${API_BASE}/${alarmId}/trigger`, { method: 'POST' });
      if (!resp.ok) throw new Error("Failed to trigger alarm");
      document.getElementById("message").textContent = "Alarm triggered";
      setTimeout(() => { document.getElementById("message").textContent = ""; }, 3000);
      loadAlarm();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  function goBack() {
    window.location.href = "/alarm_management.html";
  }

  loadAlarm();
