// Função que executa o código do usuário
function runCode() {
    try {
        // Usar uma função anônima para executar o código do usuário
        const result = new Function('input', 
			`
			let outputString = '';
			let inputString = ${document.getElementById('inputData').value}

			console.log = function(message) {
				outputString += message;
				outputString += '\\n';
			};
			
			${document.getElementById('userCode').value} 
			
			return outputString;`)(inputData);

        document.getElementById('output').textContent = result;
    } catch (error) {
        // Se houver um erro, exibe na área de saída
        document.getElementById('output').textContent = `Erro: ${error.message}`;
    }
}
