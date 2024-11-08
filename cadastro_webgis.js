// ==UserScript==
// @name         1.6 - Cadastro automático de campos
// @namespace    http://tampermonkey.net/
// @version      1.16.007A
// @description  Incluído o módulo BIC Cadastro
// @match        https://webgis.engefoto.com.br/portal/apps/webappviewer/index.html?id=6cbe01fc405f4834a8997f7897d286e9
// @match        https://webgis.engefoto.com.br/portal/apps/webappviewer/index.html?id=c52271fd9c1e4515a1f1dafd8ce5ad2a
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

	var versionamento = "1.16.007A";

    // Mensagem para verificar se o script está sendo carregado
    console.log("Script carregado! " + versionamento);

	var currentUrl = window.location.href;

    var dadosObservacao = "Número de porta:";
    var nomeCadastrador = null;
    var dadosOperadorCQ = "Revisar Observação OK";
    var tipoCadastro = null;

	var numeroDePorta = "------";
	var pegarNumeroDePorta = true;

	// Variável global para ativar ou desativar o modo automático
	let modoAutomaticoAtivo = false;

	let unicaNotificacao = false;

    // Lista de inputs e valores para os comboboxes
    const listaInputs = [
        { selector: 'input[aria-label="Elevador"]', valor: '1 - Não' },
        { selector: 'input[aria-label="Status"]', valor: 'Finalizado' }
        // Adicione mais objetos conforme necessário
    ];


	// Lista de inputs e valores para os comboboxes PARA ETAPA REVISAR CHAVES
    const listaComboboxStatus = [
        { selector: 'input[aria-label="Status"]', valor: 'CQ - Finalizado' } // CAMPO STATUS
        // Adicione mais objetos conforme necessário
    ];

	// #region BIC -------------------------------------------------------------------------------------

	// Lista de inputs e valores para os comboboxes ETAPA  BIC REVISAO
    const listaCombobox_BicRevisao = [
		{ selector: 'input[aria-label="Sitio de Recreio"]', valor: '1 - Não' },
		{ selector: 'input[aria-label="Tributação"]', valor: '0 - Normal' },
		{ selector: 'input[aria-label="Categoria Ocupação"]', valor: '4 - Particular' },
		{ selector: 'input[aria-label="Regime Ocupação"]', valor: '3 - Própria' },
		{ selector: 'input[aria-label="Serviços Urbano"]', valor: '21 - Telefone-Luz-Água' },
		{ selector: 'input[aria-label="Instalações"]', valor: '3 - Hidráulica e Elétrica' },
		{ selector: 'input[aria-label="Status"]', valor: 'CQ - Finalizado' }
        // Adicione mais objetos conforme necessário
    ];

	const listaCombobox_BicCadastro = [
		{ selector: 'input[aria-label="Sitio de Recreio"]', valor: '1 - Não' },
		{ selector: 'input[aria-label="Tributação"]', valor: '0 - Normal' },
		{ selector: 'input[aria-label="Categoria Ocupação"]', valor: '4 - Particular' },
		{ selector: 'input[aria-label="Regime Ocupação"]', valor: '3 - Própria' },
		{ selector: 'input[aria-label="Serviços Urbano"]', valor: '21 - Telefone-Luz-Água' },
		{ selector: 'input[aria-label="Instalações"]', valor: '3 - Hidráulica e Elétrica' },
		{ selector: 'input[aria-label="Status"]', valor: 'Finalizado' }
	];

	// #endregion


    // Enum para tipos de cadastro
    const TipoCadastro = {
        NOVO_CADASTRO: 'NOVO CADASTRO',
        REVISAO: 'REVISÃO',
		REVISAR_CHAVES: 'REVISAR CHAVES',
		BIC_CQ: 'BIC CQ',
		BIC_CADASTRO: 'BIC CADASTRO'
    };


	// Função de espera para adicionar um atraso
	function esperar(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function preencherCampos() {

		console.log("ACESSANDO:", tipoCadastro);

		if (tipoCadastro === TipoCadastro.NOVO_CADASTRO) {
			for (const { selector, valor } of listaInputs) {
				await esperarCarregamentoCombobox(selector, valor, abrirCombobox);
				await esperar(1000); // Aguardar 1 segundo entre preenchimentos
			}
			preencherCadastrador();
			await esperar(1000); // Aguardar 1 segundo entre preenchimentos
			preencherDataCadastro();
		}
		else if (tipoCadastro === TipoCadastro.REVISAO) {
			preencherObservacao();
			await esperar(1000);
			preencherOperadorCQ(dadosOperadorCQ);
			await esperar(1000);
			preencherRevisao(nomeCadastrador);
			await esperar(1000);
			preencherDataModificacao();
		}
		else if (tipoCadastro === TipoCadastro.REVISAR_CHAVES) {

			for (const { selector, valor } of listaComboboxStatus) {
				await esperarCarregamentoCombobox(selector, valor, abrirCombobox);
			}

			preencherRevisao(nomeCadastrador);
			await esperar(2000);
			preencherDataModificacao();
			await esperar(2000);

			for (const { selector, valor } of listaComboboxStatus) {
				await esperarCarregamentoCombobox(selector, valor, abrirCombobox);
			}
		}
		else if (tipoCadastro === TipoCadastro.BIC_CQ) {
			
			// Cadastra campo "Complemento", "nova informação", "substituir se o campo estiver preenchido"
			preencherCampoTextarea("Complemento", "", true);
			await esperar(500);

			//Cadastra campo "Status"
			for (const { selector, valor } of listaCombobox_BicRevisao){
				await esperarCarregamentoCombobox(selector, valor, abrirCombobox);
				await esperar(500);
			}

			// Cadastra campo "Operador CQ"
			preencherCampoTextarea("Operador CQ", nomeCadastrador, true);
			await esperar(500);

			// Cadastra campo "Data do CQ"
			preencherInputData("Data do CQ");
        }
		else if (tipoCadastro === TipoCadastro.BIC_CADASTRO) {
			
			//Cadastra campo "Status"
			for (const { selector, valor } of listaCombobox_BicCadastro){
				await esperarCarregamentoCombobox(selector, valor, abrirCombobox);				
			}
			await esperar(1000); // Aguardar 1 segundo entre preenchimentos
			preencherCadastrador();
			await esperar(1000); // Aguardar 1 segundo entre preenchimentos
			preencherDataCadastro();

		}
		else {
			console.log("Tipo de cadastro inválido ou não definido:", tipoCadastro);
		}

		//preencherObservacao();
		//preencherCadastrador();
		//preencherOperadorCQ();
		//preencherDataCadastro();
        //preencherRevisao();
        //preencherDataModificacao();
		//preencherInputData();

	}


	/*===================================================================
	FUNÇÃO PARA PREENCHIMENTO DE CAMPO DO FORMULÁRIO "Editor Inteligente"
	===================================================================*/
	// #region

	// substituirValor = true significa que qualquer valor existente no campo será substituido pelo novo valor
	function preencherCampoTextarea(nomeDoCampo, valor, subtituirValor) {

		// Verifica se subtituirValor é booleano; se não for, retorna sem executar
		if (typeof subtituirValor !== 'boolean') {
			console.warn("O parâmetro 'subtituirValor' deve ser true ou false.");
			return;
		}

		var campo = nomeDoCampo.trim();

		var campoTextarea = document.querySelector(`textarea[aria-label="${campo}"]`);
		if(campoTextarea) {

			//Se existir informação no campo, substitui caso subtituirValor = true
			if (campoTextarea.value.trim() !== "" && subtituirValor) {
				campoTextarea.value = valor.trim();
				dispararEventos(campoTextarea);
				console.log(`Campo ${campo} alterado com sucesso!`);
			}
			// Campo vazio, cadastra normalmente
			else if (campoTextarea.value.trim() === ""){
				campoTextarea.value = valor.trim();
				dispararEventos(campoTextarea);
				console.log(`Campo ${campo} preenchido com sucesso!`);
			}
			else {
                console.log(`Campo ${campo} já possui valor, não será preenchido automaticamente!`);
            }
		} else {
            console.log(`Campo ${campo} não encontrado!`);
        }
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

	    // Função para preencher o campo "Revisão"
    function preencherRevisao(valorCampoRevisao) {
        var campoRevisao = document.querySelector('textarea[aria-label="Revisão"]'); // Altera de 'input' para 'textarea'
        if (campoRevisao) {
			campoRevisao.value = valorCampoRevisao;
            dispararEventos(campoRevisao);
            console.log("Campo 'Revisão' preenchido com sucesso!");
        } else {
            console.log("Campo 'Revisão' não encontrado!");
        }
    }

	// Recebe o nome do campo html por parâmetro
	function preencherInputData(nomeDoCampo) {
		var campoData = document.querySelector(`input[aria-label="${nomeDoCampo}"]`);
		if (campoData) {
			var dataAtual = new Date();
			var dataFormatada = formatarData(dataAtual);
			campoData.value = dataFormatada;
			dispararEventos(campoData);
			console.log(`Campo ${nomeDoCampo} preenchido com sucesso!`);
		} else {
			console.log(`Campo ${nomeDoCampo} não encontrado!`);
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

	// #endregion


	/*=============================
		FUNÇÃO COMBOBOX
	=============================*/

	// #region

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
        }, 300); // Verifica a cada 300ms
    }

    // Função para abrir o combobox automaticamente
    function abrirCombobox(comboboxInput, valor) {
        require(["dojo/query", "dijit/registry"], function(query, registry) { // Carrega os módulos necessários do Dojo
            const widgetId = comboboxInput.id; // Recupera o ID do widget, se disponível
            const filteringSelect = widgetId && registry.byId(widgetId); // Obtém a instância do widget FilteringSelect

            if (filteringSelect) { // Verifica se o widget foi encontrado
                console.log(`Widget '${comboboxInput.getAttribute('aria-label')}' encontrado e identificado.`); // Log de confirmação
                filteringSelect.toggleDropDown(); // Abre o popup do combobox
                setTimeout(() => selecionarOpcao(filteringSelect, valor), 1000); // Aguarda as opções carregarem e tenta selecionar a desejada
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

	// #endregion


    /*=============================
        FUNÇÕES BUSCAR CHAVE
        Referência: https://www.youtube.com/watch?v=c_ZxPy5pWZ0
        Teste direto: https://sheetdb.io/api/v1/m6u2fudbdy893/search?chave=NÚMERO_A_SER_VERIFICADO
    =============================*/

	// #region

    // Variável global para manter a referência da notificação atual
    let notificacaoAtual = null;
	let corAtualEscura = true; // Variável para alternar entre as cores

	// Função para copiar texto para a área de transferência
	function copiarParaAreaDeTransferencia(texto) {
		navigator.clipboard.writeText(texto).then(() => {
			console.log("Texto copiado para a área de transferência com sucesso!");
		}).catch((err) => {
			console.error("Falha ao copiar texto: ", err);
		});
	}


	function exibirNotificacao(mensagem) {
		// Remove a notificação anterior, se houver
		if (notificacaoAtual) {
			document.body.removeChild(notificacaoAtual);
			notificacaoAtual = null;
		}

		// Cria a div para a notificação
		const notificacao = document.createElement("div");
		notificacao.style.position = "fixed";
		notificacao.style.top = "20px";
		notificacao.style.left = "65%";
		notificacao.style.transform = "translateX(-35%)";
		notificacao.style.color = "#fff";
		notificacao.style.fontSize = "16px";
		notificacao.style.lineHeight = "1.5";
		notificacao.style.padding = "20px";
		notificacao.style.borderRadius = "10px";
		notificacao.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
		notificacao.style.zIndex = "9999";
		notificacao.style.maxWidth = "80%";
		notificacao.style.textAlign = "left";
		notificacao.innerHTML = mensagem;

		// Alterna a cor de fundo entre escura e clara
		notificacao.style.backgroundColor = corAtualEscura ? "#333333" : "#404040"; // Cor mais clara para contraste
		corAtualEscura = !corAtualEscura; // Alterna o estado da cor para a próxima notificação

		// Adiciona o botão para fechar a notificação
		const botaoFechar = document.createElement("span");
		botaoFechar.style.position = "absolute";
		botaoFechar.style.bottom = "10px";
		botaoFechar.style.right = "10px";
		botaoFechar.style.cursor = "pointer";
		botaoFechar.style.fontSize = "20px";
		botaoFechar.innerHTML = "&times;";
		botaoFechar.onclick = () => {
			document.body.removeChild(notificacao);
			notificacaoAtual = null;
		};

		notificacao.appendChild(botaoFechar);
		document.body.appendChild(notificacao);

		// Mantém a referência da notificação atual
		notificacaoAtual = notificacao;

		// Remove a notificação após 10 segundos
		setTimeout(() => {
			if (document.body.contains(notificacao)) {
				document.body.removeChild(notificacao);
				notificacaoAtual = null;
			}
		}, 100000); // 100 segundos
	}


    // Função para buscar a chave no Google Sheets via API
	// REFERÊNCIA - https://www.youtube.com/watch?v=bCw85WL5Iw8
	// LINK TESTE - https://script.google.com/macros/s/AKfycbyjeoUpc78NPSlqpgHyQGuZS3y8X5ezmJuDE7kyfrT3mrmw1sxlzYfuiD9EWCiZ1Kw/exec?chave=09303820087
    // Função para buscar todos os dados

    let todosOsDadosCache = []; // Array global para armazenar os dados

    // Função para buscar todos os dados na base de dados
    async function buscarTodosOsDados() {
        const url = 'https://script.google.com/macros/s/AKfycbyjeoUpc78NPSlqpgHyQGuZS3y8X5ezmJuDE7kyfrT3mrmw1sxlzYfuiD9EWCiZ1Kw/exec?chave';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const dados = await response.json();
            console.log("Dados retornados da API:", dados);

            // Armazena os dados no cache global
            todosOsDadosCache = dados.retornoDaSaida || []; // Retorna um array vazio se retornoDaSaida não estiver definido
            console.log("Dados armazenados no cache:", todosOsDadosCache); // Verifica o cache
        } catch (error) {
            console.error('Erro ao buscar todos os dados:', error);
        }
    }

	//Função para buscar as informações da chave na base de dados
    async function buscarChave(valorChave) {
        // Primeiro, certifique-se de que os dados estão carregados no cache
        if (todosOsDadosCache.length === 0) {
            console.warn("Cache vazio, carregando todos os dados.");

			// Exibe notificação para o usuário aguardar o carregamento
			exibirNotificacao("Por favor, aguarde. Carregando dados...");

            await buscarTodosOsDados(); // Carrega os dados se ainda não estiverem carregados
        }

        const chaveFormatada = valorChave.trim(); // Formata a chave de busca
        console.log("Buscando chave:", chaveFormatada); // Log da chave que está sendo buscada

        // Procura a chave no cache
        const info = todosOsDadosCache.find(dado => dado.Chave && dado.Chave.trim() === chaveFormatada);

        if (info) {
            console.log("Dados encontrados:", info);

            // Exibe a notificação com os dados encontrados
            exibirNotificacao(`
			<strong>Numero de Porta:</strong> ${numeroDePorta}<br>
            <strong>Chave:</strong> ${info.Chave}<br>
            <strong>PREFEITURA:</strong> ${info['Prefeitura - Edificacao']}<br>
            <strong>CADASTRO Uso:</strong> ${info['Cadastro - Uso']}<br>
            <strong>CADASTRO Padrão:</strong> ${info['Cadastro - Padrao']}
			`);
        } else {
            console.warn("Nenhum dado encontrado para a chave:", valorChave);
            exibirNotificacao("Nenhum dado encontrado para a chave: " + valorChave);
        }
    }

    // Função para obter o valor da chave manualmente "Ctrl + botão direito do mouse"
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

	// #endregion


	/*=============================
		FUNÇÕES AUXILIARES
	=============================*/

	// #region

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

	// Função para exibir um combobox para o tipo de cadastro
	function exibirComboboxTipoCadastro() {
		return new Promise((resolve) => {
			// Obtém a URL atual da página
			const currentUrl = window.location.href;

			// Cria o container para o combobox
			var container = document.createElement('div');
			container.style.position = 'fixed';
			container.style.top = '50%';
			container.style.left = '50%';
			container.style.transform = 'translate(-50%, -50%)';
			container.style.backgroundColor = 'white';
			container.style.border = '1px solid black';
			container.style.padding = '30px';
			container.style.zIndex = '1000';
			container.style.width = '400px';
			container.style.minHeight = '250px';
			container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
			container.style.display = 'flex';
			container.style.flexDirection = 'column';
			container.style.justifyContent = 'center';
			container.style.alignItems = 'stretch';
			container.style.gap = '15px';

			// Determina se o "BIC" deve ser exibido com base no endereço
			var bicLabel = '';
			var idFase = -1;

			if (currentUrl.includes('id=c52271fd9c1e4515a1f1dafd8ce5ad2a')) {
				idFase = 1;
				bicLabel = `
					<p style="font-weight: bold; text-align: center; height: 40px; font-size: 14px;">ACESSANDO FASE 2 - BIC</p>
					<p style="text-align: center; font-size: 12px; color: #666;">
						Modo automático ativado! Pressione Alt + C para preencher os campos! Versão: ${versionamento}
					</p>`;
			} else if (currentUrl.includes('id=6cbe01fc405f4834a8997f7897d286e9')) {
				idFase = 2;
				bicLabel = `
					<p style="font-weight: bold; text-align: center; height: 40px; font-size: 14px;">ACESSANDO FASE 1</p>
					<p style="text-align: center; font-size: 12px; color: #666;">
						ATENÇÃO: REVISAR_CHAVES com nova funcionalidade
					</p>
					<p style="text-align: center; font-size: 12px; color: #666;">
						Para ativar ou desativar o modo automático, pressione Alt + a.
					</p>`;
			}

			// Define o conteúdo HTML do container
			if (idFase === 1) {
				container.innerHTML = `
					${bicLabel}
					<label for="tipoCadastroSelect" style="height: 20px; font-size: 14px;">Escolha o tipo de cadastro:</label>
					<select id="tipoCadastroSelect" style="height: 40px; font-size: 14px;">
						<option value="${TipoCadastro.BIC_CADASTRO}">BIC CADASTRO</option>
						<option value="${TipoCadastro.BIC_CQ}">BIC CQ</option>
					</select>
					<button id="confirmarTipoCadastro" style="height: 40px; padding: 10px; font-size: 14px;">Confirmar</button>`;
			} else if (idFase === 2) {
				container.innerHTML = `
					${bicLabel}
					<label for="tipoCadastroSelect" style="height: 20px; font-size: 14px;">Escolha o tipo de cadastro:</label>
					<select id="tipoCadastroSelect" style="height: 40px; font-size: 14px;">
						<option value="${TipoCadastro.NOVO_CADASTRO}">Novo Cadastro</option>
						<option value="${TipoCadastro.REVISAO}">Revisão</option>
						<option value="${TipoCadastro.REVISAR_CHAVES}">Revisar Chaves</option>
					</select>
					<button id="confirmarTipoCadastro" style="height: 40px; padding: 10px; font-size: 14px;">Confirmar</button>`;
			}

			// Adiciona o container ao corpo da página
			document.body.appendChild(container);

			// Define o comportamento do botão de confirmação
			document.getElementById('confirmarTipoCadastro').addEventListener('click', function () {
				const tipoCadastro = document.getElementById('tipoCadastroSelect').value;
				container.remove();
				resolve(tipoCadastro);  // Retorna o valor selecionado e resolve a Promise
			});
		});
	}

	// #endregion


//----------------------------------------------
	/*=============================
	FUNÇÃO MONITORA POPUP
	=============================*/

	// #region

	function monitorarPopup() {
		let tentativas = 0;
		const maxTentativas = 3;
		let chaveEncontrada = false;

		// Intervalo para verificar se o popup foi carregado
		const intervalId = setInterval(() => {
			const popup = document.querySelector('.esriPopupWrapper');

			// Verifica se o popup está presente
			if (!popup) {
				console.warn("Popup não encontrado.");
				return;
			}

			// Interrompe o intervalo após encontrar o popup
			clearInterval(intervalId);
			console.log("Popup encontrado. Iniciando monitoramento da tabela 'attrTable'...");

			// Função para verificar a tabela 'attrTable' com tentativas limitadas
			function verificarTabela() {
				// Evita verificar novamente se a chave já foi encontrada
				if (chaveEncontrada) return;

				const attrTable = popup.querySelector('.attrTable');


				if (attrTable) {
					console.log("Tabela 'attrTable' encontrada.");

					obterNumeroDePorta(attrTable);

					const chave = obterChaveDaTabela(attrTable);
					if (chave) {
						console.log(`Chave encontrada: ${chave}`);
						chaveEncontrada = true; // Marca a chave como encontrada para parar o processo

						buscarChave(chave);

						// Chama a função para clicar no botão "Feição anterior"
						clicarFeicaoAnterior();

					} else {
						console.log("Chave não encontrada na tabela.");
						tentarProximaFeicao();
					}
				}
                else{

					if(!unicaNotificacao){
						// Exibe a notificação com os dados encontrados
						exibirNotificacao(`
							TABELA NÃO ENCONTRADA. 
							<br>----------------------------
							<br>Fechar o LandView 
							<br>Clicar novamente no ponto 
							<br>Abrir o LandView	
							<br>----------------------------
							<br>Pode ser que a área de visão
							<br>do LandViwer(triângulo vermelho)
							<br>esteja, no momento, sobrepondo o
							<br>ponto de marcação.			
						`);
						unicaNotificacao = true;
					}
                }
                /*else {
					tentativas++;
					console.log(`Tentativa ${tentativas} para encontrar a tabela 'attrTable'.`);

					if (tentativas < maxTentativas) {
						setTimeout(verificarTabela, 1000); // Tenta novamente após 1 segundo
					} else {
						console.warn("Máximo de tentativas alcançado. Tentando a próxima feição...");
						tentarProximaFeicao();
					}
				}*/
			}

			// Inicia a verificação da tabela com tentativas limitadas
			verificarTabela();
		}, 500); // Intervalo de verificação de 500 ms

		// Função para obter a chave da tabela
		function obterChaveDaTabela(attrTable) {
			const chaveElement = Array.from(attrTable.querySelectorAll('tr')).find(row => {
				const nameCell = row.querySelector('.attrName');
				return nameCell && (nameCell.textContent.trim().toLowerCase() === 'chave');
			});

			return chaveElement ? chaveElement.querySelector('.attrValue').textContent.trim() : null;
		}

		// Função para obter o número de porta da tabela
		function obterNumeroDePorta(attrTable) {
			if (pegarNumeroDePorta) {
				const chaveElement = Array.from(attrTable.querySelectorAll('tr')).find(row => {
					const nameCell = row.querySelector('.attrName');
					return nameCell && nameCell.textContent.trim().toLowerCase() === 'número de porta';
				});

				numeroDePorta = chaveElement ? chaveElement.querySelector('.attrValue').textContent.trim() : null;

				pegarNumeroDePorta = false;

				console.warn("NUMERO DE PORTA: " + numeroDePorta);

				return numeroDePorta;
			}
		}

		// Função para tentar a próxima feição
		function tentarProximaFeicao() {
			// Para de tentar se a chave já foi encontrada
			if (chaveEncontrada) return;

			const proximaFeicaoBtn = document.querySelector('.titleButton.next');
			if (proximaFeicaoBtn) {
				proximaFeicaoBtn.click();
				console.log("Clicando no botão 'Próxima Feição'...");
				setTimeout(monitorarPopup, 1000); // Aguarda 1 segundo antes de monitorar novamente
			} else {
				console.warn("Botão 'Próxima Feição' não encontrado.");
			}
		}

		// Função para clicar no botão "Feição anterior"
		function clicarFeicaoAnterior() {
			const feicaoAnteriorBtn = document.querySelector('.titleButton.prev');
			if (feicaoAnteriorBtn) {
				feicaoAnteriorBtn.click();
				console.log("Clicando no botão 'Feição anterior'...");

				// Chama a função para acessar o Editor Inteligente
				setTimeout(acessarEditorInteligente, 1000);
			} else {
				console.warn("Botão 'Feição anterior' não encontrado.");
			}
		}

		// Função para clicar no botão "Editor Inteligente"
		function acessarEditorInteligente() {
			const menuButton = document.querySelector('.popup-menu-button');
			if (menuButton) {
				menuButton.click();
				console.log("Abrindo menu popup...");

				setTimeout(() => {
					const editorInteligenteOption = Array.from(document.querySelectorAll('.popup-menu-item')).find(item => {
						return item.querySelector('.label')?.textContent.trim() === "Editor Inteligente";
					});

					if (editorInteligenteOption) {
						editorInteligenteOption.click();
						console.log("Clicando na opção 'Editor Inteligente'...");
					} else {
						console.warn("Opção 'Editor Inteligente' não encontrada.");
					}
				}, 500); // Aguarda o menu abrir
			} else {
				console.warn("Botão de menu popup não encontrado.");
			}
		}
	}

	// #endregion


	/*=============================
		FUNÇÃO PARA ATIVAR OU DESATIVAR MODO AUTOMÁTICO
	=============================*/
	// #region

	function configurarAtalhosTeclado() {

		document.addEventListener('keydown', async function(event) {

			// Ativa ou desativa o modo automático
			if (event.altKey && event.key.toLowerCase() === 'a') {

				// Ativar modo automático
				if (!modoAutomaticoAtivo) {
					if (!nomeCadastrador) {
						nomeCadastrador = prompt("Versão: " + versionamento + "\nPor favor, insira o seu nome!");
						if (!nomeCadastrador) {
							console.log("Nome não inserido. Preenchimento automático cancelado.");
							return;
						}
					}

					if (!tipoCadastro) {
						tipoCadastro = await exibirComboboxTipoCadastro();// Espera a seleção do tipo de cadastro
					}
				} else if (modoAutomaticoAtivo) {
					nomeCadastrador = null;
					tipoCadastro = null;
				}

				modoAutomaticoAtivo = !modoAutomaticoAtivo;
				const status = modoAutomaticoAtivo ? 'ativado' : 'desativado';
				exibirNotificacao(`Modo automático ${status}!`);
			}

			if(modoAutomaticoAtivo){

				// Verifica se Alt + C foi pressionado para preenchimento de campos
				if (event.altKey && event.key.toLowerCase() === 'c') {
					event.preventDefault(); // Impede comportamentos padrão do browser, se necessário
					console.log("Atalho Alt + C pressionado!");

					preencherCampos();
				}

			}
		});
	}

	// #endregion

	/*=============================
		FUNÇÕES DO CLIQUE DO MOUSE
	=============================*/
	// #region

	// Função para adicionar o ouvinte do botão do mouse
	function adicionarOuvinteBotaoMouse() {

		document.addEventListener('mousedown', function(event) {

			//console.warn("EVENT " + event.target.tagName);

			if(modoAutomaticoAtivo){

				if (modoAutomaticoAtivo && event.button === 1 && event.ctrlKey && tipoCadastro === TipoCadastro.REVISAR_CHAVES) { // Botão do meio com Ctrl
					console.log("Botão do meio do mouse pressionado com Ctrl!");

					numeroDePorta = "Apenas para automatico"; // Resseta o número da porta. Deve ser utilizado apenas no modo automático.

					event.preventDefault();
					obterChave();
				}
				// Modo automático para carregar informações na tela clicando apenas no ponto.
				else if (modoAutomaticoAtivo && event.target.tagName === 'circle' && event.button === 0 && tipoCadastro === TipoCadastro.REVISAR_CHAVES) { // Clique esquerdo em um círculo
					const circle = event.target;

					console.log("Círculo clicado, aguardando carregamento do popup...");

					numeroDePorta = "------";

					pegarNumeroDePorta = true;
					monitorarPopup();
				}
				// Modo automático para carregar informações na tela clicando apenas no ponto.
				else if (modoAutomaticoAtivo && event.target.tagName === 'path' && event.button === 0 && tipoCadastro === TipoCadastro.REVISAR_CHAVES) { // Clique esquerdo em um círculo

					console.log(`Clicado em ${event.target.tagName}.`);
					numeroDePorta = "------";
					pegarNumeroDePorta = true;

					monitorarPopup();
				}
			}
		});
	}

	//#endregion


	/*=============================
		OUVINTES
	=============================*/

	// Garantir que o script será executado após o carregamento completo da página
	window.addEventListener('load', function() {
		adicionarOuvinteBotaoMouse();
		configurarAtalhosTeclado();
	});

	exibirNotificacao(`MODO AUTOMÁTICO DESATIVADO! <br>Presisone Alt + a para ativar ou desativar.  <br>v. ${versionamento}`);

})();



/* IMPLEMENTAÇÃO NO ARQUIVO XMLX

	Função para buscar a chave no Google Sheets via API implementada no arquivo xmlx
	REFERÊNCIA - https://www.youtube.com/watch?v=bCw85WL5Iw8
	LINK TESTE PARA BUSCAR UMA CHAVE ESPECÍFICA - https://script.google.com/macros/s/AKfycbyjeoUpc78NPSlqpgHyQGuZS3y8X5ezmJuDE7kyfrT3mrmw1sxlzYfuiD9EWCiZ1Kw/exec?chave=09303820087
	LINK TESTE PARA BUSCAR TODOS OS DADOS - https://script.google.com/macros/s/AKfycbyjeoUpc78NPSlqpgHyQGuZS3y8X5ezmJuDE7kyfrT3mrmw1sxlzYfuiD9EWCiZ1Kw/exec?chave
    Função para buscar todos os dados



	function doGet(my_request) {
	  var chave = my_request.parameter.chave;

	  if (chave != null) {
		chave = chave.trim(); // Aplica trim na chave recebida

		var doc = SpreadsheetApp.getActiveSpreadsheet(); // O arquivo
		var sheet = doc.getSheetByName('Folha1'); // Folha do arquivo
		var values = sheet.getDataRange().getValues(); // Os valores da planilha

		var saida = [];

		for (var i = 1; i < values.length; i++) {
		  var row = {};
		  var chavePlanilha = values[i][0].toString().trim(); // Aplica trim nas chaves da planilha também

		  row['Chave'] = chavePlanilha;
		  row['Prefeitura - Edificacao'] = values[i][1].toString().trim(); // Aplica trim para os outros valores
		  row['Cadastro - Uso'] = values[i][2].toString().trim();
		  row['Cadastro - Padrao'] = values[i][3].toString().trim();

		  saida.push(row);
		}

		// Realiza a busca da chave, aplicando o trim
		var retornoDaSaida = saida.filter(obj => obj.Chave.includes(chave));

		// Retorna o resultado filtrado
		return ContentService.createTextOutput(JSON.stringify({ retornoDaSaida })).setMimeType(ContentService.MimeType.JSON);
	  }

	  return ContentService.createTextOutput(JSON.stringify({ saida })).setMimeType(ContentService.MimeType.JSON);
	}



*/