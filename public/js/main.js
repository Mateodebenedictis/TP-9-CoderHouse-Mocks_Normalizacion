const socket = io(); //emitimos el evento connection que el socket server esta escuchando

//PROFE NO PUEDO IMPORTAR NORMALIZR, COMO PODRIA HACERLO? 
//const { denormalize, schema } = normalizr;
//import { denormalize, schema } from 'normalizr';
//const { denormalize, schema } = require('normalizr');

socket.on('productos', (productos) => {
    
    console.log(productos);
    
    if(productos.length == 0){
        document.getElementById('mensajeSinProductos').innerHTML = 'No hay productos cargados';
    } else {
        document.getElementById('mensajeSinProductos').innerHTML = '';
    }
    
    const productosHtml = productos.map((producto) => {
        return `<tr>
        <td>${producto.title}</td>
        <td>${producto.price}</td>
        <td class="w-25">
        <img src=${producto.thumbnail} class="foto" alt=${producto.title} >
        </td>
        </tr>`
    }).join(' ');
    
    document.getElementById('tablaProductos').innerHTML = productosHtml;
    
});

socket.on('conversation', (messages) => {

    //Defining the schemas for normalizr for the messages

    const author = new schema.Entity('author', {}, { idAttribute: 'id' });
    const text = new schema.Entity('text');
    const date = new schema.Entity('date');

    const message = new schema.Entity('message', {
        author: author,
        text: text,
        date: date
    }, { idAttribute: 'id' });

    console.log(messages);

    let mensajesNormalizadosLength = JSON.parse(messages).length;

    //Denormalizo los mensajes

    let messages = denormalize(messages.result, [message], messages.entities);
    let mensajesDesnormalizadosLength = JSON.stringify(messages).length;

    //Calculo el porcentaje de compresión
    const porcentaje = (mensajesNormalizadosLength * 100) / mensajesDesnormalizadosLength;

    const messagesHtml = messages.map((message) => {
        return `<div class="marron mensaje">
            <strong class="azul">${message.author.id}</strong> ${message.date}: <em class="verde">${message.text}</em><img src=${message.author.avatar} class="avatar" alt=${message.author.id} >
        </div>`
    }).join(' ');

    document.getElementById('messages').innerHTML = messagesHtml;


    //Asignar el porcentaje al elemento de la vista

    const porcentajeHtml = `<h1 class="text-center">Porcentaje de compresión: ${porcentaje.toFixed(2)}%</h1>`

    document.getElementById('porcentaje').innerHTML = porcentajeHtml;

});


document.getElementById('chatForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const message = {
        author: {
            id: '',
            nombre: '',
            apellido: '',
            edad: '',
            alias: '',
            avatar: ''
        },
        text: '',
        date: ''
    };

    const hoy = new Date();

    message.author.id = document.getElementById('email').value;
    message.author.nombre = document.getElementById('nombre').value;
    message.author.apellido = document.getElementById('apellido').value;
    message.author.edad = document.getElementById('edad').value;
    message.author.alias = document.getElementById('alias').value;
    message.author.avatar = document.getElementById('avatar').value;
    message.date = `[${hoy.toLocaleString()}]`;
    message.text = document.getElementById('text').value;
    
    socket.emit('new-message', message);
    
    document.getElementById('text').value = '';
});

document.getElementById('insertProducto').addEventListener('submit', (event) => {
    event.preventDefault();

    const producto = {};

    producto.title = document.getElementById('titulo').value;
    producto.price = document.getElementById('precio').value;
    producto.thumbnail = document.getElementById('imagen').value;
    
    socket.emit('new-producto', producto);
    
    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
    document.getElementById('thumbnail').value = '';
});

