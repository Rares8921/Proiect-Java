
  const token = localStorage.getItem("jwt");
  const urlParams = new URLSearchParams(window.location.search);
  const lockId = urlParams.get('id');
  const API_BASE = "/api/doorlocks";

  async function loadLock() {
    try {
      const resp = await fetch(`${API_BASE}/${lockId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!resp.ok) throw new Error("Failed to load door lock data");
      const data = await resp.json();
      document.getElementById("lockId").textContent = data.id;
      document.getElementById("lockName").textContent = data.name;
      document.getElementById("lockStatus").textContent = data.locked ? "Locked" : "Unlocked";
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  async function toggleLock() {
    try {
      const resp = await fetch(`${API_BASE}/${lockId}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!resp.ok) throw new Error("Failed to toggle door lock");
      document.getElementById("message").textContent = "Door lock toggled";
      setTimeout(() => {
        document.getElementById("message").textContent = "";
      }, 3000);
      loadLock();
    } catch (e) {
      document.getElementById("message").textContent = e.message;
    }
  }

  function goBack() {
    window.location.href = "/doorlock_management.html";
  }

  loadLock();
