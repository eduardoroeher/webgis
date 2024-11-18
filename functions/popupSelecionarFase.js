// Verifica se o script foi carregado
console.log("index.js carregado!");

// Define os possíveis tipos de cadastro
const TipoCadastro = {
    NOVO_CADASTRO: 'novo_cadastro',
    REVISAO: 'revisao',
    REVISAR_CHAVES: 'revisar_chaves',
    BIC_CADASTRO: 'bic_cadastro',
    BIC_CQ: 'bic_cq'
};

// Função para exibir o combobox para o tipo de cadastro e campo de nome
async function exibirPopupCadastro() {
    // Verifica se o popup já existe e o remove
    const popupExistente = document.getElementById('tipoCadastroPopup');
    if (popupExistente) {
        popupExistente.remove();
        console.warn("Popup existente removido.");
    }
        console.log("Tentando exibir o popup...");

        const currentUrl = window.location.href;

        // Verifica se o popup já está aberto
        if (document.getElementById('tipoCadastroPopup')) {
            console.warn("Popup já está aberto.");
            return;
        }

        // Cria o container para o popup
        const container = document.createElement('div');
        container.id = 'tipoCadastroPopup';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid black';
        container.style.padding = '30px';
        container.style.zIndex = '1000';
        container.style.width = '400px';
        container.style.minHeight = '300px';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

        let popupContent = `

        `;

        if (currentUrl.includes('id=c52271fd9c1e4515a1f1dafd8ce5ad2a')) {
            popupContent += `
                <p style="font-weight: bold; text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 14px;">ACESSANDO BIC</p>
               

                <label for="nomeUsuario" style="display: block; margin-bottom: 10px;">Digite seu nome:</label>
                <input id="nomeUsuario" type="text" style="width: 100%; padding: 10px; margin-bottom: 20px;" placeholder="Seu nome">

                <label for="tipoCadastroSelect" style="display: block; margin-bottom: 10px;">Escolha o tipo de cadastro:</label>
                <select id="tipoCadastroSelect" style="width: 100%; padding: 10px; margin-bottom: 20px;">
                    <option value="${TipoCadastro.BIC_CADASTRO}">BIC CADASTRO</option>
                    <option value="${TipoCadastro.BIC_CQ}">BIC CQ</option>
                </select>
            `;
        } else if (currentUrl.includes('id=6cbe01fc405f4834a8997f7897d286e9')) {
            popupContent += `
                <p style="font-weight: bold; text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 14px;">ACESSANDO CADASTROS</p>

                <label for="nomeUsuario" style="display: block; margin-bottom: 10px;">Digite seu nome:</label>
                <input id="nomeUsuario" type="text" style="width: 100%; padding: 10px; margin-bottom: 20px;" placeholder="Seu nome">

                <label for="tipoCadastroSelect" style="display: block; margin-bottom: 10px;">Escolha o tipo de cadastro:</label>
                <select id="tipoCadastroSelect" style="width: 100%; padding: 10px; margin-bottom: 20px;">
                    <option value="${TipoCadastro.NOVO_CADASTRO}">Novo Cadastro</option>
                    <option value="${TipoCadastro.REVISAO}">Revisão</option>
                    <option value="${TipoCadastro.REVISAR_CHAVES}">Revisar Chaves</option>
                </select>
            `;
        }

        popupContent += `
            <div style="display: flex; justify-content: space-between;">
                <button id="confirmarTipoCadastro" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">Confirmar</button>
                <button id="cancelarTipoCadastro" style="padding: 10px 20px; background-color: #f44336; color: white; border: none; cursor: pointer;">Cancelar</button>
            </div>
        `;

        container.innerHTML = popupContent;

        // Adiciona o container ao corpo da página
        document.body.appendChild(container);

        return new Promise((resolve, reject) => {
            document.getElementById('confirmarTipoCadastro').addEventListener('click', () => {
                const nome = document.getElementById('nomeUsuario').value;
                const tipoCadastro = document.getElementById('tipoCadastroSelect').value;
    
                if (!nome) {
                    alert("Por favor, insira seu nome.");
                    return;
                }
    
                container.remove();
                console.log("Nome:", nome, "Tipo de Cadastro:", tipoCadastro);
                resolve({ nome, tipoCadastro });
            });
    
            document.getElementById('cancelarTipoCadastro').addEventListener('click', () => {
                container.remove();
                console.log("Popup fechado sem confirmação.");
                reject("Cancelado pelo usuário");
            });
        });
    }