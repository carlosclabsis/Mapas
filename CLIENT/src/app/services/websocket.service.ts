import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socketStatus:boolean;

  constructor(private _socket:Socket,) { 
    this.checkStatus();
  }

  public checkStatus(){
    this._socket.on('connect',()=>{
      console.log("Conectado al servidor");
      this.socketStatus = true;
    });

    this._socket.on('disconnect',()=>{
      console.log("Desconectado del servidor");
      this.socketStatus = false;
    });
  }
  public emitir(evento:string,payload?:any,callback?:Function){
    this._socket.emit(evento,payload,callback);
  }
  public escuchar(evento:string):Observable<any>{
    return this._socket.fromEvent(evento);
  }
}