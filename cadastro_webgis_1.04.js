// ==UserScript==
// @name         Script de Preenchimento
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  Preenche automaticamente campos no WebGIS - implementação combobox
// @match        https://webgis.engefoto.com.br/portal/apps/webappviewer/index.html?id=6cbe01fc405f4834a8997f7897d286e9
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Mensagem para verificar se o script está sendo carregado
    console.log("Script carregado! 1.04");
	
	var currentUrl = window.location.href;

    var dadosObservacao = "Número de porta:";
    var nomeCadastrador = null;
    var dadosOperadorCQ = "Revisar Observação OK";
    var tipoCadastro = null;

    // Lista de inputs e valores para os comboboxes
    const listaInputs = [
        { selector: 'input[aria-label="Elevador"]', valor: '1 - Não' },
        { selector: 'input[aria-label="Status"]', valor: 'Finalizado' }
        // Adicione mais objetos conforme necessário
    ];


    // Enum para tipos de cadastro
    const TipoCadastro = {
        NOVO_CADASTRO: 'NOVO CADASTRO',
        REVISAO: 'REVISÃO'
    };

function preencherCampos() {
    if (tipoCadastro === TipoCadastro.NOVO_CADASTRO) {
		listaInputs.forEach(({ selector, valor }) => {
            esperarCarregamentoCombobox(selector, valor, abrirCombobox);
        });
        preencherCadastrador();
        preencherDataCadastro();
    } else if (tipoCadastro === TipoCadastro.REVISAO) {
        preencherObservacao();
        preencherOperadorCQ();
        preencherRevisao();
        preencherDataModificacao();
    } else {
        console.log("Tipo de cadastro inválido ou não definido:", tipoCadastro);
    }

    	//preencherObservacao();
		//preencherCadastrador();
		//preencherOperadorCQ();
		//preencherDataCadastro();
        //preencherRevisao();
        //preencherDataModificacao();

}

    // Função para preencher o campo "Observação"
    function preencherObservacao() {
        var campoObservacao = document.querySelector('textarea[aria-label="Observação"]');
        if (campoObservacao) {
            if (campoObservacao.value.trim() === "") {
                campoObservacao.value = dadosObservacao;
                dispararEventos(campoObservacao);
                console.log("Campo 'Observação' preenchido com sucesso!");
            } else {
                console.log("Campo 'Observação' já possui valor, não será preenchido automaticamente.");
            }
        } else {
            console.log("Campo 'Observação' não encontrado!");
        }
    }

    // Função para preencher o campo "Cadastrador"
    function preencherCadastrador() {
        var campoCadastrador = document.querySelector('input[aria-label="Cadastrador"]');
        if (campoCadastrador) {
            campoCadastrador.value = nomeCadastrador;
            dispararEventos(campoCadastrador);
            console.log("Campo 'Cadastrador' preenchido com sucesso!");
        } else {
            console.log("Campo 'Cadastrador' não encontrado!");
        }
    }

    // Função para preencher o campo "Operador CQ"
    function preencherOperadorCQ() {
        var campoOperadorCQ = document.querySelector('input[aria-label="Operador CQ"]');
        if (campoOperadorCQ) {
            campoOperadorCQ.value = dadosOperadorCQ;
            dispararEventos(campoOperadorCQ);
            console.log("Campo 'Operador CQ' preenchido com sucesso!");
        } else {
            console.log("Campo 'Operador CQ' não encontrado!");
        }
    }

    // Função para preencher o campo de "Data de Cadastro"
    function preencherDataCadastro() {
        var campoData = document.querySelector('input[aria-label="Data de Cadastro"]');
        if (campoData) {
            var dataAtual = new Date();
            var dataFormatada = formatarData(dataAtual);
            campoData.value = dataFormatada;
            dispararEventos(campoData);
            console.log("Campo 'Data de Cadastro' preenchido com sucesso!");
        } else {
            console.log("Campo 'Data de Cadastro' não encontrado!");
        }
    }

    // Função para preencher o campo "Revisão"
    function preencherRevisao() {
        var campoRevisao = document.querySelector('input[aria-label="Revisão"]');
        if (campoRevisao) {
            campoRevisao.value = nomeCadastrador;
            dispararEventos(campoRevisao);
            console.log("Campo 'Revisão' preenchido com sucesso!");
        } else {
            console.log("Campo 'Revisão' não encontrado!");
        }
    }


