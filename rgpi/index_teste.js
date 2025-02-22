(function () {
    'use strict';

    console.log("O script já foi carregado anteriormente. - V_02.09");

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
     *  - "7444555666" -> "7.444.555,666"
	 *  - "7444555-666" -> "7.444.555,666"
     *  - "593.964-99" -> "593.964,990"
     *  - "7.444.555-666" -> "7.444.555,666"
	 *  - "7444.555-666" -> "7.444.555,666"
     */
    function formatarNumero(valor) {
        // Verifica se o valor contém pontuação (vírgula, hífen ou ponto)
        const contemPontuacao = /[,-.]/.test(valor); // 7444555666 retorna false, pois não encontra nenhum destes caracteres.

        let parteInteira, parteDecimal;
		
        if (!contemPontuacao) {
            // Se não houver pontuação, os últimos 3 dígitos são a parte decimal
            parteInteira = valor.slice(0, -3); // Parte inteira (tudo, exceto os últimos 3 dígitos)
            parteDecimal = valor.slice(-3); // Parte decimal (últimos 3 dígitos)
			
			//console.log("inteira - sem pontuacao" + parteInteira);
			//console.log("decimal - sem pontuacao" + parteDecimal);			
        }
        else {
           // Se houver pontuação, substitui hífen por vírgula e vírgula por ponto
           valor = valor.replace(/-/g, ','); // Substitui hífen por vírgula
           valor = valor.replace(/,/g, '.'); // Substitui vírgula por ponto
            
            // Remove todos os pontos da parte inteira
            valor = valor.replace(/\./g, '');
            
            // Encontra a última pontuação (vírgula ou ponto)
            const ultimaPontuacao = Math.max(valor.lastIndexOf(','), valor.lastIndexOf('.'));

            // Divide em parte inteira e decimal
            parteInteira = valor.slice(0, ultimaPontuacao); // Parte inteira
            parteDecimal = valor.slice(ultimaPontuacao + 1); // Parte decimal

            console.log("INTEIRA " + parteInteira);
            console.log("DECIMAL " + parteDecimal);
        }
		

        // Formata a parte inteira com pontos a cada 3 dígitos
        parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		
        // Remove pontos da parte decimal (caso existam)
        parteDecimal = parteDecimal.replace(/\./g, '');

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
