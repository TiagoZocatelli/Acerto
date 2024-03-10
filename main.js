let funcionarioLogado = null;
let cupons = [];
let valorTotal = 0;
let valorCombustivelTotal = 0;

function removerCupom(index) {
    // Remove o cupom da lista de cupons
    cupons.splice(index, 1);
    // Atualiza a lista de cupons exibida
    atualizarListaCupons();
}

function adicionarCupom() {
    let nomeFuncionario = document.getElementById('nome').value;
    let data = document.getElementById('data').value;
    let tipoCupom = document.getElementById('tipoCupom').value;

    // Verifica se os campos obrigatórios estão preenchidos
    if (!nomeFuncionario || !data) {
        alert('Por favor, preencha todos os campos obrigatórios (Nome do Funcionário e Data).');
        return;
    }

    let valor = 0;
    let chaveCupom = '';
    let valorCombustivel = 0;
    let chaveCupomCombustivel = '';

    if (tipoCupom === 'normal') {
        valor = parseFloat(document.getElementById('valor').value.replace(',', '.')) || 0;
        chaveCupom = document.getElementById('chaveCupom').value;
    } else if (tipoCupom === 'combustivel') {
        valorCombustivel = parseFloat(document.getElementById('valorCombustivel').value.replace(',', '.')) || 0;
        chaveCupomCombustivel = document.getElementById('chaveCupomCombustivel').value;
    }

    // Adiciona o cupom à lista de cupons
    cupons.push({ nomeFuncionario, data, tipoCupom, valor, chaveCupom, valorCombustivel, chaveCupomCombustivel });

    // Atualiza o valor total e o valor total do combustível
    valorTotal += valor;
    valorCombustivelTotal += valorCombustivel;

    // Limpa os campos de entrada
    document.getElementById('valor').value = '';
    document.getElementById('chaveCupom').value = '';
    document.getElementById('valorCombustivel').value = '';
    document.getElementById('chaveCupomCombustivel').value = '';

    // Atualiza a lista de cupons exibida
    atualizarListaCupons();
}


function atualizarListaCupons() {
    let listaCupons = document.getElementById('listaCupons');
    listaCupons.innerHTML = '';

    cupons.forEach(cupom => {
        let li = document.createElement('li');
        li.innerHTML = `
            <div><strong>Data:</strong> ${cupom.data}</div>
            <div><strong>Valor:</strong> R$ ${cupom.valor.toFixed(2)}</div>
            ${cupom.chaveCupom ? `<div><strong>Chave do Cupom:</strong> ${cupom.chaveCupom}</div>` : ''}
            ${cupom.valorCombustivel ? `<div><strong>Valor do Combustível:</strong> R$ ${cupom.valorCombustivel.toFixed(2)}</div>` : ''}
            ${cupom.chaveCupomCombustivel ? `<div><strong>Chave do Cupom do Combustível:</strong> ${cupom.chaveCupomCombustivel}</div>` : ''}
            <button onclick="removerCupom(${cupons.indexOf(cupom)})">Remover</button>
        `;
        listaCupons.appendChild(li);
    });
}

