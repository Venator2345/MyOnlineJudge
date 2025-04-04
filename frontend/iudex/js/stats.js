window.onload = async () => {
    const token = localStorage.getItem("token"); 

    if (!token) {
        alert("Você precisa estar logado para acessar esta área!");
        window.location.href = "login.html"; 
        return;
    }

    let userId, userName;
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o payload do token
        userId = payload.id;
        userName = payload.name;
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
    }
    document.getElementById('userName').innerHTML = 'Nome de usuário: <b>' + userName + '</b>';
    

    const result = await fetch(`https://myonlinejudge.onrender.com/attempts/${userId}`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    });
    attempts = await result.json();

    fillStats(attempts);
}

function fillStats(attempts)  {
    console.log(attempts);

    let qtdAc = 0, qtdTle = 0, qtdErr = 0, qtdWa = 0;
    let qtd6502 = 0, qtdJs = 0, qtdCpp = 0, qtdPython = 0;
    const solvedExercises = new Set(); // Set pra rastrear exercícios únicos com AC

    for (let i = 0; i < attempts.length; i++) {
        // Contagem de resultados (conta todas as tentativas)
        if (attempts[i].result === 'AC') {
            // Só adiciona ao contador de AC se o exercício ainda não foi resolvido
            if (!solvedExercises.has(attempts[i].exercise_id)) {
                qtdAc++;
                solvedExercises.add(attempts[i].exercise_id);
            }
        } else if (attempts[i].result === 'TLE') {
            qtdTle++;
        } else if (attempts[i].result === 'WA') {
            qtdWa++;
        } else {
            qtdErr++;
        }

        // Contagem de linguagens (conta todas as tentativas)
        if (attempts[i].language === '6502') {
            qtd6502++;
        } else if (attempts[i].language === 'js') {
            qtdJs++;
        } else if (attempts[i].language === 'python') {
            qtdPython++;
        } else {
            qtdCpp++;
        }
    }

    document.getElementById('attemptCounter').innerHTML = 'tentativas: ' + attempts.length;
    document.getElementById('correctAnswerCounter').innerHTML = 'exercícios resolvidos: ' + qtdAc;

    const xValues = ["AC", "WA", "ERR", "TLE"];
    const yValues = [solvedExercises.size, qtdWa, qtdErr, qtdTle]; // Usa o tamanho do Set no gráfico pra AC
    const barColors = [
        "#0f0",
        "#f00",
        "#fa0",
        "#00f"
    ];

    const xValuesLanguage = ["ASM 6502", "Python", "C++", "Javascript"];
    const yValuesLanguage = [qtd6502, qtdPython, qtdCpp, qtdJs];
    const barColorsLanguage = [
    "#333",
    "#0f7",
    "#fa0",
    "#78f"
    ];

    new Chart("myChart", {
    type: "doughnut",
    data: {
        labels: xValues,
        datasets: [{
        backgroundColor: barColors,
        data: yValues,
        }]
    },
    options: {
        title: {
        display: true,
        text: "Resultados"
        }
    }
    });

    new Chart("myChartLanguages", {
        type: "doughnut",
        data: {
            labels: xValuesLanguage,
            datasets: [{
            backgroundColor: barColorsLanguage,
            data: yValuesLanguage,
            }]
        },
        options: {
            title: {
            display: true,
            text: "Linguagens"
            }
        }
        });
}