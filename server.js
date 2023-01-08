const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const {config, configSqlite3} = require('./database/connection');
const createTables = require('./database/createTables');
const productosRouter = require('./router/productos');

const Contenedor = require('./containers/Contenedor');
const ContenedorSQL = require('./containers/ContenedorSQL');

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static('public'));
app.use('/api', productosRouter);


//crea las tablas correspondientes y si existen las elimina y las vuelve a crear
createTables();

const contenedorProductos = new ContenedorSQL(config, 'productos');

const contenedorMensajes = new ContenedorSQL(configSqlite3 ,'mensajes');


io.on('connection', async (socket) => {

    console.log('socket id: ', socket.id);
    socket.emit('conversation', await contenedorMensajes.getAll());
    socket.emit('productos', await contenedorProductos.getAll());
    
    socket.on('new-message', async (message) => {
        console.log('nuevo mensaje');
        await contenedorMensajes.save(message);
        io.sockets.emit('conversation', await contenedorMensajes.getAll());
    });

    socket.on('new-producto', async (producto) => {
        console.log('nuevo producto');
        await contenedorProductos.save(producto);
        io.sockets.emit('productos', await contenedorProductos.getAll());
    });

});


const port = 8080;

const connectedServer = httpServer.listen(port, () => {
  console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`));



