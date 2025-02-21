(function () {
    'use strict';

    console.log("O script já foi carregado anteriormente. 001");

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
     * Função para formatar o número com 3 casas decimais
     * Exemplo:
     *  - "74445556.66" -> "74.445.556,660"
     *  - "7444555666" -> "7.444.555,666"
     *  - "593.964-99" -> "593.964,990"
     */
    function formatarNumero(valor) {
        // Remove todos os pontos da parte inteira
        valor = valor.replace(/\./g, '');

        // Encontra a última pontuação (vírgula ou ponto)
        const ultimaPontuacao = Math.max(valor.lastIndexOf(','), valor.lastIndexOf('.'));

        let parteInteira, parteDecimal;

        if (ultimaPontuacao === -1) {
            // Se não houver pontuação, os últimos 3 dígitos são a parte decimal
            parteInteira = valor.slice(0, -3); // Parte inteira (tudo, exceto os últimos 3 dígitos)
            parteDecimal = valor.slice(-3); // Parte decimal (últimos 3 dígitos)
        } else {
            // Se houver pontuação, divide em parte inteira e decimal
            parteInteira = valor.slice(0, ultimaPontuacao); // Parte inteira
            parteDecimal = valor.slice(ultimaPontuacao + 1); // Parte decimal
        }

        // Formata a parte inteira com pontos a cada 3 dígitos
        parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Garante que a parte decimal tenha exatamente 3 dígitos
        if (parteDecimal.length > 3) {
            parteDecimal = parteDecimal.slice(0, 3); // Corta para 3 dígitos
        } else if (parteDecimal.length < 3) {
            parteDecimal = parteDecimal.padEnd(3, '0'); // Completa com zeros
        }

        // Retorna o valor formatado
        return `${parteInteira},${parteDecimal}`;
    }

})();
