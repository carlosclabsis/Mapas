import Server from './classes/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import {router} from './routes/router';
//Instanciando al servidor
const server = Server.instance;
//Configurando bodyparser para que los argumentos que lleguen por urlencoded
//lleguen en el arreglo 'body' del request
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());
//CORS
server.app.use(cors({origin:true, credentials:true}));
//configurando las rutas
server.app.use('/',router);
//iniciando el servidor
server.start(()=>{
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
