    // Enum para tipos de cadastro
    const TipoCadastro = {
        NOVO_CADASTRO: 'NOVO CADASTRO',
        REVISAO: 'REVISÃO',
		REVISAR_CHAVES: 'REVISAR CHAVES'
    };


    window.FormTipoCadastro = function(versionamento) {
    return new Promise((resolve) => {

        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid black';
        container.style.padding = '30px';
        container.style.zIndex = '1000';
        container.style.width = '400px';
        container.style.minHeight = '250px';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'stretch';
        container.style.gap = '15px';

        // Determina se o "BIC" deve ser exibido com base no endereço
        var bicLabel = '';
        if (window.location.href.includes('id=c52271fd9c1e4515a1f1dafd8ce5ad2a')) {
            bicLabel = `<p style="font-weight: bold; text-align: center; height: 40px; font-size: 14px;">ACESSANDO FASE 2 - BIC</p>`;
        } else if (window.location.href.includes('id=6cbe01fc405f4834a8997f7897d286e9')) {
            bicLabel = `<p style="font-weight: bold; text-align: center; height: 40px; font-size: 14px;">ACESSANDO FASE 1</p>`;
        }

        // Define o conteúdo HTML do container, com "BIC" acima da label
        container.innerHTML = `
            ${bicLabel}
            <label for="tipoCadastroSelect" style="height: 20px; font-size: 14px;">Escolha o tipo de cadastro:</label>
            <select id="tipoCadastroSelect" style="height: 40px; font-size: 14px;">
                <option value="${TipoCadastro.NOVO_CADASTRO}">Novo Cadastro</option>
                <option value="${TipoCadastro.REVISAO}">Revisão</option>
                <option value="${TipoCadastro.REVISAR_CHAVES}">Revisar Chaves</option>
            </select>
            <button id="confirmarTipoCadastro" style="height: 40px; padding: 10px; font-size: 14px;">Confirmar</button>
        `;

        document.body.appendChild(container);

        document.getElementById('confirmarTipoCadastro').addEventListener('click', function() {
            window.tipoCadastro = document.getElementById('tipoCadastroSelect').value;
            container.remove();
            console.log("Tipo de cadastro escolhido:", window.tipoCadastro);
            // Chamar aqui a função que depende do tipo de cadastro selecionado
        });
    });
};

