// Função que executa o código do usuário
function runCode() {

    try {
        // Usar uma função anônima para executar o código do usuário
        const result = new Function('input', 
			`
			let outputString = '';
			let inputString = document.getElementById('userInput').value;

			console.log = function(message) {
				outputString += message;
				outputString += '\\n';
			};
			
			${document.getElementById('userCode').value} 
			
			return outputString;`)();

        document.getElementById('output').textContent = result;
    } catch (error) {
        // Se houver um erro, exibe na área de saída
        document.getElementById('output').textContent = `Erro: ${error.message}`;
    }
}

async function submitCode() {
    const token = localStorage.getItem("token"); 

    if (!token) {
        alert("Você precisa estar logado para enviar o código!");
        window.location.href = "login.html"; 
        return;
    }
    
    let userId;
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o payload do token
        userId = payload.id;
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get("id");

    try {
        const result = await fetch('http://localhost:3000/attempts',{
            method: 'POST',
            
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                exerciseId: exerciseId,
                userId: userId,
                userCode: document.getElementById('userCode').value,
                language: document.getElementById('languages').value
            }) 
        });

        const jsonResult = await result.json();
        console.log(jsonResult.veredict);
        alert('Código Enviado! Resultado: ' + jsonResult.veredict);
    }catch(error) {
        console.error(error);
    }
    
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get("id"); // Pega o ID da URL

    if (!exerciseId) {
        alert("Nenhum exercício selecionado!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/exercises/${exerciseId}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar exercício: ${response.status}`);
        }

        const exercise = await response.json(); 

        // Preenche os elementos da página com os dados do exercício
        document.querySelector(".hero h2").textContent = exercise.title;
        document.querySelector(".hero p").innerHTML = exercise.description;

        // Preenche a tabela de entrada e saída
        const linhasInput = exercise.example_input.split('\n');
        const linhasOutput = exercise.example_output.split('\n');

        document.querySelector("table:nth-of-type(1) tbody tr td").innerHTML = '';
        linhasInput.forEach(element => {
            document.querySelector("table:nth-of-type(1) tbody tr td").innerHTML += element + '<br>';
        });
        document.querySelector("table:nth-of-type(2) tbody tr td").innerHTML = '';
        linhasOutput.forEach(element => {
            document.querySelector("table:nth-of-type(2) tbody tr td").innerHTML += element + '<br>';
        });
        

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar exercício!");
    }
});

document.getElementById("languages").addEventListener("change", function() {
    const selectedLanguage = this.options[this.selectedIndex].text;

    if(this.value === 'js')
        document.getElementById('userCode').placeholder='Em caso de escolha da linguagem Javascript, use as funções deste Online Judge: input e print';
    else
    document.getElementById('userCode').placeholder= '';

    languageSelected.textContent = 'Escreva sua solução em ' + selectedLanguage + '!';
});