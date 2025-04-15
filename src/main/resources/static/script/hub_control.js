
  const token = localStorage.getItem("jwt");
  const urlParams = new URLSearchParams(window.location.search);
  const hubId = urlParams.get('id');
  const API_BASE = "/api/hubs";

  async function loadHub() {
    try {
      const resp = await fetch(`${API_BASE}/${hubId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!resp.ok) throw new Error("Failed to load hub data");
      const data = await resp.json();
      document.getElementById("hubId").textContent = data.id;
      document.getElementById("hubName").textContent = data.name;
      document.getElementById("eventLog").textContent = data.eventLog
              ? data.eventLog.join(" | ")
              : "None";
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  function goBack() {
    window.location.href = "/hub_management.html";
  }

  loadHub();
