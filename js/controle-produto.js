const URL = 'http://localhost:3400/produtos';

let listaProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProduto = document.querySelector('table>tbody');
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'));
let modalEdit = new bootstrap.Modal(document.getElementById('modal-editar-produto'));

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    valor: document.querySelector("#valor"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    observacao: document.querySelector("#observacao"),
    foto: document.querySelector("#foto"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar: document.querySelector("#btn-salvar"),
    btnCancelar: document.querySelector("#btn-cancelar")
}

btnAdicionar.addEventListener('click', () => {
    limparModalProduto();
    modalProduto.show();
});

function obterProdutos() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': obterToken()
        }
    })
        .then(response => response.json())
        .then(produtos => {
            listaProdutos = produtos;
            popularTabela(produtos);
        })
        .catch((erro) => { });
}

obterProdutos();

function popularTabela(produtos) {
    tabelaProduto.textContent = '';

    produtos.forEach(produto => {
        criarLinhaNaTabela(produto);
    });
}

function criarLinhaNaTabela(produto) {
    let tr = document.createElement('tr');
    tr.classList.add('linha-produto');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdQuantidadeEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = produto.id
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdQuantidadeEstoque.textContent = produto.quantidadeEstoque;
    tdObservacao.textContent = produto.observacao;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button style="background-color: #323238; color: #fff; border-color: #323238;" onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Editar
                            </button>
                            <button style="background-color: #AB222E; color: #fff; border-color: #AB222E;" onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Excluir
                        </button>`;

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQuantidadeEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaProduto.appendChild(tr);
}

formModal.btnSalvar.addEventListener('click', () => {
    let produto = obterProdutoDoModal();

    if (!produto.validar()) {
        alert("Nome, Valor e Quantidade em Estoque são obrigatórios.");
        return;
    }

    adicionarProdutoNoBackend(produto);
});

function obterProdutoDoModal() {
    return new Produto({
        id: formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarProdutoNoBackend(produto) {
    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
        .then(response => response.json())
        .then(response => {
            let novoProduto = new Produto(response);
            listaProdutos.push(novoProduto);

            popularTabela(listaProdutos);

            modalProduto.hide();

            alert(`Produto ${produto.nome}, foi cadastrado com sucesso!`)
        })
}

function limparModalProduto() {
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value = '';
    formModal.quantidadeEstoque.value = '';
    formModal.observacao.value = '';
    formModal.foto.value = '';
    formModal.dataCadastro.value = '';
}

function excluirProduto(id) {
    let produto = listaProdutos.find(produto => produto.id == id);

    if (confirm("Deseja realmente excluir o produto " + produto.nome)) {
        excluirProdutoNoBackEnd(id);
    }
}

function excluirProdutoNoBackEnd(id) {
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
        .then(() => {
            removerProdutoDaLista(id);
            popularTabela(listaProdutos);
        })
}

function removerProdutoDaLista(id) {
    let indice = listaProdutos.findIndex(produto => produto.id == id);

    listaProdutos.splice(indice, 1);
}

function editarProduto(id) {
    let produto = listaProdutos.find(produto => produto.id === id);
    document.querySelector("#editar-id").value = produto.id;
    document.querySelector("#editar-nome").value = produto.nome;
    document.querySelector("#editar-valor").value = produto.valor;
    document.querySelector("#editar-quantidadeEstoque").value = produto.quantidadeEstoque;
    document.querySelector("#editar-observacao").value = produto.observacao;
    document.querySelector("#editar-dataCadastro").value = produto.dataCadastro;
    modalEdit.show();
}

function salvarEdicao() {
    let id = document.querySelector("#editar-id").value;
    let produto = {
        nome: document.querySelector("#editar-nome").value,
        valor: document.querySelector("#editar-valor").value,
        quantidadeEstoque: document.querySelector("#editar-quantidadeEstoque").value,
        observacao: document.querySelector("#editar-observacao").value,
        dataCadastro: document.querySelector("#editar-dataCadastro").value
    };

    fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
        .then(response => response.json())
        .then(response => {
            obterProdutos()
            popularTabela(listaProdutos);
            modalEdit.hide();
            alert(`Produto ${response.nome} atualizado com sucesso!`);
            
        })
        .catch(error => {
            console.error('Erro ao editar produto:', error);
            alert('Erro ao editar produto. Por favor, tente novamente.');
        });
}
