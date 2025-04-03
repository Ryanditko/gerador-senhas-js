// Meu Gerador de Senhas Avançado
// Desenvolvido por [Seu Nome]

// Elementos do DOM que vou precisar manipular
const passwordEl = document.getElementById('password');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy-button');
const strengthText = document.getElementById('strength-text');
const strengthIndicator = document.getElementById('strength-indicator');

// Caracteres que posso usar para gerar a senha
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Eventos principais
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);

// Função para gerar a senha
function generatePassword() {
    // Pegando o tamanho desejado da senha
    const length = +lengthEl.value;
    
    // Verificando quais tipos de caracteres foram selecionados
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;
    
    // Validações básicas
    if (length < 8 || length > 50) {
        alert('Por favor, escolha um tamanho entre 8 e 50 caracteres!');
        return;
    }
    
    if (!hasLower && !hasUpper && !hasNumber && !hasSymbol) {
        alert('Selecione pelo menos um tipo de caractere!');
        return;
    }
    
    // Gerando a senha
    const password = generatePasswordLogic(
        hasLower,
        hasUpper,
        hasNumber,
        hasSymbol,
        length
    );
    
    // Mostrando a senha na tela
    passwordEl.value = password;
    
    // Avaliando e mostrando a força da senha
    updatePasswordStrength(password);
}

// Lógica principal de geração da senha
function generatePasswordLogic(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [
        { type: 'lower', enabled: lower },
        { type: 'upper', enabled: upper },
        { type: 'number', enabled: number },
        { type: 'symbol', enabled: symbol }
    ].filter(item => item.enabled);
    
    // Garantindo que pelo menos um caractere de cada tipo selecionado seja incluído
    for (let i = 0; i < typesArr.length; i++) {
        generatedPassword += randomFunc[typesArr[i].type]();
    }
    
    // Completando o resto da senha
    for (let i = typesArr.length; i < length; i++) {
        const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
        generatedPassword += randomFunc[randomType.type]();
    }
    
    // Embaralhando a senha final
    return shufflePassword(generatedPassword);
}

// Funções auxiliares para gerar caracteres aleatórios
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Função para embaralhar a senha
function shufflePassword(password) {
    const array = password.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Função para copiar a senha
async function copyPassword() {
    if (!passwordEl.value) {
        alert('Gere uma senha primeiro!');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(passwordEl.value);
        copyBtn.textContent = '✅ Copiado!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copiar';
        }, 2000);
    } catch (err) {
        alert('Erro ao copiar a senha!');
    }
}

// Função para avaliar a força da senha
function updatePasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    
    strengthIndicator.className = '';
    if (strength < 3) {
        strengthIndicator.classList.add('strength-weak');
        strengthText.textContent = 'Fraca';
    } else if (strength < 4) {
        strengthIndicator.classList.add('strength-medium');
        strengthText.textContent = 'Média';
    } else {
        strengthIndicator.classList.add('strength-strong');
        strengthText.textContent = 'Forte';
    }
}

// Função para calcular a força da senha
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Verificar comprimento
    if (password.length >= 12) strength++;
    
    // Verificar mistura de caracteres
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Verificar complexidade adicional
    if (password.length >= 16) strength++;
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) strength++;
    
    return strength;
} 