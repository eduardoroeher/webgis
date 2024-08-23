// ==UserScript==
// @name         SOLICITAR NOME Preenchimento Automático WebGIS 1.01
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Preenche automaticamente campos no WebGIS
// @match        https://webgis.engefoto.com.br/portal/apps/webappviewer/index.html?id=6cbe01fc405f4834a8997f7897d286e9
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Mensagem para verificar se o script está sendo carregado
    console.log("Script carregado! 0.4");

    var nomeCadastrador = null;

    // Função principal para preencher todos os campos
    function preencherCampos() {
        //preencherCadastrador();
        preencherObservacao();
        //preencherOperadorCQ();
        preencherRevisao();
        //preencherDataCadastro();
        preencherDataModificacao();
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

    // Função para preencher o campo "Observação"
    function preencherObservacao() {
        var campoObservacao = document.querySelector('textarea[aria-label="Observação"]');
        if (campoObservacao) {
            // Verifica se o campo já possui algum valor
            if (campoObservacao.value.trim() === "") {
                campoObservacao.value = "Número de porta:"; // Insira aqui o texto desejado para o campo de Observação
                dispararEventos(campoObservacao);
                console.log("Campo 'Observação' preenchido com sucesso!");
            } else {
                console.log("Campo 'Observação' já possui valor, não será preenchido automaticamente.");
            }
        } else {
            console.log("Campo 'Observação' não encontrado!");
        }
    }

    // Função para preencher o campo "Operador CQ
    function preencherOperadorCQ() {
        var campoOperadorCQ = document.querySelector('input[aria-label="Operador CQ"]');
        if (campoOperadorCQ) {
            campoOperadorCQ.value = "Revisar Observação OK";
            dispararEventos(campoOperadorCQ);
            console.log("Campo 'campoOperadorCQ' preenchido com sucesso!");
        } else {
            console.log("Campo 'campoOperadorCQ' não encontrado!");
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
    // Função para preencher o campo de "Data de Cadastro"
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
        var mes = ("0" + (data.getMonth() + 1)).slice(-2); // Meses começam do zero
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
            // Verifica se o botão direito foi clicado
            if (event.button === 2) {
                console.log("Botão direito do mouse pressionado!");
                event.preventDefault(); // Previne o menu de contexto padrão do botão direito
                /*-------------------------------------------------*/
                // Verifica se o nome do cadastrador já foi inserido
                if (!nomeCadastrador) {
                    nomeCadastrador = prompt("Por favor, insira o seu nome:");
                    if (!nomeCadastrador) {
                        console.log("Nome não inserido. Preenchimento automático cancelado.");
                        return;
                    }
                }
                /*-------------------------------------------------*/
                preencherCampos();
            }
        });
    }

    // Garantir que o script será executado após o carregamento completo da página
    window.addEventListener('load', function() {
        adicionarOuvinteBotaoDireitoMouse();
    });

})();
