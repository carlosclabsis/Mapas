"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mapa {
    constructor() {
        this.marcadores = [];
    }
    getMarcadores() {
        return this.marcadores;
    }
    agregarMarcador(marcador) {
        this.marcadores.push(marcador);
    }
    borrarMarcador(id) {
        this.marcadores = this.marcadores.filter((marcador) => {
            if (id !== marcador.id) {
                return marcador;
            }
        });
        return this.marcadores;
    }
    moverMarcador(marcador) {
        for (let i in this.marcadores) {
            if (this.marcadores[i].id == marcador.id) {
                this.marcadores[i].lat = marcador.lat;
                this.marcadores[i].lng = marcador.lng;
            }
        }
    }
}
exports.Mapa = Mapa;
