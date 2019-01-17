import {Usuario} from './usuario';
import { CLIENT_RENEG_LIMIT } from 'tls';

export class UsuariosLista{
    private lista:Usuario[] = [];

    constructor(){}

    public agregar(usuario:Usuario){
        this.lista.push(usuario);
        console.log("[UsarioLista|agregar] Usuario agregado");
        console.log("[UsarioLista|agregar] Nueva lista de Usuarios=>",this.lista);
    }
    public getLista(){
        // filter => filtramos la lista de usuarios que tengan nombre
        // filter => solo retorna a la lista si ees que cumple la condicion
        let listaTemporal = this.lista.filter((usuario)=>{
            if(usuario.nombre !== 'sin-nombre'){
                return usuario;
            }
        });
        return listaTemporal;
    }
    public actualizarNombre(id:string, nombre:string){
        for(let usuario of this.lista){
            if(usuario.id === id){
                console.log("[UsuariosLista|actualizarNombre] modificando de: ",usuario.nombre);
                usuario.nombre = nombre;
                console.log("[UsuariosLista|actualizarNombre] a: ",usuario.nombre);
                break;
            }
        }
        console.log("[UsuariosLista|actualizarNombre] Nueva lista de Usuarios: => ", this.lista);
    }
    public getUsuario(id:string){
        for(let usuario of this.lista){
            if(usuario.id ===id){
                return usuario;
            }
        }
        console.log("[UsuariosLista|getUsuario] No se encontro al usuario con ID: => ", id);
    }
    public borrarUsuario(id:string){
        this.lista = this.lista.filter((usuario)=>{
            if(usuario.id !== id){
                return usuario;
            }
        });
        console.log("[UsarioLista|borrarUsuario] Usuario borrado");
        console.log("[UsarioLista|borrarUsuario] Nueva lista de Usuarios=>",this.lista);
    }
}