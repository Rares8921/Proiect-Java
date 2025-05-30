const token = localStorage.getItem("jwt");
const urlParams = new URLSearchParams(window.location.search);
const assistantId = urlParams.get("id");
const API_BASE = "/api/assistant";

function getUserId() {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
}

async function loadAssistant() {
    try {
        const resp = await fetch(`${API_BASE}/${assistantId}?user_id=${getUserId()}`, {
            headers: { Authorization: `Bearer ${token}` }
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
    const command = document.getElementById("commandInput").value.trim();
    if (!command) {
        document.getElementById("message").textContent = "Please enter a command.";
        return;
    }

    try {
        const resp = await fetch(`${API_BASE}/${assistantId}/process?user_id=${getUserId()}&command=${encodeURIComponent(command)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error("Failed to process command");
        document.getElementById("message").textContent = "Command processed";
        document.getElementById("commandInput").value = "";
        setTimeout(() => {
            document.getElementById("message").textContent = "";
        }, 3000);
        loadAssistant();
    } catch (e) {
        document.getElementById("message").textContent = "Error: " + e.message;
    }
}

function goBack() {
    window.location.href = "/assistant_management.html";
}

loadAssistant();
