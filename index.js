(function () {
    'use strict';

    var versao = "2.01.01"; // AJUSTANDO "ALT + C"

    let nomeCadastrador = null;
    let tipoCadastro = null;

    // Função para carregar um script de forma assíncrona
    const scriptsCarregados = {}; // Objeto para rastrear scripts já carregados



    /*===================================================================
    FUNÇÃO PARA CARREGAR DEPENCÊNCIAS
    ===================================================================*/
    //#region 

    /*
        Carrega em memória todo o conteúdo do script, sendo possível o acesso em outros arquivos sem a necessidade 
        de carregar novamente.
    */
    // Função para carregar um script dinamicamente
    function carregarScript(url) {
        return new Promise((resolve, reject) => {
            if (scriptsCarregados[url]) {
                console.log(`Recarregando script: ${url}`);
                removerScript(url); // Remove o script para forçar recarregamento
            }

            const script = document.createElement('script');
            script.src = url + `?t=${Date.now()}`; // Cache busting com timestamp
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

    // Remove um script carregado do DOM, não deixando cache
    function removerScript(url) {
        const scripts = document.querySelectorAll(`script[src^="${url}"]`);
        scripts.forEach((script) => script.remove()); // Remove o elemento script do DOM
    }

    // Limpa as dependências para forçar recarregamento
    async function limparDependencias() {
        nomeCadastrador = null;
        tipoCadastro = null;

        for (const url in scriptsCarregados) {
            removerScript(url); // Remove o script do DOM
            delete scriptsCarregados[url]; // Limpa o estado de carregamento
        }
        console.log("Dependências limpas. Prontas para recarregar.");
    }


    // Função para carregar dependências
    async function carregarDependencias() {
        const scripts = [
            'http://localhost:8080/functions/login.js',
            'http://localhost:8080/functions/preencherCampos.js'
        ];

        try {
            const carregamentos = scripts.map((url) => carregarScript(url));
            await Promise.all(carregamentos);
            console.log("Todas as dependências foram carregadas.");
            return true;
        } catch (error) {
            console.error("Erro ao carregar dependências:", error);
            return false;
        }
    }

    // #endregion


    /*===================================================================
    FUNÇÃO PARA CARREGAR TELA DE LOGIN
    ===================================================================*/
    // #region
    async function verificarLogin() {

        console.warn("----------- NOME: " + nomeCadastrador);
        console.warn("----------- TIPO: " + tipoCadastro);

        // Caso não encontre o cadastrador e o tipo de cadastro, abre janela para cadastrar
        try {
            if (!nomeCadastrador || !tipoCadastro) {

                // Aguarda o popup e captura os valores retornados
                const { nome, tipoCadastro: cadastro } = await frmLogin(versao);
                nomeCadastrador = nome;
                tipoCadastro = cadastro;

                console.log("Valores definidos:");
                console.log("Nome Cadastrador:", nomeCadastrador);
                console.log("Tipo Cadastro:", tipoCadastro);

                return true; // Retorna verdadeiro se os valores foram definidos                
            }
            else {

                console.log("Valores já definidos:");
                console.log("Nome Cadastrador:", nomeCadastrador);
                console.log("Tipo Cadastro:", tipoCadastro);

                return true; // Retorna falso se os valores já estavam definidos

            }
        } catch (error) {
            console.error("Erro ou ação cancelada:", error);
            return false;
        }
    }
    // #endregion

    /*===================================================================
    FUNÇÃO PARA INICIALIZAR OU REINICIALIZAR O SCRIPT SEM A NECESSIDADE DE ATUALIZAR O BROWSER OU LIMPAR CACHE
    ===================================================================*/
    // Função principal para inicializar/reinicializar a lógica 
    async function inicializar() {

        await limparDependencias();     // Limpa as dependências        
        await carregarDependencias();   // Carrega dependências necessárias
        await verificarLogin();         // Abre tela de login

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

        document.addEventListener('keydown', async function (event) {

            console.log(`Tecla pressionada: ${event.key}, AltKey: ${event.altKey}`);

            // Verifica se Alt + C foi pressionado para preenchimento de campos
            if (event.altKey && event.key.toLowerCase() === 'c') {

                event.preventDefault(); // Impede comportamentos padrão do browser, se necessário                  

                //Verifica se o formulário a ser preenchido está ativo em tela
                if (nomeCadastrador && tipoCadastro) {

                    let formularioAtivo = await verificarFormularioAtivo(); //Verifica se o formulário está ativo em tela para cadastrar os campos
                    if (formularioAtivo) {
                        //Aqui não carrega, apenas executa o que já está em memória
                        preencherCampo(nomeCadastrador, tipoCadastro);
                    } else {
                        alert("Formulário não encontrado no Editor Inteligente!");
                    }
                } else {
                    console.log("Formulário de login não preenchido! Pressione [Alt + i] para abrir o formulário.");
                }
            }
            else if (event.altKey && event.key.toLowerCase() === 'i') {
                console.log("Reiniciar dependências...");

                inicializar()
                    .then(() => console.log("Dependências recarregadas com sucesso."))
                    .catch((error) => console.error("Erro ao recarregar dependências:", error));
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

        document.addEventListener('mousedown', async function (event) {

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
            if (event.button === 2 && navigator.userAgent.includes('Mac')) { //     'Win'   'Linux'    'X11'

                // Verifica se os dados já foram cadastrados
                const resultado = await verificarLogin();

                if (resultado) {
                    //Aqui não carrega, apenas executa o que já está em memória
                    preencherCampo(nomeCadastrador, tipoCadastro);
                } else {
                    console.log("Formulário de login não preenchido!");
                }
            }

        });

    }

    //#endregion



    /*=============================
        OUVINTES
    =============================*/

    // Garantir que o script será executado após o carregamento completo da página
    window.addEventListener('load', function () {
        configurarAtalhosTeclado();
        adicionarOuvinteBotaoMouse();
    });


})();