/*=============================
	FUNÇÃO COMBOBOX
=============================*/


    // Função que aguarda o combobox estar disponível para interação
    function esperarCarregamentoCombobox(selector, valor, callback) {
        const maxTentativas = 10; // Número máximo de tentativas
        let tentativas = 0; // Contador de tentativas

        const intervalo = setInterval(() => {
            const comboboxInput = document.querySelector(selector); // Seleciona o campo do combobox baseado no seletor
            if (comboboxInput && !comboboxInput.disabled) { // Verifica se o combobox está habilitado
                clearInterval(intervalo); // Interrompe o intervalo se o combobox estiver disponível
                console.log(`Combobox '${selector}' carregado e habilitado.`); // Log para confirmar que o combobox está pronto
                callback(comboboxInput, valor); // Chama a função para abrir o combobox
            } else {
                tentativas++; // Incrementa o contador de tentativas
                if (tentativas >= maxTentativas) { // Verifica se o número máximo de tentativas foi atingido
                    clearInterval(intervalo); // Interrompe o intervalo
                    console.log(`Número máximo de tentativas (${maxTentativas}) atingido para o combobox '${selector}'.`); // Log de erro
                } else {
                    console.log(`Aguardando o carregamento do combobox '${selector}'... (Tentativa ${tentativas})`); // Log enquanto espera o combobox ficar disponível
                }
            }
        }, 500); // Verifica a cada 500ms
    }

    // Função para abrir o combobox automaticamente
    function abrirCombobox(comboboxInput, valor) {
        require(["dojo/query", "dijit/registry"], function(query, registry) { // Carrega os módulos necessários do Dojo
            const widgetId = comboboxInput.id; // Recupera o ID do widget, se disponível
            const filteringSelect = widgetId && registry.byId(widgetId); // Obtém a instância do widget FilteringSelect

            if (filteringSelect) { // Verifica se o widget foi encontrado
                console.log(`Widget '${comboboxInput.getAttribute('aria-label')}' encontrado e identificado.`); // Log de confirmação
                filteringSelect.toggleDropDown(); // Abre o popup do combobox
                setTimeout(() => selecionarOpcao(filteringSelect, valor), 500); // Aguarda as opções carregarem e tenta selecionar a desejada
            } else {
                console.log(`Widget '${comboboxInput.getAttribute('aria-label')}' não encontrado!`); // Log de erro caso o widget não seja encontrado
            }
        });
    }

    // Função para verificar e selecionar a opção desejada no combobox
    function selecionarOpcao(filteringSelect, valor) {
        const listaOpcoes = document.querySelectorAll('.dijitPopup .dijitMenuItem'); // Seleciona todos os itens de menu no popup do combobox
        let opcaoEncontrada = false; // Flag para indicar se a opção foi encontrada

        listaOpcoes.forEach(function(opcao) { // Itera por cada opção no combobox
            if (opcao.innerText.trim() === valor) { // Compara o texto da opção com a opção desejada
                opcao.click(); // Seleciona a opção clicando nela
                opcaoEncontrada = true; // Define a flag como verdadeira, indicando que a opção foi encontrada
                console.log(`Opção '${valor}' encontrada e selecionada.`); // Log de sucesso
            }
        });

        if (!opcaoEncontrada) { // Caso a opção não seja encontrada
            console.log(`Opção '${valor}' não encontrada no combobox '${filteringSelect.get('aria-label')}'.`); // Log de erro
        }
    }


