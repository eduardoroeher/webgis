// ==UserScript==
// @name         Carregar Script de Preenchimento Automático
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Carrega e executa um script de preenchimento automático
// @match        https://webgis.engefoto.com.br/portal/apps/webappviewer/index.html?id=6cbe01fc405f4834a8997f7897d286e9
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