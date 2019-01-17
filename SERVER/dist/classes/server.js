"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//importando libreria express
const express_1 = __importDefault(require("express"));
const environment_1 = require("../globals/environment");
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const usuario_lista_1 = require("./usuario-lista");
const router_1 = require("../routes/router");
//creando la clase del servidor
class Server {
    //constructor del Server
    constructor() {
        this.usuariosConectados = new usuario_lista_1.UsuariosLista();
        this.app = express_1.default();
        this.port = environment_1.SERVER_PORT;
        //Configuando el nuevo servidor web a traves de http
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.escucharSocket();
    }
    static get instance() {
        if (this._instance) {
            return this._instance;
        }
        else {
            this._instance = new this();
            return this._instance;
        }
    }
    //funcion para escuchar las conexiones 
    escucharSocket() {
        console.log("Listo para recibir conexiones o sockets o clientes");
        // el servidor escucha el evento connect y recibe al cliente conectado
        this.io.on('connect', cliente => {
            console.log("Nuevo cliente conectado", cliente.id);
            // el cliente que se ha conectado previamente, escucha su desconexion
            cliente.on('disconnect', () => {
                console.log("El cliente se ha desconectado => ", cliente.id);
            });
            //MAPAS : evento para escuchar socket de nombre "nuevo-lugar"
            // y agregar el nuevo lugar al arreglo de los lugares
            cliente.on('nuevo-lugar', (lugar) => {
                router_1.mapa.agregarMarcador(lugar);
                console.log(router_1.mapa.getMarcadores());
                cliente.broadcast.emit('nuevo-lugar', lugar); // esuchan los demas pero no el mismo
                // CON BROADCAST evitamos que se pinte 2 veces la misma ubicacion
                //this.io.emit('nuevo-lugar',lugar); // enviamos al cliente el lugar que recibimos para que lo pinte
            });
            // MAPAS: evento para escuchar socket de nombre"borrar-lugar"
            // y borrar el lugar del arreglo de lugares del servidor
            cliente.on('borrar-lugar', (id) => {
                router_1.mapa.borrarMarcador(id);
                this.io.emit('borrar-lugar', id);
            });
            //
            cliente.on('ruta-marcador', (lugar) => {
                router_1.mapa.moverMarcador(lugar);
                this.io.emit('ruta-marcador', lugar);
            });
            // el cliente que se ha conectado previamente, escucha un evento de nombre: mensaje
            // cliente.on('mensaje',(contenido)=>{
            //     console.log("entrada" + contenido);
            //     this.io.emit('mensaje-nuevo', contenido);
            // });
            // cliente.on('configurar-usuario',(payload:any,callback:Function)=>{
            //     this.usuariosConectados.actualizarNombre(cliente.id,payload.nombre);
            //     this.io.emit('usuarios-activos',this.usuariosConectados.getLista());
            //     callback({
            //         ok:true,
            //         mensaje:`Usuario ${payload.nombre} configurado`
            //     });
            // });
            // cliente.on('obtener-usuarios',()=>{
            //     this.io.in(cliente.id).emit('usuarios-activos',this.usuariosConectados.getLista());
            // });
        });
    }
    //funcion para iniciar el servidor
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = Server;
