
    const token = localStorage.getItem("jwt");
    const urlParams = new URLSearchParams(window.location.search);
    const assistantId = urlParams.get('id');
    const API_BASE = "/api/assistant";

    async function loadAssistant() {
        try {
            const resp = await fetch(`${API_BASE}/${assistantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!resp.ok) throw new Error("Failed to load assistant data");
            const data = await resp.json();
            document.getElementById("assistantId").textContent = data.id;
            document.getElementById("assistantName").textContent = data.name;
            document.getElementById("hubId").textContent = data.hubId;
            document.getElementById("eventLog").textContent = data.eventLog.join(" | ");
        } catch (e) {
            document.getElementById("message").textContent = e.message;
        }
    }

    async function sendCommand() {
        const command = document.getElementById("commandInput").value;
        try {
            const resp = await fetch(`${API_BASE}/${assistantId}/process?command=${encodeURIComponent(command)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!resp.ok) throw new Error("Failed to process command");
            document.getElementById("message").textContent = "Command processed";
            setTimeout(() => {
                document.getElementById("message").textContent = "";
            }, 3000);
            loadAssistant();
        } catch (e) {
            document.getElementById("message").textContent = e.message;
        }
    }

    function goBack() {
        window.location.href = "/assistant_management.html";
    }

    loadAssistant();
