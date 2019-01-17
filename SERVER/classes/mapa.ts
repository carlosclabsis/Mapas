import { Marcador} from './marcador';

export class Mapa{
    public marcadores:Marcador[]=[];
    constructor(){    } 
    getMarcadores(){
        return this.marcadores;
    }
    agregarMarcador(marcador:Marcador){
        this.marcadores.push(marcador);
    }
    borrarMarcador(id:string){
        this.marcadores = this.marcadores.filter((marcador)=>{
            if(id !== marcador.id){
                return marcador;
            }
        });

        return this.marcadores;
    }
    moverMarcador(marcador:Marcador){
        for(let i in this.marcadores){
            if(this.marcadores[i].id == marcador.id){
                this.marcadores[i].lat = marcador.lat;
                this.marcadores[i].lng = marcador.lng;
            }
        }
    }
}