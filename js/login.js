let campoEmail = document.querySelector("#email");
let campoSenha = document.querySelector('#senha');
let btnEntrar = document.getElementById(`btn-entrar`);

btnEntrar.addEventListener("click", () => {
    let emailDigitado = campoEmail.value.toLowerCase();
    let senhaDigitada = campoSenha.value;

    autenticar(emailDigitado, senhaDigitada);
});


function autenticar (email, senha){
    const URL = 'http://localhost:3400/login';

    fetch(URL, {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, senha})
    })
    .then(response => response = response.json())
    .then(response => {
        console.log(response)

        if(!!response.mensagem){
            alert(response.mensagem);
            return;
        }

        mostrarLoading();

        salvarToken(response.token);
        salvarUsuario(response.usuario);

        setTimeout(() => {
            window.open('controle-produtos.html', '_self');
        }, 1000);
        
    })
    .catch(erro => {
        console.log(erro)
    })    
}

function mostrarLoading(){
    const divLoading = document.getElementById("loading");
    divLoading.style.display = "block";

    const divBoxLogin = document.querySelector('div.caixa-login');
    divBoxLogin.style.display = "none";
}