/*=============================
	FUNÇÕES AUXILIARES
=============================*/

    // Função para preencher o campo de "Data de Modificação"
    function preencherDataModificacao() {
        var campoDataModificacao = document.querySelector('input[aria-label="Data da Modificação"]');
        if (campoDataModificacao) {
            var dataAtual = new Date();
            var dataFormatada = formatarData(dataAtual);
            campoDataModificacao.value = dataFormatada;
            dispararEventos(campoDataModificacao);
            console.log("Campo 'Data da Modificação' preenchido com sucesso!");
        } else {
            console.log("Campo 'Data da Modificação' não encontrado!");
        }
    }

    // Função para formatar a data no formato dd/mm/aaaa
    function formatarData(data) {
        var dia = ("0" + data.getDate()).slice(-2);
        var mes = ("0" + (data.getMonth() + 1)).slice(-2);
        var ano = data.getFullYear();
        return dia + '/' + mes + '/' + ano;
    }

    // Função para disparar eventos de mudança, foco e input
    function dispararEventos(campo) {
        campo.focus();
        var eventoInput = new Event('input', { bubbles: true });
        campo.dispatchEvent(eventoInput);
        var eventoChange = new Event('change', { bubbles: true });
        campo.dispatchEvent(eventoChange);
        campo.blur();
    }

    // Função para adicionar o ouvinte do botão direito do mouse
    function adicionarOuvinteBotaoDireitoMouse() {
        document.addEventListener('mousedown', function(event) {
            if (event.button === 2) {
                console.log("Botão direito do mouse pressionado!");
                event.preventDefault();

                if (!nomeCadastrador) {
                    nomeCadastrador = prompt("Por favor, insira o seu nome:");
                    if (!nomeCadastrador) {
                        console.log("Nome não inserido. Preenchimento automático cancelado.");
                        return;
                    }
                }

                if (!tipoCadastro) {
                    exibirComboboxTipoCadastro();
                } else {
                    console.log("Acessou campos!");
                    preencherCampos();
                }
            }
        });
    }

// Função para exibir um combobox para o tipo de cadastro
function exibirComboboxTipoCadastro() {
    // Obtém a URL atual da página
    //var currentUrl = window.location.href;

	// Cria o container para o combobox
	var container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.top = '50%';
	container.style.left = '50%';
	container.style.transform = 'translate(-50%, -50%)';
	container.style.backgroundColor = 'white';
	container.style.border = '1px solid black';
	container.style.padding = '30px'; // Aumentado para mais espaço interno
	container.style.zIndex = '1000';
	container.style.width = '400px'; // Aumentado para 400px
	container.style.minHeight = '250px'; // Definido um tamanho mínimo de altura
	container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Sombra para melhor visibilidade
	
	// Configura o layout do container para flexbox
	container.style.display = 'flex';
	container.style.flexDirection = 'column';
	container.style.justifyContent = 'center';
	container.style.alignItems = 'stretch';
	container.style.gap = '15px'; // Espaçamento entre os elementos


    // Determina se o "BIC" deve ser exibido com base no endereço
    var bicLabel = '';
    if (currentUrl.includes('id=c52271fd9c1e4515a1f1dafd8ce5ad2a')) {
        bicLabel = `<p style="font-weight: bold; text-align: center; height: 40px; font-size: 14px;">ACESSANDO FASE 2 - BIC</p>`;
    }
	else if(currentUrl.includes('id=6cbe01fc405f4834a8997f7897d286e9'))	{
		bicLabel = `<p style="font-weight: bold; text-align: center; height: 40px; font-size: 14px;">ACESSANDO FASE 1</p>`;
	}

    // Define o conteúdo HTML do container, com "BIC" acima da label
    container.innerHTML = `
        ${bicLabel}
        <label for="tipoCadastroSelect" style="height: 20px; font-size: 14px;">Escolha o tipo de cadastro:</label>
        <select id="tipoCadastroSelect" style="height: 40px; font-size: 14px;">
            <option value="${TipoCadastro.NOVO_CADASTRO}">Novo Cadastro</option>
            <option value="${TipoCadastro.REVISAO}">Revisão</option>
        </select>
		<button id="confirmarTipoCadastro" style="height: 40px; padding: 10px; font-size: 14px;">Confirmar</button>
    `;

    // Adiciona o container ao corpo da página
    document.body.appendChild(container);

    // Define o comportamento do botão de confirmação
    document.getElementById('confirmarTipoCadastro').addEventListener('click', function() {
        tipoCadastro = document.getElementById('tipoCadastroSelect').value;
        container.remove();
        console.log("Tipo de cadastro escolhido:", tipoCadastro);
        preencherCampos();
    });
}

    // Garantir que o script será executado após o carregamento completo da página
    window.addEventListener('load', function() {
        adicionarOuvinteBotaoDireitoMouse();
    });

})();
