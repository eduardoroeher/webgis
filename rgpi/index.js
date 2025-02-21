// ==UserScript==
// @name         INDEX LOCAL
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Formata valores dos campos e clica no botão PDF automaticamente após formatação
// @match        http://162.214.154.193/engefoto/cadastros/editaImoveis*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("O script já foi carregado anteriormente.");

    // Atalho "Alt + C" para formatação manual e clique no botão PDF
    document.addEventListener("keydown", function (event) {
        if (event.altKey && event.key.toLowerCase() === "c") {
            formatarCampos(function() {
                // Após a formatação, simula o clique no botão "Gerar PDF"
                const botaoPDF = document.getElementById("gerarPDF");
                if (botaoPDF) {
                    botaoPDF.click(); // Clica no botão "Gerar PDF"
                    console.log("Botão 'Gerar PDF' clicado após formatação.");
                } else {
                    console.log("Botão 'Gerar PDF' não encontrado.");
                }
            });
        }
    });

    /**
     * Função para formatar os valores de vários campos
     */
    function formatarCampos(callback) {
        // Lista de IDs dos campos a serem formatados
        const idsCampos = [
            "Z01_COORD_INICIAL_X",
            "Z01_COORD1",
            "Z01_COORD2",
            "Z01_COORD_INICIAL_Y",
            "Z01_COORD_FINAL_X",
            "Z01_COORD_FINAL_Y"
        ];

        // Formatar cada campo
        idsCampos.forEach(function (id) {
            const inputCampo = document.getElementById(id);

            if (inputCampo) {
                let valorAtual = inputCampo.value.trim();

                // Se estiver vazio, definir como "N/A"
                if (valorAtual === "") {
                    inputCampo.value = "N/A";
                } 
                // Se não estiver "N/A", aplicar a formatação
                else if (valorAtual !== "N/A") {
                    inputCampo.value = formatarNumero(valorAtual);
                }

                // Simula interação com o campo para que o sistema reconheça a mudança
                inputCampo.focus();
                inputCampo.dispatchEvent(new Event("input", { bubbles: true }));
                inputCampo.dispatchEvent(new Event("change", { bubbles: true }));
                inputCampo.blur();

                console.log(`Valor atualizado para o campo ${id}: ${inputCampo.value}`);
            }
        });

        // Chama o callback após a formatação
        if (callback) callback();
    }

    /**
     * Função para formatar o número no padrão desejado
     * Exemplo:
     *  - "681865,638" -> "681.865,638"
     *  - "7487765,003" -> "7.487.765,003"
     */
    function formatarNumero(valor) {
        let partes = valor.replace(/[^\d,.-]/g, "").split(",");

        // Se houver ponto (ou hífen para coordenadas), remova e formate separadamente
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona ponto a cada 3 dígitos

        // Junta as partes de volta
        return partes.join(",");
    }

})();
