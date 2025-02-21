(function () {
    'use strict';

    console.log("O script já foi carregado anteriormente. - 5");

    document.addEventListener("keydown", function (event) {
        if (event.altKey && event.key.toLowerCase() === "c") {
            formatarCampos();
        }
    });

    function formatarCampos() {
        const idsCampos = [
            "Z01_COORD_INICIAL_X",
            "Z01_COORD1",
            "Z01_COORD2",
            "Z01_COORD_INICIAL_Y",
            "Z01_COORD_FINAL_X",
            "Z01_COORD_FINAL_Y"
        ];

        idsCampos.forEach(function (id) {
            const inputCampo = document.getElementById(id);

            if (inputCampo) {
                let valorAtual = inputCampo.value.trim();

                if (valorAtual === "") {
                    inputCampo.value = "N/A";
                } else if (valorAtual !== "N/A") {
                    inputCampo.value = formatarNumero(valorAtual);
                }

                inputCampo.focus();
                inputCampo.dispatchEvent(new Event("input", { bubbles: true }));
                inputCampo.dispatchEvent(new Event("change", { bubbles: true }));
                inputCampo.blur();

                console.log(`Valor atualizado para o campo ${id}: ${inputCampo.value}`);
            }
        });
    }

    function formatarNumero(valor) {
        valor = valor.replace(/\./g, '').replace(/,/g, '.');
        let numero = parseFloat(valor);

        if (isNaN(numero)) {
            return "N/A";
        }

        let parteInteira = Math.floor(numero).toString();
        let parteDecimal = numero.toFixed(3).split('.')[1];

        parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `${parteInteira},${parteDecimal}`;
    }

})();
