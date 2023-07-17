import { Component } from '@angular/core';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent {
  dados: number[] = []
  dadosARelanzar: number[] = []
  puntajeJ1Tablero= [0,0,0,0,0,0,0,0,0,0,0];
  puntajeJ1= [0,0,0,0,0,0,0,0,0,0,0];
  puntajeBot: number[]= [0,0,0,0,0,0,0,0,0,0,0];
  posiblesPuntajes= [0,0,0,0,0,0,0,0,0,0,0];
  puntajeTotalBot=0;
  puntajeTotalJ1=0;
  primeraTiradaJ1=true;
  turnoJ1=true;
  partidaEnCurso=true;
  estado = 'Empecemos';
  jugadasRealizadas=0;
  lanzarDados() {
    this.dados = [];
    for (let i = 0; i < 5; i++) {
      this.dados.push(Math.floor(Math.random() * 6) + 1);
    }
  }
  lanzaraNDados(dadosEnMesa: number[]){
    if(this.turnoJ1 && this.dadosARelanzar.length===0) return;
    const dadosARelanzar= 5-dadosEnMesa.length;
    for (let i = 0; i < dadosARelanzar; i++) {
      dadosEnMesa.push(Math.floor(Math.random() * 6) + 1);
    }
    this.dados=dadosEnMesa;
  }
  borrarUnaCasilla(esJ1:boolean){
    if(esJ1){
     this.puntajeJ1[this.buscarCasillaConMenorValor(this.puntajeJ1)]=-1;
    }else{
     this.puntajeBot[this.buscarCasillaConMenorValor(this.puntajeBot)]=-1;
    }
   }
  buscarCasillaConMenorValor(puntaje: number[]){
    for(let i=0;i<11;i++){
      if(puntaje[i]===0){return i;}
    }
    return -1;
  }
  anotarPuntajeJ1(posicion: number){
    if(this.puntajeJ1[posicion]==0){
      this.puntajeJ1[posicion]=this.posiblesPuntajes[posicion];
      this.puntajeJ1Tablero=this.puntajeJ1;
    }
  }

  jugarJ1(){
    if(this.primeraTiradaJ1){this.lanzarDados();}else{this.lanzaraNDados(this.dadosARelanzar);}
    this.calcularPosiblesPuntajes(1,this.puntajeJ1);
    this.estado='Anota o selecciona los dados a relanzar';
    this.puntajeJ1Tablero=this.posiblesPuntajes.slice();
    // this.dados=[4,4,6,6,1];
    // this.calcularPosiblesPuntajes(2,this.puntajeBot)
    // console.log("PUNTAJE",this.elegirMejorPuntajePorImpacto());
    //this.lanzarDados();
    //console.log(this.a());
    // const x=this.c([2,2,2,4]);
    // console.log(x,"-----------------");
    // x.forEach(element => {console.log(element,this.esBuenaJugadaBot(element));});
      
    
    // 
    // console.log(this.esBuenaJugadaBot(this.dados));

    // this.puntajeJ1;
     //this.lanzarDados();
    // this.calcularPosiblesPuntajes(this.puntajeJ1.slice());
    // this.puntajeJ1Tablero=this.posiblesPuntajes.slice();
    // this.posiblesPuntajes;
  }
  seleccionarDados(posDado:number){
    if(!this.turnoJ1) return;
    this.seleccionarDadosARelanzar(posDado);
    
    
  }
  seleccionarDadosARelanzar(posDado:number){
      this.primeraTiradaJ1=false;
      if(this.dadosARelanzar.includes(posDado)) return;
      this.dadosARelanzar.push(posDado);
      this.estado='Seleccionaste';
      for(let i=0;i<this.dadosARelanzar.length;i++){
        this.estado+=" "+this.dados[this.dadosARelanzar[i]];
      }     
  }
  calcularPosiblesPuntajes(lanzamiento: number,puntajesActuales:number[]){
    for (let i = 0; i <6; i++) {
      this.posiblesPuntajes[i]=this.calcularNumerosRepetidos(i+1)*(i+1);
    }
    this.posiblesPuntajes[9]=this.calcularGrandeODormida(lanzamiento);
    this.posiblesPuntajes[10]=this.calcularGrandeODormida(lanzamiento);
    this.posiblesPuntajes[6]=this.calcularEscalera(lanzamiento);
    this.posiblesPuntajes[7]=this.calcularFull(lanzamiento);
    this.posiblesPuntajes[8]=this.calcularPoker(lanzamiento);
    for (let i = 0; i <11; i++) {
      if(puntajesActuales[i]>0) this.posiblesPuntajes[i]=0;//si el puntaje existe se elimina poniendo 0
    }
  }
  calcularFull(lanzamiento: number){
    const dados2 = this.dados.slice();dados2.sort();
    if(this.calcularNumerosRepetidos(dados2[0])+this.calcularNumerosRepetidos(dados2[4])===5 && lanzamiento===1)return 35;
    if(this.calcularNumerosRepetidos(dados2[0])+this.calcularNumerosRepetidos(dados2[4])===5)return 30;
    return 0;
  }
  calcularPoker(lanzamiento: number){
    const dados2 = this.dados.slice();dados2.sort();
    if(this.calcularNumerosRepetidos(dados2[0])===4||this.calcularNumerosRepetidos(dados2[4])===4 && lanzamiento===1)return 45;
    if(this.calcularNumerosRepetidos(dados2[0])===4||this.calcularNumerosRepetidos(dados2[4])===4)return 40;
    return 0;
  }
  calcularEscalera(lanzamiento: number){
    const dados2 = this.dados.slice();dados2.sort();
    if(dados2[0]==1 && dados2[4]==6){dados2[0]=7;dados2.sort();}
    if(dados2[4]===dados2[3]+1 && dados2[3]===dados2[2]+1 && dados2[2]===dados2[1]+1 && dados2[1]===dados2[0]+1 && this.puntajeBot[6]===0  && lanzamiento===1){return 25};
    if(dados2[4]===dados2[3]+1 && dados2[3]===dados2[2]+1 && dados2[2]===dados2[1]+1 && dados2[1]===dados2[0]+1 && this.puntajeBot[6]===0){return 20};
    return 0;
  }
  calcularGrandeODormida(lanzamiento: number){
    let dados2 = this.dados.slice();
    dados2=dados2.filter((element) => element !=this.dados[0]);
    if(dados2.length==0 && lanzamiento==1 ){
      console.log("DORMIDA, GANA LA PARTIDA");//GANA LA PARTIDA
    }
    return dados2.length===0?50:0;
  }
  calcularNumerosRepetidos(numero: number): number {
    let numerosIguales = 0;
    for (let i = 0; i < 5; i++) {
      if(this.dados[i]==numero){
        numerosIguales=numerosIguales+1;
      }
    }
    return numerosIguales;
  }
  calcularTotales(){
    this.puntajeTotalBot=0;
    this.puntajeTotalJ1=0;
    for (let i = 0; i < 11; i++) {
      if(this.puntajeBot[i]!>0)
      this.puntajeTotalBot+=this.puntajeBot[i];
      if(this.puntajeJ1[i]!>0)
      this.puntajeTotalJ1+=this.puntajeJ1[i];
    }
  }
  actualizarEstado(){
    this.calcularTotales();
    if(this.jugadasRealizadas===11){
      this.terminarPartida();
    }
  }
  terminarPartida(){
    this.partidaEnCurso=false;
    console.log("TERMINO LA PARTIDA"); // los botones se desactivan
  }
  //________________________________________________________________________________________________________InicioBot
  jugarBot3(){
    console.log("JUEGA BOT -------------------------");
    this.jugadasRealizadas++;
    this.lanzarDados();
    console.log("LANZANDO:",this.dados);
    this.calcularPosiblesPuntajes(1,this.puntajeBot);
    const posMejorPuntaje=this.elegirMejorPuntajeBot();
    if(posMejorPuntaje!=404){
      if(this.posiblesPuntajes[posMejorPuntaje]>=20){
        this.puntajeBot[posMejorPuntaje]=this.posiblesPuntajes[posMejorPuntaje];
        console.log("SE ANOTO",this.puntajeBot[posMejorPuntaje]);
        console.log("--",this.puntajeBot);
      }else{this.lanzarDadosSegundaVez();}
    }else{
      this.lanzarDadosSegundaVez();
    }    
    this.actualizarEstado();
  }
  lanzarDadosSegundaVez(){
    const res=this.elegirDadosARelanzar();
    //console.log("SE QUEDA",res);//PRUEBA
    this.lanzaraNDados(res);
    console.log("VOLVIENDO A LANZAR:",this.dados);
    this.volcarDadosBot();
    console.log("VOLCANDO:",this.dados);
    this.calcularPosiblesPuntajes(2,this.puntajeBot);
    const posMejorPuntajeImpacto =this.elegirMejorPuntajePorImpacto();
    if(posMejorPuntajeImpacto!=99){
      this.puntajeBot[posMejorPuntajeImpacto]=this.posiblesPuntajes[posMejorPuntajeImpacto];
      console.log("SE ANOTO",this.puntajeBot[posMejorPuntajeImpacto]);
    }else{
      console.log("NO SE PUEDE ANOTAR. SE BORRA",);
      this.borrarUnaCasilla(false);
    }
  }
  elegirDadosARelanzar(): number[] {//ese es el que hay que usar
    const diceValues = this.dados; // Posibles valores de los dados
    const combinations: number[][] = [];
    for (let i = 1; i < 31; i++) {
      const combination = diceValues.filter((_, index) => (i >> index) & 1);//los dados que seran relanzados
      const res =this.calcularCombinaciones(combination)
      let puntaje:number=0;
      let casosFavorables:number=0;
      res.forEach(element => {
          if(this.esBuenaJugadaBot(element)>0) casosFavorables++;//
          puntaje=puntaje+this.combinacionVolcandoUnDado(element)
      });
      if(casosFavorables>0){
        combination.push((puntaje/res.length));
        combinations.push(combination);
      }
      
    }
    //console.log("B COMBINACIONES",combinations);
    return this.elegirMejorCombinacion(combinations);
  }
  calcularCombinaciones(dadosMesa: number[]): number[][] {
    const numDice=5-dadosMesa.length;
    const diceValues = [1, 2, 3, 4, 5, 6];
    return Array.from({ length: Math.pow(diceValues.length, numDice) }, (_, i) =>
      Array.from({ length: numDice }, (_, j) => diceValues[Math.floor(i / Math.pow(diceValues.length, j)) % diceValues.length]).concat(dadosMesa)
    );
  }
  combinacionVolcandoUnDado(dados: number[]){
    let puntaje:number=0;
    for (let i = 0; i < dados.length; i++) {
      const dadoVolcado=dados.slice();
      dadoVolcado[i]=7-dadoVolcado[i];
      puntaje=puntaje+this.esBuenaJugadaBot(dadoVolcado);
    }
    return puntaje;
  }
  elegirMejorCombinacion(posiblesJugadas: number[][]){
    let maximo=0;
    for(let i=0;i<posiblesJugadas.length;i++){
      if(posiblesJugadas[i][posiblesJugadas[i].length-1]>posiblesJugadas[maximo][posiblesJugadas[maximo].length-1]){
        maximo=i;
      }
    }
    return posiblesJugadas[maximo].slice(0, -1);
  }
  esBuenaJugadaBot(dados: number[]){//para posbile 2do lanzamiento
    let dados2 = dados.slice();dados2.sort();
    if(dados2[0]==dados2[1] && dados2[2]==dados2[3] && dados2[4]==dados2[0] && dados2[4]==dados2[2] && (this.puntajeBot[10]===0 || this.puntajeBot[9]===0)){return 70};//GRANDE
    if(dados2[1]==dados2[2] && dados2[1]==dados2[3] && (dados2[0]==dados2[1] || dados2[1]==dados2[4]) && this.puntajeBot[8]===0 ){return 60};//POKER 
    if(dados2[0]==dados2[1] && dados2[3]==dados2[4] && dados2[0]!=dados2[4] && (dados2[2]==dados2[1] || dados2[2]==dados2[3]) && this.puntajeBot[7]===0){return 40};//FULL

    if(dados2[0]==1 && dados2[4]==6){dados2[0]=7}
    if(dados2[4]===dados2[3]+1 && dados2[3]===dados2[2]+1 && dados2[2]===dados2[1]+1 && dados2[1]===dados2[0]+1 && this.puntajeBot[6]===0){return 20};//ESCALERA
    dados2 = dados.slice();dados2.sort();
  
    for(let i=0;i<6;i++){
      const dados2 = dados.filter((element) => element !==dados[i]);
      if(this.puntajeBot[dados[i]-1]===0){return dados[i]*(5-dados2.length)}
    }
    
    return 0;
  }
  volcarDadosBot(){
    const unDado=this.puntajeUnDado();
    const dosDados=this.puntajeDosDados();
    //console.log("para un dado",unDado); 
   // console.log("para dos dados",dosDados);
    if(unDado[0]>=dosDados[0]){
      this.dados[unDado[1]]=7-this.dados[unDado[1]];
    }else{
      this.dados[dosDados[1]]=7-this.dados[dosDados[1]];
      this.dados[dosDados[2]]=7-this.dados[dosDados[2]];
    }
  }
  puntajeUnDado(){
    let maximoPuntaje=0;
    let posicionDado=0;
    for(let i=0;i<this.dados.length;i++){
      const dados2 = this.dados.slice();
      dados2[i]=7-dados2[i];
      const puntaje=this.getMaximoPuntajeBot(dados2);
      if(puntaje>maximoPuntaje){
        maximoPuntaje=puntaje;
        posicionDado=i;
      }
    }
    return [maximoPuntaje, posicionDado];
  }
  puntajeDosDados(){
    let maximoPuntaje=0;
    let posicionDado1=0;
    let posicionDado2=0;
    for(let i=0;i<this.dados.length;i++){
      for(let j=i+1;j<this.dados.length;j++){
        const dados2 = this.dados.slice();
        dados2[i]=7-dados2[i];dados2[j]=7-dados2[j];
        const puntaje=this.getMaximoPuntajeBot(dados2);
        if(puntaje>maximoPuntaje){
          maximoPuntaje=puntaje;
          posicionDado1=i;posicionDado2=j;
        }
      }
    }
    return [maximoPuntaje, posicionDado1, posicionDado2];
  }
  
  getMaximoPuntajeBot(dados: number[]){//para volcar dados
    let dados2 = dados.slice();dados2.sort();
    if(dados2[0]==dados2[1] && dados2[2]==dados2[3] && dados2[4]==dados2[0] && dados2[4]==dados2[2] && (this.puntajeBot[10]===0 || this.puntajeBot[9]===0)){return 50};//GRANDE
    if(dados2[1]==dados2[2] && dados2[1]==dados2[3] && (dados2[0]==dados2[1] || dados2[1]==dados2[4]) && this.puntajeBot[8]===0 ){return 40};//POKER 
    if(dados2[0]==dados2[1] && dados2[3]==dados2[4] && dados2[0]!=dados2[4] && (dados2[2]==dados2[1] || dados2[2]==dados2[3]) && this.puntajeBot[7]===0){return 30};//FULL

    if(dados2[0]==1 && dados2[4]==6){dados2[0]=7}
    if(dados2[4]===dados2[3]+1 && dados2[3]===dados2[2]+1 && dados2[2]===dados2[1]+1 && dados2[1]===dados2[0]+1 && this.puntajeBot[6]===0){return 20};//ESCALERA
    dados2 = dados.slice();dados2.sort();

    for(let i=0;i<6;i++){
      const dados2 = dados.filter((element) => element !==dados[i]);
      if(this.puntajeBot[dados[i]-1]===0){return dados[i]*(5-dados2.length)}
    }    
    return 0;
  }
  elegirMejorPuntajeBot(){ 
    let posMejorPuntaje=0;
    for (let i = 0; i < 11; i++) {
      if(this.posiblesPuntajes[i]>this.posiblesPuntajes[posMejorPuntaje] && this.puntajeBot[i]===0) {posMejorPuntaje=i;}
    }
    if(this.puntajeBot[posMejorPuntaje]>0){return 404;}
    return posMejorPuntaje;
  }
  elegirMejorPuntajePorImpacto(){
    const posiblesPuntajesImpacto=this.posiblesPuntajes.slice();
   //console.log("POSIBLES PUNTAJES ANTES",posiblesPuntajesImpacto);
    for(let i=0;i<6;i++){//se llenan los puntajes segun su repeticion
      posiblesPuntajesImpacto[i]=posiblesPuntajesImpacto[i]/(i+1)*4*this.x(this.posiblesPuntajes[i]/(i+1),i+1);;
    }
    let posMejorPuntaje=0;
    for (let i = 0; i < 11; i++) {
      if(posiblesPuntajesImpacto[i]>posiblesPuntajesImpacto[posMejorPuntaje] && this.puntajeBot[i]===0) {posMejorPuntaje=i;}
    }
    //console.log("POSIBLES PUNTAJES POR IMPACTO",posiblesPuntajesImpacto);
    if(this.puntajeBot[posMejorPuntaje]>0 || this.posiblesPuntajes[posMejorPuntaje]==0){ return 99;}
    return posMejorPuntaje;
  }
  x(repetidos:number, numero:number){
    if(numero===6 && repetidos<=2){return 0.5}
    if(numero===5 && repetidos<=2){return 0.5}
    if(numero===4 && repetidos<=2){return 0.5}
    return 1;
  }
  //_____________________________________________________________________________Bot final


}
