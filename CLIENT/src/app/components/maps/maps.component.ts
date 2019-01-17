import { Component,OnInit, ViewChild, ElementRef } from '@angular/core';
import { Lugar } from '../../interfaces/lugar';
import { WebsocketService } from '../../services/websocket.service';
import { HttpClient } from '@angular/common/http';
 
@Component({
  selector: 'maps-root',
  templateUrl: './maps.component.html'
})
export class MapsComponent implements OnInit{
    @ViewChild('map') mapaElement:ElementRef;
    //public miMapa = document.getElementById("map"); es lo mismo que viewchild
    public map:google.maps.Map;
    public lugares:Lugar[]=[];
    public ALine:any[] = [];
    public marcadores:google.maps.Marker[] = [];

    constructor(private _wsService:WebsocketService,
                private _http:HttpClient){

    }

    public ngOnInit(){      
        this._http.get("http://localhost:3700/mapas").subscribe((lugares:Lugar[])=>{
            this.lugares = lugares;
            this.cargarMapa();
        
        }); 
        this.getCurrentPosition();
        this.escucharSockets();
    }
    public escucharSockets(){
        // socket para agregar un lugar desde el servidor
        this._wsService.escuchar('nuevo-lugar').subscribe((lugar:Lugar)=>{
            this.agregarMarcador(lugar);
        });
        //socket para borrar un lugar desde el servidor
        this._wsService.escuchar('borrar-lugar').subscribe((id:string)=>{
            this.marcadores.forEach((elemento)=>{
                if( id === elemento.getTitle()){
                    elemento.setMap(null);
                    
                }
            })
        });
        this._wsService.escuchar('ruta-marcador').subscribe((lugar:Lugar)=>{
            // CAMBIA LA POSICION DEL LUGAR QUE VIENE DESDE SERVIDOR            
            let latLng = new google.maps.LatLng(lugar.lat,lugar.lng);
            this.marcadores.forEach((elemento)=>{
                if(elemento.getTitle() === lugar.id){
                    elemento.setPosition(latLng);
                    
                }
            });

            // let latLng1 = new google.maps.LatLng(lugar.lat,lugar.lng);
            // let latLng2 = [{lat:lugar.lat, lng:lugar.lng}];
            
            
            // var flightPlanCoordinates = [
            //     {lat: lugar.lat, lng: lugar.lng},
            //     {lat: lugar.lat, lng: lugar.lng}            
            // ]
            // var routes = new google.maps.MVCArray();
            // var flightPath = new google.maps.Polyline({
            //     path: flightPlanCoordinates,
            //     geodesic: true,
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 1.0,
            //     strokeWeight: 2
            // });
            // flightPath.setMap(this.map);

            // var poly = new google.maps.Polyline({
            //     strokeColor: '#000000',
            //     strokeOpacity: 1.0,
            //     strokeWeight: 3
            //   });
            //   poly.setMap(this.map);
      
            //   // Add a listener for the click event
              

              
            //     var path = poly.getPath();
        
            //     // Because path is an MVCArray, we can simply append a new coordinate
            //     // and it will automatically appear.
            //     path.push(latLng1);
                
            //     // Add a new marker at the new plotted point on the polyline.
                
                // var flightPath = new google.maps.Polyline({
                //         path: path,
                //         geodesic: true,
                //         strokeColor: '#FF0000',
                //         strokeOpacity: 1.0,
                //         strokeWeight: 2
                //     });
              
                // var line = new google.maps.Polyline({ 
                //     path: latLng2, 
                //     strokeColor: '#ff0000', 
                //     strokeOpacity: 1.0, 
                //     strokeWeight: 2 
                // }); 
                // line.setMap(this.map);
            
            var path = {lat: lugar.lat,lng: lugar.lng}
            this.ALine.push(path);
            
            var flightPath = new google.maps.Polyline({
                path: this.ALine,
                geodesic: true,
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                });
            flightPath.setMap(this.map);   
    
        });
    }

    public getCurrentPosition(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((posicion)=>{
                console.log(posicion.coords);
                const miPosicion:Lugar= {
                    id:"034",
                    lat:posicion.coords.latitude,
                    lng:posicion.coords.longitude,
                    nombre: "Mi ubicacion"
                }
                this.agregarMarcador(miPosicion);
            });
        }
    }
    public cargarMapa(){
        const latLng = new google.maps.LatLng(-16.4310231,-71.5189684);
        const mapaOpciones: google.maps.MapOptions = {
            center : latLng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.mapaElement.nativeElement,mapaOpciones);

        this.map.addListener('click',(coors)=>{
            let objLugar:Lugar={
                id: new Date().toISOString(),
                nombre: "Lugar 123",
                lat: coors.latLng.lat(),
                lng: coors.latLng.lng(),
            }
            this.agregarMarcador(objLugar);
            // disparar un socket para agregar el marcador en el back
            this._wsService.emitir("nuevo-lugar",objLugar);
        });

        for(let lugar of this.lugares){
            this.agregarMarcador(lugar);
        }
    }

    

    public agregarMarcador(marcador:Lugar){
        const latlng = new google.maps.LatLng(marcador.lat,marcador.lng);
        const marker = new google.maps.Marker({
            map: this.map,
            position: latlng,
            animation: google.maps.Animation.BOUNCE,
            draggable: true,
            title: marcador.id
        });

        //ARRASTRAR MARCADOR
        google.maps.event.addDomListener(marker,'drag',(coors)=>{   

            console.log("lat => " + coors.latLng.lat());
            console.log("lng => " + coors.latLng.lng());
            let objLugars:Lugar={
                id: marker.getTitle(),
                nombre: "wef",
                lat: coors.latLng.lat(),
                lng: coors.latLng.lng(),
            }
            this._wsService.emitir("ruta-marcador",objLugars);
        });


        //eliminar marcador(dbclick)
        google.maps.event.addDomListener(marker, 'dblclick',(coors)=>{
            marker.setMap(null);
            //emitir socket para borra marcador
            this._wsService.emitir("borrar-lugar",marker.getTitle());
        })
        //click en el marcador
        const contenido = `<strong>${marcador.nombre}</strong>`;
        const ventana = new google.maps.InfoWindow({
            content: contenido
        });

        google.maps.event.addDomListener(marker,'click',()=>{
            ventana.open(this.map,marker);
        });

        this.marcadores.push(marker);
    }

}
//types => son las ayudas que nos  brinda para escribir
