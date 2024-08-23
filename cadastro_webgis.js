// ==UserScript==
// @name         Script de Preenchimento 
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Preenche automaticamente campos no WebGIS
// @match        https://webgis.engefoto.com.br/portal/apps/webappviewer/index.html?id=6cbe01fc405f4834a8997f7897d286e9
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Mensagem para verificar se o script está sendo carregado
    console.log("Script carregado! 0.4");

    var dadosObservacao = "Número de porta:";
    var nomeCadastrador = null;
    var dadosOperadorCQ = "Revisar Observação OK";
    var tipoCadastro = null;

    // Enum para tipos de cadastro
    const TipoCadastro = {
        NOVO_CADASTRO: 'NOVO CADASTRO',
        REVISAO: 'REVISÃO'
    };

function preencherCampos() {
    if (tipoCadastro === TipoCadastro.NOVO_CADASTRO) {
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
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid black';
        //container.style.padding = '10px';
        //container.style.zIndex = '1000';
		container.style.padding = '20px'; // Aumentado para mais espaço interno
		container.style.zIndex = '1000';
		container.style.width = '300px'; // Definido um tamanho fixo para o container
		container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Adicionado uma sombra para melhor visibilidade

        container.innerHTML = `
        <label for="tipoCadastroSelect">Escolha o tipo de cadastro:</label>
        <select id="tipoCadastroSelect">
            <option value="${TipoCadastro.NOVO_CADASTRO}">Novo Cadastro</option>
            <option value="${TipoCadastro.REVISAO}">Revisão</option>
        </select>
        <button id="confirmarTipoCadastro">Confirmar</button>
    `;

        document.body.appendChild(container);

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
