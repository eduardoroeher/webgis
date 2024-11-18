
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

	// Função de espera para adicionar um atraso
	function esperar(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
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



    async function preencherCampos(nomeCadastrador, tipoCadastro) {
        var nomeCadastrador = nomeCadastrador;

        
        switch (tipoCadastro) {
            case TipoCadastro.NOVO_CADASTRO:
                for (const { selector, valor } of listaInputs) {
                    await esperarCarregamentoCombobox(selector, valor, abrirCombobox);
                    await esperar(1000); // Aguardar 1 segundo entre preenchimentos
                }
                preencherCadastrador();
                await esperar(1000); // Aguardar 1 segundo entre preenchimentos
                preencherDataCadastro();
                break;

            case TipoCadastro.REVISAO:
                preencherObservacao();
                await esperar(1000);
                preencherOperadorCQ(dadosOperadorCQ);
                await esperar(1000);
                preencherRevisao(nomeCadastrador);
                await esperar(1000);
                preencherDataModificacao();
                break;

            case TipoCadastro.REVISAR_CHAVES:
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
                break;

            case TipoCadastro.BIC_CQ:
                // Cadastra campo "Complemento", "nova informação", "substituir se o campo estiver preenchido"
                preencherCampoTextarea("Complemento", "", true);
                await esperar(500);

                // Cadastra campo "Status"
                for (const { selector, valor } of listaCombobox_BicRevisao){
                    await esperarCarregamentoCombobox(selector, valor, abrirCombobox);
                    await esperar(500);
                }

                // Cadastra campo "Operador CQ"
                preencherCampoTextarea("Operador CQ", nomeCadastrador, true);
                await esperar(500);

                // Cadastra campo "Data do CQ"
                preencherInputData("Data do CQ");
                break;

            case TipoCadastro.BIC_CADASTRO:
                // Cadastra campo "Status"
                for (const { selector, valor } of listaCombobox_BicCadastro){
                    await esperarCarregamentoCombobox(selector, valor, abrirCombobox);				
                }
                await esperar(1000); // Aguardar 1 segundo entre preenchimentos
                preencherCadastrador();
                await esperar(1000); // Aguardar 1 segundo entre preenchimentos
                preencherDataCadastro();
                break;

            default:
                console.log("Tipo de cadastro inválido ou não definido:", tipoCadastro);
        }

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


