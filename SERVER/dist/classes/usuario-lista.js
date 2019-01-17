"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsuariosLista {
    constructor() {
        this.lista = [];
    }
    agregar(usuario) {
        this.lista.push(usuario);
        console.log("[UsarioLista|agregar] Usuario agregado");
        console.log("[UsarioLista|agregar] Nueva lista de Usuarios=>", this.lista);
    }
    getLista() {
        // filter => filtramos la lista de usuarios que tengan nombre
        // filter => solo retorna a la lista si ees que cumple la condicion
        let listaTemporal = this.lista.filter((usuario) => {
            if (usuario.nombre !== 'sin-nombre') {
                return usuario;
            }
        });
        return listaTemporal;
    }
    actualizarNombre(id, nombre) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                console.log("[UsuariosLista|actualizarNombre] modificando de: ", usuario.nombre);
                usuario.nombre = nombre;
                console.log("[UsuariosLista|actualizarNombre] a: ", usuario.nombre);
                break;
            }
        }
        console.log("[UsuariosLista|actualizarNombre] Nueva lista de Usuarios: => ", this.lista);
    }
    getUsuario(id) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                return usuario;
            }
        }
        console.log("[UsuariosLista|getUsuario] No se encontro al usuario con ID: => ", id);
    }
    borrarUsuario(id) {
        this.lista = this.lista.filter((usuario) => {
            if (usuario.id !== id) {
                return usuario;
            }
        });
        console.log("[UsarioLista|borrarUsuario] Usuario borrado");
        console.log("[UsarioLista|borrarUsuario] Nueva lista de Usuarios=>", this.lista);
    }
}
exports.UsuariosLista = UsuariosLista;
