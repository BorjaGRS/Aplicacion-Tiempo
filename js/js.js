
class Tiempo{

  constructor(ciudad,diaHora,cielo,grados,humedad,viento,presion,icono){
   this.ciudad=ciudad;
   this.diaHora=diaHora;
   this.cielo=cielo;
   this.grados=grados;
   this.humedad=humedad;
   this.viento=viento;
   this.presion=presion;
   this.icono=icono;
  }

}


var urlWeather =
  "http://api.openweathermap.org/data/2.5/forecast?id=6359232&units=metric&mode=xml&APPID=5ee19f5d1f6c43fa0fe8b430b4496557";


 document.addEventListener("DOMContentLoaded", function(event) {
   
   controlador(urlWeather);
 }
   
  );


async function controlador(){
  var sub = document.getElementsByClassName("sub");

  var xml = await getXML(urlWeather);
  var aTiempo = await crearObjeto(xml);
    asignaId(sub);

  for (var i = 0; i < sub.length; i++) {
    sub[i].addEventListener("click",function(){
     if(true){
      return rellenarHtmlDetalle(aTiempo,this.id);
        }
   });
  }
   
rellenarHTML(aTiempo);

}

function asignaId(sub){

for (var i = 0; i < sub.length; i++) {
       sub[i].setAttribute("id",i);
       }
}


function getXML(url) {

 return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'document';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}


function crearObjeto(xml){

var ciudad = xml.getElementsByTagName("name")[0].textContent;
var dH = xml.getElementsByTagName("time");
var tiem = xml.getElementsByTagName("clouds");
var temp = xml.getElementsByTagName("temperature");
var hume = xml.getElementsByTagName("humidity");
var vien = xml.getElementsByTagName("windSpeed");
var pres = xml.getElementsByTagName("pressure");
var ico = xml.getElementsByTagName("symbol");
 

return new Tiempo(ciudad,diaSemana(dH),tiempo(dH,tiem),grados(dH,temp),humedad(hume),viento(vien),presion(pres),icono(ico));

}

function rellenarHTML(tiempo){

  var i;
  var titulo = document.getElementById("ciudad").innerHTML=tiempo.ciudad;
  var diaHora = tiempo.diaHora;
  var cielo=tiempo.cielo;
  var grados=tiempo.grados;
  var inputs= document.getElementsByClassName("sub");
  
  for( i=0; i<diaHora.length;i++){
  
  inputs[i].setAttribute("value",diaHora[i][0] + " / " + diaHora[i][2]+"-"+diaHora[i][1]+ " / " +cielo[i]+" / "+grados[i][0] +" - " + grados[i][1]);
   }
   
}


