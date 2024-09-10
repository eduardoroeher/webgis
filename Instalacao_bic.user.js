// ==UserScript==
// @name         BIC Preenchimento Automático
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Carrega e executa um script de preenchimento automático
// @match        https://webgis.engefoto.com.br/portal/apps/webappviewer/index.html?id=c52271fd9c1e4515a1f1dafd8ce5ad2a
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // URL do script
    var scriptUrl = 'https://eduardoroeher.github.io/webgis/cadastro_webgis.js';

    // Cria um elemento script e define seu src para o URL do script no GitHub
    var script = document.createElement('script');
    script.src = scriptUrl;
    document.head.appendChild(script);

    // Exibe uma mensagem no console para indicar que o script foi carregado
    console.log("Script de preenchimento automático carregado do GitHub:", scriptUrl);
})();

//https://eduardoroeher.github.io/webgis/Instalacao.js
