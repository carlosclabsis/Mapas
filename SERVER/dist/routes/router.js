"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = __importDefault(require("../classes/server"));
const mapa_1 = require("../classes/mapa");
exports.router = express_1.Router();
//marcadores estaticos
const lugares = [
    {
        id: "1",
        nombre: "Lugar 1",
        lat: -16.4310231,
        lng: -71.5189684
    },
    {
        id: "2",
        nombre: "Lugar 2",
        lat: -16.44,
        lng: -71.53
    }
];
exports.mapa = new mapa_1.Mapa;
exports.mapa.marcadores = lugares;
//rutas de mapas
exports.router.get('/mapas', (req, res) => {
    return res.json(exports.mapa.getMarcadores());
});
exports.router.get('/mensajes', (req, res) => {
    res.status(200).send({
        ok: true,
        mensaje: "Mensaje correcto"
    });
});
exports.router.post('/mensajes', (req, res) => {
    var entrada = req.body.entrada;
    var de = req.body.de;
    const payload = {
        de: de,
        entrada: entrada
    };
    const server = server_1.default.instance;
    server.io.emit('mensaje-servidor', payload);
    res.status(200).send({
        ok: true,
        mensaje: "Mensaje correcto",
        entrada: entrada,
    });
});
exports.router.post('/mensajes/:id', (req, res) => {
    var entrada = req.body.entrada;
    var de = req.body.de;
    var id = req.params.id;
    const payload = {
        de,
        cuerpo: entrada
    };
    const server = server_1.default.instance;
    server.io.in(id).emit('mensaje-privado', payload);
    res.status(200).send({
        ok: true,
        mensaje: "Mensaje correcto",
        entrada: entrada,
        id: id
    });
});
exports.router.get('/usuarios', (req, res) => {
    const server = server_1.default.instance;
    //clients => retorna el arreglo de sockets conectados
    // []string
    server.io.clients((err, clientes) => {
        if (err) {
            return res.status(505).send({
                ok: false,
                err
            });
        }
        else {
            return res.status(200).send({
                ok: true,
                clientes
            });
        }
    });
});
