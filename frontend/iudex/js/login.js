document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita recarregar a página

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token); // Armazena o token
            messageElement.style.color = "green";
            messageElement.textContent = "Login bem-sucedido!";
            setTimeout(() => window.location.href = "index.html", 1000); // Redireciona após 1s
        } else {
            messageElement.textContent = data.message || "Erro ao fazer login";
        }
    } catch (error) {
        console.error("Erro:", error);
        messageElement.textContent = "Erro no servidor";
    }
});