function gerarRelatorio(tipo) {
    // Verifica se há cupons registrados
    const cuponsAtivos = cupons.filter(cupom => cupom.valor !== 0);
    if (cuponsAtivos.length === 0) {
        alert('Não há cupons registrados para gerar o relatório.');
        return;
    }

    // Captura o nome do funcionário
    const nomeFuncionarioInput = document.getElementById('nome');
    funcionarioLogado = nomeFuncionarioInput.value;

    if (!funcionarioLogado) {
        alert('Por favor, insira o nome do funcionário antes de gerar o relatório.');
        return;
    }

    const relatorioContainer = document.getElementById('relatorio-container');
    relatorioContainer.innerHTML = '';

    const titulo = document.createElement('h2');
    titulo.textContent = tipo === 'detalhado' ? 'Relatório Detalhado de Cupons' : 'Relatório Resumido';
    relatorioContainer.appendChild(titulo);

    const funcionario = document.createElement('p');
    funcionario.textContent = `Funcionário: ${funcionarioLogado}`;
    relatorioContainer.appendChild(funcionario);

    if (tipo === 'detalhado') {
        const listaCupons = document.createElement('ul');
        cuponsAtivos.forEach(cupom => {
            const cupomItem = document.createElement('li');
            cupomItem.innerHTML = `
                <div><strong>Data:</strong> ${cupom.data}</div>
                <div><strong>Valor:</strong> R$ ${cupom.valor.toFixed(2)}</div>
                ${cupom.chaveCupom ? `<div><strong>Chave do Cupom:</strong> ${cupom.chaveCupom}</div>` : ''}
                ${cupom.valorCombustivel ? `<div><strong>Valor do Combustível:</strong> R$ ${cupom.valorCombustivel.toFixed(2)}</div>` : ''}
                ${cupom.chaveCupomCombustivel ? `<div><strong>Chave do Cupom do Combustível:</strong> ${cupom.chaveCupomCombustivel}</div>` : ''}
            `;
            listaCupons.appendChild(cupomItem);
        });
        relatorioContainer.appendChild(listaCupons);
    }

    const totalCupons = document.createElement('p');
    const totalCuponsValor = cuponsAtivos.reduce((total, cupom) => total + cupom.valor, 0);
    totalCupons.textContent = `Total dos Cupons: R$ ${totalCuponsValor.toFixed(2)}`;
    relatorioContainer.appendChild(totalCupons);

    if (tipo === 'resumido') {
        const totalCombustivel = document.createElement('p');
        const totalCombustivelValor = cuponsAtivos.reduce((total, cupom) => total + cupom.valorCombustivel, 0);
        totalCombustivel.textContent = `Total de Combustível (Convênio): R$ ${totalCombustivelValor.toFixed(2)}`;
        relatorioContainer.appendChild(totalCombustivel);
    }

    const imprimirBotao = document.createElement('button');
    imprimirBotao.textContent = 'Imprimir Relatório';
    imprimirBotao.classList.add('imprimir-botao');
    imprimirBotao.onclick = function() {
        const relatorioWindow = window.open('', '_blank');
        relatorioWindow.document.write('<html><head><title>Relatório de Cupons</title>');
        relatorioWindow.document.write('<style>');
        relatorioWindow.document.write('body { font-family: Arial, sans-serif; background-color: #f7f7f7; }');
        relatorioWindow.document.write('.relatorio-container { max-width: 800px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }');
        relatorioWindow.document.write('h2 { text-align: center; color: #333; }');
        relatorioWindow.document.write('p { margin: 10px 0; }');
        relatorioWindow.document.write('ul { list-style-type: none; padding-left: 0; }');
        relatorioWindow.document.write('li { margin-bottom: 10px; }');
        relatorioWindow.document.write('strong { font-weight: bold; color: #555; }');
        relatorioWindow.document.write('@media print { .imprimir-botao { display: none; } }'); // Oculta o botão de impressão ao imprimir
        relatorioWindow.document.write('</style>');
        relatorioWindow.document.write('</head><body>');
        relatorioWindow.document.write('<div class="relatorio-container">');
        relatorioWindow.document.write(relatorioContainer.innerHTML);
        relatorioWindow.document.write('</div>');
        relatorioWindow.document.write('</body></html>');
        relatorioWindow.print();
    };
    relatorioContainer.appendChild(imprimirBotao);
}
function mostrarCampos() {
    let tipoCupom = document.getElementById('tipoCupom').value;
    let camposCupomNormal = document.getElementById('camposCupomNormal');
    let camposCombustivelConvenio = document.getElementById('camposCombustivelConvenio');

    if (tipoCupom === 'normal') {
        camposCupomNormal.style.display = 'block';
        camposCombustivelConvenio.style.display = 'none';
    } else if (tipoCupom === 'combustivel') {
        camposCupomNormal.style.display = 'none';
        camposCombustivelConvenio.style.display = 'block';
    }
}

function prepararExportacaoPDF() {
    funcionarioLogado = document.getElementById('nome').value;
    if (funcionarioLogado) {
        gerarPDF();
    } else {
        alert('Por favor, insira o nome do funcionário antes de exportar para PDF.');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const scanButton = document.getElementById('scanButton');
    const resultadoDiv = document.getElementById('resultado');

    // Função para escanear o código QR
    scanButton.addEventListener('click', () => {
        const video = document.createElement('video');

        // Captura o vídeo da câmera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
                video.style.display = 'none'; // Esconde o vídeo
                document.body.appendChild(video); // Adiciona o vídeo ao corpo do documento
            })
            .catch((err) => {
                console.error('Não foi possível acessar a câmera: ', err);
            });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // A cada intervalo de tempo, escaneia o código QR
        const scanInterval = setInterval(() => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            if (code) {
                // Verifica se o código QR contém a chave de 44 dígitos
                const chaveCupomInput = document.getElementById('chaveCupom');
                if (code.data.length === 44) {
                    chaveCupomInput.value = code.data; // Preenche o campo de chave de cupom
                    resultadoDiv.innerText = `Chave do Cupom: ${code.data}`;
                    clearInterval(scanInterval); // Para o escaneamento quando o código é encontrado
                    video.srcObject.getTracks().forEach(track => track.stop()); // Para a câmera
                    video.remove(); // Remove o vídeo do DOM
                } else {
                    alert('O código QR não contém uma chave de cupom válida.');
                }
            }
        }, 1000);
    });

    // Adicione aqui as outras funções que você deseja integrar ao carregamento do DOM
});
