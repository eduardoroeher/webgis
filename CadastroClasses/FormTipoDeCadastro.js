
	// Função que exibe um combobox para o determinar o tipo de cadastro que será realizado
	function FormTipoCadastro() {
		// Obtém a URL atual da página
		//var currentUrl = window.location.href;

		// Cria o container para o combobox
		var container = document.createElement('div');
		container.style.position = 'fixed';
		container.style.top = '50%';
		container.style.left = '50%';
		container.style.transform = 'translate(-50%, -50%)';
		container.style.backgroundColor = 'white';
		container.style.border = '1px solid black';
		container.style.padding = '30px'; // Aumentado para mais espaço interno
		container.style.zIndex = '1000';
		container.style.width = '400px'; // Aumentado para 400px
		container.style.minHeight = '250px'; // Definido um tamanho mínimo de altura
		container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Sombra para melhor visibilidade

		// Configura o layout do container para flexbox
		container.style.display = 'flex';
		container.style.flexDirection = 'column';
		container.style.justifyContent = 'center';
		container.style.alignItems = 'stretch';
		container.style.gap = '15px'; // Espaçamento entre os elementos


		// Determina se o "BIC" deve ser exibido com base no endereço
		var bicLabel = '';
		if (currentUrl.includes('id=c52271fd9c1e4515a1f1dafd8ce5ad2a')) {
			bicLabel = `<p style="font-weight: bold; text-align: center; height: 40px; font-size: 14px;">ACESSANDO FASE 2 - BIC</p>`;
		}
		else if(currentUrl.includes('id=6cbe01fc405f4834a8997f7897d286e9'))	{
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

		// Adiciona o container ao corpo da página
		document.body.appendChild(container);

		// Define o comportamento do botão de confirmação
		document.getElementById('confirmarTipoCadastro').addEventListener('click', function() {
			tipoCadastro = document.getElementById('tipoCadastroSelect').value;
			container.remove();
			console.log("Tipo de cadastro escolhido:", tipoCadastro);
			//preencherCampos();
		});
	}