function diaSemana(valor){
  

var mes1="";
var dia1=""; 
var sem1="";
var dias=[];
var diaSem=["Domingo","Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var todo =[];
var sem2="nada";


for(i=0;i<valor.length;i++){

 dias[i] = valor[i].getAttribute("from");
 
}

for (var e = 0; e < dias.length; e++) {

var sem= new Date(dias[e]).getUTCDay();
sem1=diaSem[sem];

var mes = new Date(dias[e]).getMonth();
mes1=meses[mes];

var dia = dias[e].substring(8, 10);

if(sem1!=sem2){
sem2=sem1; 
todo[e]=[sem1,mes1,dia];
}

}

return todo.filter(Boolean);

}

function tiempo(dia,tiempo){

 var fechas=[];
 var horas="";
 var cielo=[];
 var cont=0;
 
 for(var i=0;i<dia.length;i++){
 
 fechas[i] = dia[i].getAttribute("from");
 
 }

 for (var e = 0; e < fechas.length; e++) {

   horas = fechas[e].substring(11, 13);

   if(horas === "12"){
    cielo[e]=tiempo[e].getAttribute("value");
    cont++;
   }
   
 }

 if(cont==5 || cont==4){
cielo.unshift(tiempo[0].getAttribute("value"));
cielo.push(tiempo[tiempo.length-1].getAttribute("value"));
 }
 
return cielo.filter(Boolean);

}


function grados(dias,temperaturas){

var fechas=[];
var di="nada";
var dia ="0";
var max="";
var min="";
var max1="";
var min1="";
var todo=[];
var otra="";
var cont=-1;



for(var i=0;i<dias.length;i++){
 
 fechas[i] = dias[i].getAttribute("from");
 
 }

 for (var e = 0; e < fechas.length; e++) {

  di = fechas[e].substring(8, 10);

  if(di!=dia){
   cont++;
   dia=di;
   max=parseInt(temperaturas[e].getAttribute("max"));
   min=parseInt(temperaturas[e].getAttribute("min"));
   todo[cont]=[dia,max,min];
  }else{
   otra=fechas[e].substring(8, 10);
   max1=parseInt(temperaturas[e].getAttribute("max"));
   min1=parseInt(temperaturas[e].getAttribute("min"));
   for (var a = 0; a < todo.length; a++) {
     if(todo[a][0]==otra){

       if(max1 > todo[a][1]){
        todo[a][1]=max1;
        }
         if(min1 < todo[a][2]){
         todo[a][2]=min1;
         }
      }

    }
    
  }
 

 }


for (var f = 0; f < todo.length; f++) {
  todo[f]=[todo[f][1],todo[f][2]];
}

return todo;
}



function humedad(valores){
var humedad=[];
var cont = 0;
  for (var i = 0; i < valores.length; i++) {
    cont++;
    if(cont==8){
    humedad[i]=valores[i].getAttribute("value");
    cont=0;
     }
  }
  humedad.unshift(valores[0].getAttribute("value"));
  return humedad.filter(Boolean);

}
function viento(valores){
var viento=[];
var cont = 0;
  for (var i = 0; i < valores.length; i++) {
    cont++;
    if(cont==8){
    viento[i]=valores[i].getAttribute("mps");
    cont=0;
     }
  }
  viento.unshift(valores[0].getAttribute("mps"));
  return viento.filter(Boolean);
}
function presion(valores){

var presion=[];
var cont = 0;
  for (var i = 0; i < valores.length; i++) {
    cont++;
    if(cont==8){
    presion[i]=valores[i].getAttribute("value");
    cont=0;
     }
  }
  presion.unshift(valores[0].getAttribute("value"));
  return presion.filter(Boolean);

}
function icono(valores){
var icono=[];
var cont = 0;
  for (var i = 0; i < valores.length; i++) {
    cont++;
    if(cont==8){
    icono[i]=valores[i].getAttribute("var");
    cont=0;
     }
  }
  icono.unshift(valores[0].getAttribute("var"));
  return icono.filter(Boolean);
} 


function rellenarHtmlDetalle(tiempo,valor){
 
    var borrar = document.getElementById("detallado");
    var todo= document.createElement("div");
    todo.setAttribute("id", "detallado");
    var detTitulo = document.createElement("h1");
    detTitulo.textContent=tiempo.diaHora[valor][0]+ " / " + tiempo.diaHora[valor][2]+"-"+tiempo.diaHora[valor][1];

    var detGradosMax = document.createElement("h1");
    var detGradosMin = document.createElement("h2");
    detGradosMax.textContent=tiempo.grados[valor][0]+"º";
    detGradosMin.textContent=tiempo.grados[valor][1]+"º";

    var detHumedad = document.createElement("h3");
    var detViento = document.createElement("h3");
    var detPresion = document.createElement("h3");
    detHumedad.textContent="Humedad: " + tiempo.humedad[valor] +" % ";
    detViento.textContent="Viento: "+ tiempo.viento[valor] +" Km/H";
    detPresion.textContent="Presion: "+ tiempo.presion[valor] +" hPa";
    
    var detIcono = document.createElement("img");
    var urlIcono =`http://openweathermap.org/img/w/${tiempo.icono[valor]}.png`;
    detIcono.setAttribute("src", urlIcono);
    
    todo.appendChild(detTitulo);
    todo.appendChild(detGradosMax);
    todo.appendChild(detGradosMin);
    todo.appendChild(detHumedad);
    todo.appendChild(detViento);
    todo.appendChild(detPresion);
    todo.appendChild(detIcono);
    
    document.getElementById("detalle").replaceChild(todo, borrar);
  

}