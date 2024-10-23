// ==UserScript==
// @name         Script de Preenchimento
// @namespace    http://tampermonkey.net/
// @version      1.09
// @description  Preenche automaticamente campos no WebGIS - implementação combobox
// @match        https://webgis.engefoto.com.br/portal/apps/webappviewer/index.html?id=6cbe01fc405f4834a8997f7897d286e9
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Mensagem para verificar se o script está sendo carregado
    console.log("Script carregado! 1.09");

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


	    // Lista de inputs e valores para os comboboxes PARA ETAPA REVISAR CHAVES
    const listaInputsRevisarChaves = [
        { selector: 'input[aria-label="Status"]', valor: 'CQ - Finalizado' } // CAMPO STATUS
        // Adicione mais objetos conforme necessário
    ];



    // Enum para tipos de cadastro
    const TipoCadastro = {
        NOVO_CADASTRO: 'NOVO CADASTRO',
        REVISAO: 'REVISÃO',
		REVISAR_CHAVES: 'REVISAR CHAVES'
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
        preencherOperadorCQ(dadosOperadorCQ);
        preencherRevisao(nomeCadastrador);
        preencherDataModificacao();
    } else if(tipoCadastro === TipoCadastro.REVISAR_CHAVES){
		// CAMPO STATUS
		listaInputsRevisarChaves.forEach(({ selector, valor }) => {
            esperarCarregamentoCombobox(selector, valor, abrirCombobox);
        });
		preencherRevisao(nomeCadastrador);
		//preencherOperadorCQ(nomeCadastrador);
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
        var campoCadastrador = document.querySelector('textarea[aria-label="Cadastrador"]'); // Altera de 'input' para 'textarea'
        if (campoCadastrador) {
            campoCadastrador.value = nomeCadastrador;
            dispararEventos(campoCadastrador);
            console.log("Campo 'Cadastrador' preenchido com sucesso!");
        } else {
            console.log("Campo 'Cadastrador' não encontrado!");
        }
    }

	// Função para preencher o campo "Operador CQ"
	function preencherOperadorCQ(valorOperadorCQ) {
		var campoOperadorCQ = document.querySelector('textarea[aria-label="Operador CQ"]'); // Altera de 'input' para 'textarea'
		if (campoOperadorCQ) {
			campoOperadorCQ.value = valorOperadorCQ;
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
    function preencherRevisao(valorCampoRevisao) {
        var campoRevisao = document.querySelector('textarea[aria-label="Revisão"]'); // Altera de 'input' para 'textarea'
        if (campoRevisao) {
            //campoRevisao.value = nomeCadastrador;
			campoRevisao.value = valorCampoRevisao;
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
				
				// Disparar eventos após selecionar a opção
				dispararEventos(filteringSelect.domNode); // Garante que o evento de alteração seja disparado corretamente
            }
        });

        if (!opcaoEncontrada) { // Caso a opção não seja encontrada
            console.log(`Opção '${valor}' não encontrada no combobox '${filteringSelect.get('aria-label')}'.`); // Log de erro
        }
    }






    /*=============================
        FUNÇÕES BUSCAR CHAVE
        Referência: https://www.youtube.com/watch?v=c_ZxPy5pWZ0
        Teste direto: https://sheetdb.io/api/v1/m6u2fudbdy893/search?chave=NÚMERO_A_SER_VERIFICADO
    =============================*/

    // Variável global para manter a referência da notificação atual
    let notificacaoAtual = null;

    // Função para copiar texto para a área de transferência
    function copiarParaAreaDeTransferencia(texto) {
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = texto;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    }

    // Função para criar uma notificação não intrusiva na página (centralizada na parte superior)
    function exibirNotificacao(mensagem) {
        // Verifica se já existe uma notificação aberta e a remove
        if (notificacaoAtual) {
            document.body.removeChild(notificacaoAtual);
            notificacaoAtual = null;
        }

        // Criar a div para notificação
        const notificacao = document.createElement("div");
        notificacao.style.position = "fixed";
        notificacao.style.top = "20px"; // Define a posição 20px abaixo do topo da tela
        notificacao.style.left = "65%"; // Define para 70% da largura
        notificacao.style.transform = "translateX(-35%)"; // Ajusta para centralização correta
        notificacao.style.backgroundColor = "#333";
        notificacao.style.color = "#fff";
        notificacao.style.fontSize = "16px"; // Tamanho maior da fonte
        notificacao.style.lineHeight = "1.5"; // Espaçamento entre linhas
        notificacao.style.padding = "20px";
        notificacao.style.borderRadius = "10px"; // Aumenta a borda arredondada para 10px
        notificacao.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        notificacao.style.zIndex = "9999";
        notificacao.style.maxWidth = "80%"; // Limita a largura da notificação para 80% da tela
        notificacao.style.textAlign = "left";
        notificacao.innerHTML = mensagem;

        // Adiciona um botão para fechar a notificação
        const botaoFechar = document.createElement("span");
        botaoFechar.style.position = "absolute";
        botaoFechar.style.bottom = "10px"; // Posiciona o botão 10px acima do rodapé
        botaoFechar.style.right = "10px"; // Posiciona o botão 10px à esquerda da borda direita
        botaoFechar.style.cursor = "pointer";
        botaoFechar.style.fontSize = "20px"; // Aumenta o tamanho da fonte do botão de fechar
        botaoFechar.innerHTML = "&times;";
        botaoFechar.onclick = () => {
            document.body.removeChild(notificacao);
            notificacaoAtual = null;
        };

        notificacao.appendChild(botaoFechar);
        document.body.appendChild(notificacao);

        // Mantém a referência da notificação atual
        notificacaoAtual = notificacao;

        // Remove a notificação após 10 segundos (se não for fechada antes)
        setTimeout(() => {
            if (document.body.contains(notificacao)) {
                document.body.removeChild(notificacao);
                notificacaoAtual = null;
            }
        }, 100000); // 10000 = 10 segundos
    }

    // Função para buscar a chave no Google Sheets via API
    async function buscarChave(valorChave) {
        // Modifica a URL para buscar apenas na coluna 'chave'
        const url = `https://sheetdb.io/api/v1/m6u2fudbdy893/search?chave=${encodeURIComponent(valorChave)}`;

        console.log("Buscando chave:", valorChave); // Log da chave que está sendo buscada

        try {
            const response = await fetch(url);
            const dados = await response.json();

            console.log("Dados retornados da API:", dados); // Log dos dados retornados

            if (dados.length > 0) {
                // Exibe os dados correspondentes da chave
                const info = dados[0]; // Pega a primeira ocorrência
                console.log("Dados encontrados:", info);

                // Verifica se a coluna 'chave' está presente nos dados
                if (info.hasOwnProperty("chave")) {
                    console.log("Coluna 'chave' encontrada.");
                } else {
                    console.warn("Coluna 'chave' não encontrada nos dados.");
                }

                // Exibe a notificação com os dados encontrados
                exibirNotificacao(`
                    <strong>Chave:</strong> ${info.chave}<br>
                    <strong>PREFEITURA:</strong> ${info.TIPO_EDIFICAÇÃO_prefeitura}<br>
                    <strong>CADASTRO Uso:</strong> ${info["TIPO USO_cadastrado"]}<br>
                    <strong>CADASTRO Padrão:</strong> ${info.PADRAO_cadastrado}
                `);
            } else {
                console.warn("Nenhum dado encontrado para a chave:", valorChave);
                exibirNotificacao("Nenhum dado encontrado para a chave: " + valorChave);
            }
        } catch (error) {
            console.error('Erro ao buscar a chave:', error);
            exibirNotificacao("Erro ao buscar a chave: " + error.message);
        }
    }

    // Função para obter o valor da chave
    function obterChave() {
        // Seleciona a div com o valor da chave
        const chaveElemento = document.querySelector('.esriPopupWrapper .attrTable tr:nth-child(2) .attrValue');

        if (chaveElemento && chaveElemento.textContent.trim()) {
            const valorChave = chaveElemento.textContent.trim();
            console.log("Valor da chave encontrado:", valorChave);

            // Copia o valor para a área de transferência
            copiarParaAreaDeTransferencia(valorChave);

            // Chama a função para buscar a chave no Google Sheets
            buscarChave(valorChave);
        } else {
            console.error("Elemento da chave não encontrado.");
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
		campo.focus(); // Coloca o campo em foco
		var eventoInput = new Event('input', { bubbles: true });
		campo.dispatchEvent(eventoInput); // Dispara o evento de input
		var eventoChange = new Event('change', { bubbles: true });
		campo.dispatchEvent(eventoChange); // Dispara o evento de mudança
		campo.blur(); // Remove o foco do campo
    }

    // Função para adicionar o ouvinte do botão direito do mouse
    function adicionarOuvinteBotaoDireitoMouse() {
        document.addEventListener('mousedown', function(event) {
            if (event.button === 2) {
                console.log("Botão 2 do mouse pressionado!");
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

			//Buscar chave para revisão
			if (event.button === 1 && event.ctrlKey && tipoCadastro === TipoCadastro.REVISAR_CHAVES) {
                console.log("Botão 1 do mouse pressionado!");
                event.preventDefault();
                obterChave();
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
				<option value="${TipoCadastro.REVISAR_CHAVES}">Revisar Chaves</option>
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
