
    const API_BASE = "/api/doorlocks";
    const token = localStorage.getItem("jwt");

    async function loadDoorLocks() {
        try {
            const resp = await fetch(API_BASE, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!resp.ok) throw new Error("Failed to load door locks");
            const locks = await resp.json();
            const tbody = document.getElementById("doorLockTable").querySelector("tbody");
            tbody.innerHTML = "";
            locks.forEach(lock => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${lock.id}</td>
                    <td>${lock.name}</td>
                    <td>${lock.locked ? "Locked" : "Unlocked"}</td>
                    <td>
                      <button onclick="deleteDoorLock('${lock.id}')">Delete</button>
                      <button onclick="controlDoorLock('${lock.id}')">Control</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            document.getElementById("message").textContent = e.message;
        }
    }

    async function addDoorLock() {
        const id = document.getElementById("newId").value;
        const name = document.getElementById("newName").value;
        try {
            const resp = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, name })
            });
            const msg = await resp.text();
            document.getElementById("message").textContent = msg;
            loadDoorLocks();
        } catch (e) {
            document.getElementById("message").textContent = "Error adding door lock: " + e.message;
        }
    }

    async function deleteDoorLock(id) {
        try {
            const resp = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const msg = await resp.text();
            document.getElementById("message").textContent = msg;
            loadDoorLocks();
        } catch (e) {
            document.getElementById("message").textContent = "Error deleting door lock: " + e.message;
        }
    }

    function controlDoorLock(id) {
        window.location.href = `/doorlock_control.html?id=${id}`;
    }

    function backToDashboard() {
        window.location.href = '/dashboard.html';
    }

    document.getElementById("addBtn").addEventListener("click", addDoorLock);
    document.getElementById("refreshBtn").addEventListener("click", loadDoorLocks);
    document.getElementById("backBtn").addEventListener("click", backToDashboard);

    loadDoorLocks();
