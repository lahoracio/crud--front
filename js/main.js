'use strict'

import { getContatos, getContatosPorNome, postContato } from "./contatos.js"

import { uploadImageToAzure } from "./uploadImageToAzure.js"

function criarCard(contato){
    const container = document.getElementById('container')
    const card = document.createElement('div')
    card.classList.add('card-contato')
    card.innerHTML = `
            <img src="${contato.foto}" alt="">
            <h2>${contato.nome}</h2>
            <p>${contato.celular}</p>
        `
    container.appendChild(card)
}

async function exibirContatos(){
    const container = document.getElementById('container')
    const contatos = await getContatos()
    container.replaceChildren()
    contatos.forEach(criarCard)
    
}

async function exibirPesquisa(evento){

    if(evento.key == 'Enter'){
        const contatos = await getContatosPorNome(evento.target.value)
        document.getElementById('container').replaceChildren()
        contatos.forEach(criarCard)
        
        
    }
    
}

//APERTA O BOTAO E APARECE FORMULARIO

function cadastrarContato(){
    document.querySelector('main').className= 'form-show'
}

function voltarHome(){
    document.querySelector('main').className= 'card-show'
}

async function salvarContato(){

    const uploadParams = {
        file: document.getElementById('foto').files[0],
        storageAccount: 'uploadtutorial',
        sasToken: 'sp=racwl&st=2025-05-15T17:30:24Z&se=2025-05-16T01:30:24Z&sv=2024-11-04&sr=c&sig=pJkhIPyVg93b%2BAF8%2FNSCLs5W5hV%2BM3GBsOFwOUV8zsE%3D',
        containerName: 'fotos',
    };
    
    const contato = {
        "nome": document.getElementById('nome').value,
        "celular": document.getElementById('celular').value,
        "foto": await uploadImageToAzure(uploadParams),
        "email": document.getElementById('email').value,
        "endereco": document.getElementById('endereco').value,
        "cidade": document.getElementById('cidade').value

    }

    if ( await postContato(contato)){
        await exibirContatos()
        voltarHome()
        alert ('Cadastro realizado com sucesso!!!')
        
    }
}
exibirContatos()

document.getElementById('pesquisa').addEventListener('keydown', exibirPesquisa)

document.getElementById('novo-contato').addEventListener('click', cadastrarContato)

document.getElementById('cancelar').addEventListener('click', voltarHome)

document.getElementById('salvar').addEventListener('click', salvarContato)