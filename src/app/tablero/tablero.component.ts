import { Component } from '@angular/core';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent {
  dados: number[] = []
  puntajeJ1Tablero= [0,0,0,0,0,0,0,0,0,0,0];
  estado = 'Empecemos';
  puntajeJ1= [0,0,0,0,0,0,0,0,0,0,0];
  puntajeBot: number[]= [0,0,0,0,0,0,0,0,0,0,0];
  posiblesPuntajes= [0,0,0,0,0,0,0,0,0,0,0];
  
  lanzarDados() {
    this.dados = [];
    for (let i = 0; i < 5; i++) {
      this.dados.push(Math.floor(Math.random() * 6) + 1);
    }
    //this.dados=[1, 2, 3, 4, 5]//hardcodeo
   //this.posiblesDadosARelanzar();
  }
  jugarBot(){
    this.lanzarDados();
    this.calcularPosiblesPuntajes(this.puntajeBot.slice());
    console.log("POSIBLES PUNTAJES BOT",this.posiblesPuntajes);
    const mejorPuntaje=this.elegirMejorPuntajeBot();
    console.log("MEJOR PUNTAJE",this.posiblesPuntajes[mejorPuntaje]);
    this.puntajeBot[mejorPuntaje]=this.posiblesPuntajes[mejorPuntaje];
    console.log("SE ANOTO",this.puntajeBot[mejorPuntaje]);
  }
  jugarBot2(){
    this.lanzarDados();

    const res=this.posiblesDadosARelanzar();
    
    console.log("A LANZAMIENTO 1:",this.dados);//PRUEBA

    this.calcularPosiblesPuntajes(this.puntajeBot.slice());
    console.log("A POSIBLES PUNTAJES BOT 1er",this.posiblesPuntajes);
    const mejorPuntajeA=this.elegirMejorPuntajeBot();
    console.log("A MEJOR PUNTAJE",this.posiblesPuntajes[mejorPuntajeA]);

    console.log("B RECOMIENDA RELANZAR POSICIONES:",res);//PRUEBA
    this.lanzarDadosSegundaVez(res);
    console.log("B LANZAMIENTO 2:",this.dados);//PRUEBA
    this.calcularPosiblesPuntajes(this.puntajeBot.slice());
    const mejorPuntajeB=this.elegirMejorPuntajeBot();
    console.log("B MEJOR PUNTAJE",this.posiblesPuntajes[mejorPuntajeB]);

    this.puntajeBot[mejorPuntajeB]=this.posiblesPuntajes[mejorPuntajeB];
    console.log("SE ANOTO",this.puntajeBot[mejorPuntajeB]);


  
  }
  lanzarDadosSegundaVez(posiciones: number[]){
    for (let i = 0; i < posiciones.length; i++) {
      this.dados[posiciones[i]]=Math.floor(Math.random() * 6) + 1;
    }
  }
  elegirMejorPuntajeBot(){ 
    let mejorPuntaje=0;
    for (let i = 0; i < 11; i++) {
      if(this.posiblesPuntajes[i]>this.posiblesPuntajes[mejorPuntaje] && this.puntajeBot[i]===0) {mejorPuntaje=i;}
    }
    return mejorPuntaje;
  }
  posiblesDadosARelanzar(){//ya no toma en cuenta 0 dados. las 32 combinaciones de relanzar 1 hasta 4 dados
    let posARelanzar: number[] = [];//Se guarda la posicion del dado que se va a relanzar finalmente
    let maxProbabilidad=0;
    for (let i = 1; i < 31; i++) {
      let temporal = [];
      let dados2 = this.dados.slice();
      for (let j = 0; j < 5; j++) {
        if (i & (1 << j)) {
          temporal.push(j);//Se guarda la posicion del dado que se va a relanzar iterando
          dados2[j] = 0;//se pone en 0 el dado que se va a relanzar
        }
      }
      dados2 = dados2.filter((e) => e !== 0);
      const res=this.dadosARelanzar(dados2);
      if(res[1]/res[0]*100>maxProbabilidad){
        maxProbabilidad=res[1]/res[0]*100; 
        posARelanzar=temporal.slice();
      }

     // if(res[1]!=0)console.log(i,"opcion ",dados2,"casosFavorables:",res[1]/res[0]*100);
      
    }
    return posARelanzar;
  }
  dadosARelanzar(dados: number[]): number[] {//combina los nuevos dados lanzados con los dados en mesa
    let casosPosibles = 0;
    let casosfavorables=0;
    let combinaciones: number[][] = [];
    const numDice = 5-dados.length;
    const diceValues = [1, 2, 3, 4, 5, 6]; // Posibles valores de los dados
    const generateCombinations = (currentCombination: number[] = [], currentIndex: number = 0) => {
      if (currentCombination.length === numDice) {
        casosPosibles=casosPosibles+5;
        casosfavorables= casosfavorables+this.volcarUnDado(dados.concat(currentCombination));//favorable
       // combinaciones = combinaciones.concat(this.volcarUnDado(dados.concat(currentCombination)));
       
        return;
      }
      for (let i = currentIndex; i < diceValues.length; i++) {
        generateCombinations([...currentCombination, diceValues[i]], i);
      }
    };
    generateCombinations();
    //return combinaciones.length;
    return [casosPosibles,casosfavorables];
  }
  volcarUnDado(dados: number[]){//vuelca un dado 
    let favorable=0;
    const combinaciones: number[][] = [];
   // combinaciones.push(dados);//tal vez no sea necesario??? por que si o si se va a volcar 1 dado
    for (let i = 0; i < 5; i++) {
      const dados2 = dados.slice();
      dados2[i]=7-dados2[i];
      //combinaciones.push(dados2);//enviar a esbuenajugada
      if(this.esBuenaJugadaBot(dados2)){favorable=favorable+1};//favorable
    }
    return favorable;//favorable
  }
  esBuenaJugadaBot(dados: number[]){
    const dados2 = dados.slice();dados2.sort();
   // console.log(dados2)
   // console.log(this.calcularNumerosRepetidos(dados2[0]))
   // console.log(this.calcularNumerosRepetidos(dados2[4]))
  

    // for(let i=0;i<5;i++){//TAL VEZ CON SOLO ESTE ES SUFUCIENTE >=3 (se podria subir a 4)
    //   if(this.calcularNumerosRepetidos(dados2[i])>=3 && this.puntajeBot[dados2[i]-1]===0){console.log(dados);return true};//1,2,3,4,5,6
    // }

    
   if(dados2[4]===dados2[3]+1 && dados2[3]===dados2[2]+1 && dados2[2]===dados2[1]+1 && dados2[1]===dados2[0]+1 && this.puntajeBot[6]===0){return true};//ESCALERA
    if(dados2[0]==dados2[1] && dados2[3]==dados2[4] && dados2[0]!=dados2[4] && (dados2[2]==dados2[1] || dados2[2]==dados2[3]) && this.puntajeBot[7]===0){return true};//FULL
    if(dados2[1]==dados2[2] && dados2[1]==dados2[3] && (dados2[0]==dados2[1] || dados2[1]==dados2[4]) ){return true};//POKER 
    return false;
  }
  anotarPuntajeJ1(posicion: number){
    if(this.puntajeJ1[posicion]==0){
      this.puntajeJ1[posicion]=this.posiblesPuntajes[posicion];
      this.puntajeJ1Tablero=this.puntajeJ1;
    }
    this.jugarBot();////////////
  }
  jugarJ1(){
    this.jugarBot2();
    // this.puntajeJ1;
     //this.lanzarDados();
    // this.calcularPosiblesPuntajes(this.puntajeJ1.slice());
    // this.puntajeJ1Tablero=this.posiblesPuntajes.slice();
    // this.posiblesPuntajes;
  }
  calcularPosiblesPuntajes(arreglo: number[]){
    for (let i = 0; i <6; i++) {
      this.posiblesPuntajes[i]=this.calcularNumerosRepetidos(i+1)*(i+1);
    }
    this.posiblesPuntajes[6]=this.calcularEscalera();
    this.posiblesPuntajes[7]=this.calcularFull();
    this.posiblesPuntajes[8]=this.calcularPoker();
    for (let i = 0; i <11; i++) {
      if(arreglo[i]!==0) this.posiblesPuntajes[i]=arreglo[i];
    }
  }
  calcularFull(){
    const dados2 = this.dados.slice();dados2.sort();
    return this.calcularNumerosRepetidos(dados2[0])+this.calcularNumerosRepetidos(dados2[4])===5?35:0;
  }
  calcularPoker(){
    const dados2 = this.dados.slice();dados2.sort();
    return this.calcularNumerosRepetidos(dados2[0])===4||this.calcularNumerosRepetidos(dados2[4])===4?45:0;
  }
  calcularEscalera(){
    const dados2 = this.dados.slice();dados2.sort();
    let escalera=0;
    for (let i = 0; i < 4; i++) {
      if(dados2[i]+1===dados2[i+1]){
        escalera++;
      }
    }
    return escalera===4?25:0;
  }
  calcularNumerosRepetidos(numero: number): number {
    // console.log(this.dados)
    // console.log("repetidos",numero)
    let numerosIguales = 0;
    // this.dados.forEach((elemento) => {
    //   if (elemento === numero) {
    //     numerosIguales=numerosIguales+1;
    //   }
    // });
    for (let i = 0; i < 5; i++) {
      if(this.dados[i]==numero){
        numerosIguales=numerosIguales+1;
      }
    }
    return numerosIguales;
  }
}
