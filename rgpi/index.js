(function () {
    'use strict';

    console.log("O script foi carregado - 1");

    // Atalho "Alt + C" para formatação manual e clique no botão PDF
    document.addEventListener("keydown", function (event) {
        if (event.altKey && event.key.toLowerCase() === "c") {
            formatarCampos(function() {
                // Após a formatação, simula o clique no botão "Gerar PDF"
                /*const botaoPDF = document.getElementById("gerarPDF");
                if (botaoPDF) {
                    botaoPDF.click(); // Clica no botão "Gerar PDF"
                    console.log("Botão 'Gerar PDF' clicado após formatação.");
                } else {
                    console.log("Botão 'Gerar PDF' não encontrado.");
                }*/
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
        // Remove todos os pontos existentes para evitar duplicação
        valor = valor.replace(/\./g, '');

        // Divide o valor em parte inteira e decimal
        let partes = valor.split(',');

        // Formata a parte inteira com pontos a cada 3 dígitos
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Junta as partes de volta
        return partes.join(',');
    }

})();
