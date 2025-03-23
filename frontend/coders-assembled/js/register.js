document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita recarregar a página

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    let user = await fetch(`http://localhost:3000/users/${username}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    user = await user.json();

    if(user !== null) {
        messageElement.textContent = "Já existe um usuário com este nome!";
    }
    else {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.style.color = "green";
            messageElement.textContent = "Conta criada!";
            setTimeout(() => window.location.href = "index.html", 1000); // Redireciona após 1s
        } else {
            messageElement.textContent = data.message || "Erro ao criar a conta";
        }
    }
    
});