// Cria uma função customizada para exibir o prompt de nome
window.exibirPromptNome = function(versionamento) {
    return new Promise((resolve) => {
        // Criação do container do prompt
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = '#ffffff';
        container.style.border = '1px solid #333';
        container.style.padding = '20px';
        container.style.zIndex = '1000';
        container.style.width = '300px';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        container.style.textAlign = 'center';

        // Título e instruções
        const title = document.createElement('h3');
        title.innerText = `Versão: ${versionamento}`;
        const instruction = document.createElement('p');
        instruction.innerText = 'Por favor, insira o seu nome:';

        // Input de texto
        const input = document.createElement('input');
        input.type = 'text';
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginTop = '10px';
        input.style.fontSize = '14px';

        // Botão de confirmação
        const confirmButton = document.createElement('button');
        confirmButton.innerText = 'Confirmar';
        confirmButton.style.marginTop = '15px';
        confirmButton.style.padding = '10px 20px';
        confirmButton.style.fontSize = '14px';
        confirmButton.addEventListener('click', function () {
            const nome = input.value.trim();
            document.body.removeChild(container);
            resolve(nome);  // Retorna o nome inserido
        });

        // Adiciona os elementos ao container e ao corpo do documento
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(input);
        container.appendChild(confirmButton);
        document.body.appendChild(container);
    });
};
