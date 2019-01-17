//importando libreria express
import express from 'express';
import { SERVER_PORT } from '../globals/environment';
import http from 'http';
import socketIO from 'socket.io';
import { disconnect } from 'cluster';
import { UsuariosLista } from './usuario-lista';
import { Usuario } from './usuario';
import { Marcador } from './Marcador';
import { mapa } from '../routes/router';


//creando la clase del servidor
export default class Server{
    
    //creando la variable del servidor express
    public app:express.Application;
    public port:Number;
    private httpServer:http.Server;
    public io:socketIO.Server;
    public usuariosConectados = new UsuariosLista();
    //constructor del Server
    constructor(){
        this.app = express();
        this.port = SERVER_PORT;
        //Configuando el nuevo servidor web a traves de http
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        this.escucharSocket();
    }
    //Programando geter de la unica instancia de la clase
    //(Patron de Diseño SINGLETON)
    private static _instance : Server;
    public static get instance(){
        if(this._instance){
            return this._instance;
        }else{
            this._instance = new this();
            return this._instance;
        }
    }
    //funcion para escuchar las conexiones 
    public escucharSocket()
    {
        console.log("Listo para recibir conexiones o sockets o clientes");
        // el servidor escucha el evento connect y recibe al cliente conectado
        this.io.on('connect',cliente=>{
            console.log("Nuevo cliente conectado",cliente.id);            
            // el cliente que se ha conectado previamente, escucha su desconexion
            cliente.on('disconnect',()=>{
                console.log("El cliente se ha desconectado => ", cliente.id);
            });

            //MAPAS : evento para escuchar socket de nombre "nuevo-lugar"
            // y agregar el nuevo lugar al arreglo de los lugares
            cliente.on('nuevo-lugar',(lugar:Marcador)=>{
                mapa.agregarMarcador(lugar);
                console.log(mapa.getMarcadores());
                cliente.broadcast.emit('nuevo-lugar',lugar); // esuchan los demas pero no el mismo
                // CON BROADCAST evitamos que se pinte 2 veces la misma ubicacion
                //this.io.emit('nuevo-lugar',lugar); // enviamos al cliente el lugar que recibimos para que lo pinte
            });
            // MAPAS: evento para escuchar socket de nombre"borrar-lugar"
            // y borrar el lugar del arreglo de lugares del servidor
            cliente.on('borrar-lugar',(id:string)=>{
                mapa.borrarMarcador(id);
                this.io.emit('borrar-lugar',id);
            });
            //
            cliente.on('ruta-marcador',(lugar:Marcador)=>{
                mapa.moverMarcador(lugar);
                this.io.emit('ruta-marcador',lugar);
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
    public start(callback:Function){
        this.httpServer.listen(this.port,callback);
    }
}
