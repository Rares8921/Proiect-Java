
    function logout() {
        localStorage.removeItem('jwt');
        window.location.href = "/login";
    }

    async function loadStats() {
        try {
            const token = localStorage.getItem("jwt");
            const resp = await fetch('/api/statistics', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (resp.ok) {
                const stats = await resp.json();
                document.getElementById("totalDevices").textContent = stats.totalDevices;
                document.getElementById("onlineDevices").textContent = stats.onlineDevices;
            }
        } catch (e) {
            console.error("Failed to load statistics", e);
        }
    }

    loadStats();
