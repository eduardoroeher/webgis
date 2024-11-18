(function () {
    'use strict';

    let nomeCadastrador = null;
    let tipoCadastro = null;

    // Função para carregar um script de forma assíncrona
    const scriptsCarregados = {}; // Objeto para rastrear scripts já carregados

    function carregarScript(url) {
        return new Promise((resolve, reject) => {
            // Verifica se o script já foi carregado
            if (scriptsCarregados[url]) {
                console.log(`Script já carregado: ${url}`);
                resolve(); // Resolve imediatamente se já foi carregado
                return;
            }
    
            // Cria o elemento script e configura para carregamento
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                scriptsCarregados[url] = true; // Marca o script como carregado
                console.log(`Script carregado: ${url}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Erro ao carregar o script: ${url}`);
                reject(new Error(`Erro ao carregar o script: ${url}`));
            };
            document.head.appendChild(script);
        });
    }

    /*===================================================================
	FUNÇÃO PARA CARREGAR DEPENCÊNCIAS
	===================================================================*/
    /*
        Carrega em memória todo o conteúdo do script, sendo possível o acesso em outros arquivos sem a necessidade 
        de carregar novamente.
    */
    function carregarDependencias() {
        const scripts = [
            'http://localhost:8080/functions/popupSelecionarFase.js',
            'http://localhost:8080/functions/preencherCampos.js'
        ];
      
        // Promises para carregar apenas scripts ainda não carregados
        const carregamentos = scripts.map((url) => carregarScript(url));
      
        // Retorna uma Promise que é resolvida quando todas as dependências forem carregadas
        return Promise.all(carregamentos).then(() => {
            console.log("Todas as dependências foram carregadas.");
        });
    }
    

    // Função principal para inicializar a lógica
    async function inicializar() {
        // Carrega dependências necessárias
        await carregarDependencias();

        try {
            // Aguarda o popup e captura os valores retornados
            const { nome, tipoCadastro: cadastro } = await exibirPopupCadastro();
            nomeCadastrador = nome;
            tipoCadastro = cadastro;

            console.log("Valores definidos:");
            console.log("Nome Cadastrador:", nomeCadastrador);
            console.log("Tipo Cadastro:", tipoCadastro);
        } catch (error) {
            console.error("Erro ou ação cancelada:", error);
        }
    }

    // Inicia o carregamento e inicialização
    (async function () {       
            await inicializar();
    })();




	/*=============================
	FUNÇÃO PARA LER OS COMANDOS DO TECLADO
	=============================*/
	// #region

	function configurarAtalhosTeclado() {

		document.addEventListener('keydown', async function(event) {

		    // Verifica se Alt + C foi pressionado para preenchimento de campos
			if (event.altKey && event.key.toLowerCase() === 'c') {
				event.preventDefault(); // Impede comportamentos padrão do browser, se necessário
				console.log("Atalho Alt + C pressionado!");

                //Aqui não carrega, apenas executa o que já está em memória
				preencherCampos(nomeCadastrador, tipoCadastro);
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

		document.addEventListener('mousedown', async function(event) {

			//console.warn("EVENT " + event.target.tagName);		

				if (event.button === 1 && event.ctrlKey && tipoCadastro === TipoCadastro.REVISAR_CHAVES) { // Botão do meio com Ctrl
					console.log("Botão do meio do mouse pressionado com Ctrl!");

					numeroDePorta = "Apenas para automatico"; // Resseta o número da porta. Deve ser utilizado apenas no modo automático.

					event.preventDefault();
					obterChave();
				}
				// Modo automático para carregar informações na tela clicando apenas no ponto.
				else if (event.target.tagName === 'circle' && event.button === 0 && tipoCadastro === TipoCadastro.REVISAR_CHAVES) { // Clique esquerdo em um círculo
					const circle = event.target;

					console.log("Círculo clicado, aguardando carregamento do popup...");

					numeroDePorta = "------";

					pegarNumeroDePorta = true;
					monitorarPopup();
				}
				// Modo automático para carregar informações na tela clicando apenas no ponto.
				else if (event.target.tagName === 'path' && event.button === 0 && tipoCadastro === TipoCadastro.REVISAR_CHAVES) { // Clique esquerdo em um círculo

					console.log(`Clicado em ${event.target.tagName}.`);
					numeroDePorta = "------";
					pegarNumeroDePorta = true;

					monitorarPopup();
				}



			//-----------------------------------------------------------------------------------------------------------------------------
		
			if (event.button === 2) {

					if (!nomeCadastrador || !tipoCadastro) {
                        try {
                            // Aguarda o popup e captura os valores retornados
                            const { nome, tipoCadastro: cadastro } = await exibirPopupCadastro();
                            nomeCadastrador = nome;
                            tipoCadastro = cadastro;
                
                            console.log("Valores definidos:");
                            console.log("Nome Cadastrador:", nomeCadastrador);
                            console.log("Tipo Cadastro:", tipoCadastro);
                        } catch (error) {
                            console.error("Erro ou ação cancelada:", error);
                        }finally {
                            return;
                        }
					}
                   
                //Aqui não carrega, apenas executa o que já está em memória
				preencherCampos(nomeCadastrador, tipoCadastro);                  
			}

		});
	}

	//#endregion





	/*=============================
		OUVINTES
	=============================*/

	// Garantir que o script será executado após o carregamento completo da página
	window.addEventListener('load', function() {
		configurarAtalhosTeclado();
        adicionarOuvinteBotaoMouse();
	});


})();
