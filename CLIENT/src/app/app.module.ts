import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule,SocketIoConfig} from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { MapsComponent } from './components/maps/maps.component';
import { HttpClientModule} from '@angular/common/http';

const config:SocketIoConfig = {
  url:'http://localhost:3700',
  options:{}
}

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    HttpClientModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
