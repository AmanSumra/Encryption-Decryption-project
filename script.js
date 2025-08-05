const API_URL = "http://localhost:5500"; // Matches backend port

// Dark Mode Toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Check if dark mode was enabled previously
if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
}

// Toggle Dark Mode and Save Preference
darkModeToggle.addEventListener("change", function () {
    if (darkModeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("dark-mode", "enabled");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("dark-mode", "disabled");
    }
});

// Function to Encrypt Text
async function encrypt() {
    const text = document.getElementById("plaintext").value;

    if (!text.trim()) {
        alert("⚠️ Please enter text to encrypt.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/encrypt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();
        if (data.encrypted) {
            document.getElementById("encrypted").value = data.encrypted;
        } else {
            alert("❌ Encryption failed.");
        }
    } catch (error) {
        alert("❌ Encryption failed. Make sure the backend is running.");
    }
}

// Function to Decrypt Text
async function decrypt() {
    const text = document.getElementById("encrypted").value;

    if (!text.trim()) {
        alert("⚠️ Please enter encrypted text to decrypt.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/decrypt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();
        if (data.decrypted) {
            document.getElementById("decrypted").value = data.decrypted;
        } else {
            alert("❌ Decryption failed.");
        }
    } catch (error) {
        alert("❌ Decryption failed. Make sure the encrypted text is valid.");
    }
}
