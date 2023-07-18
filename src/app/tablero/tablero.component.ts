import { Component } from '@angular/core';
@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent {
  dados: number[] = [1,2,3,4,5]
  dadosARelanzar: number[]= [];
  dadosVolcados: number[] = []
  puntajeJ1Tablero= [0,0,0,0,0,0,0,0,0,0,0];
  puntajeJ1= [0,0,0,0,0,0,0,0,0,0,0];
  puntajeBot: number[]= [0,0,0,0,0,0,0,0,0,0,0];
  posiblesPuntajes= [0,0,0,0,0,0,0,0,0,0,0];
  puntajeTotalBot=0;
  puntajeTotalJ1=0;
  primeraTiradaJ1=true;
  turnoJ1=true;
  partidaEnCurso=true;
  mensaje = 'Hola tu, lanza los dados!';
  jugadasRealizadas=0;
  botonLanzarDisabled=false;
  setPuntajeDisabled=true;
  lanzarDados() {
    let i = 0;
    const intervalo = setInterval(() => {
      i++;
      for (let i = 0; i < 5; i++) {
        this.dados[i]=(Math.floor(Math.random() * 6) + 1);
      }
      if (i >= 20) {
        clearInterval(intervalo);
      }
    }, 70+i*20);

    console.log("LANZANDO:",this.dados);
  }
  esDormida(){
    const dadosDormida= this.dados.filter(dado=>dado!=this.dados[0]);
    if(dadosDormida.length===0){
      if(this.turnoJ1){
        this.setMensaje('Dormida! Ganaste. Dados iguales al primer lanzamiento ',20);
      }else{
        this.setMensaje('Dormida! Gana el Bot. Dados iguales al primer lanzamiento ',20); 
      }
      this.partidaEnCurso=false;
      return true;
    }
    return false;
  }
  lanzaraNDados(dadosEnMesa: number[]){
    //const dadosARelanzar= 5-dadosEnMesa.length;
    for (let i = 0; i < dadosEnMesa.length; i++) {
        this.dados[i]=dadosEnMesa[i];
    }
    let i = 0;
    const intervalo = setInterval(() => {
      i++;
      for (let i = 0; i < 5-dadosEnMesa.length; i++) {
        this.dados[4-i]=(Math.floor(Math.random() * 6) + 1);
      }
      if (i >= 40) {
        clearInterval(intervalo);
      }
    }, 70);
    console.log("LANZANDO OTRA VEZ:",this.dados);
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
    if(this.setPuntajeDisabled) return;
    if(this.puntajeJ1[posicion]==0  && this.posiblesPuntajes[posicion]!=0){
      this.puntajeJ1[posicion]=this.posiblesPuntajes[posicion];
      this.puntajeJ1Tablero=this.puntajeJ1;
      this.setPuntajeDisabled=true;
      console.log("SE ANOTO",this.puntajeJ1[posicion]);
      this.habilitarBot();
    }
    const posiblesPuntajes= this.posiblesPuntajes.filter(puntaje=>puntaje!=0);
    if(!this.primeraTiradaJ1 &&this.dadosVolcados.length>0 && posiblesPuntajes.length===0 && this.puntajeJ1[posicion]===0){
      //EN UNA FUTURA ACTUALIZACION, SE PUEDE ELIMINAR SOLO SI NO HAY POSIBLES PUNTAJES CON NINGUNA COMBINACION DE DADOS VOLCADOS
      console.log("SE ELIMINA",this.puntajeJ1[posicion]);
      this.puntajeJ1[posicion]=-1;
      this.puntajeJ1Tablero=this.puntajeJ1;
      this.habilitarBot();
    }    
  }
  getDadosEnMesa(){
    const dadosQueSeMantienen=this.dados.slice();
    for(let i=0;i<this.dadosARelanzar.length;i++){
        dadosQueSeMantienen[this.dadosARelanzar[i]]=0;
    }
    return dadosQueSeMantienen.filter(dado=>dado!=0);
  }
  jugarJ1(){
    if(this.primeraTiradaJ1){
      console.log("JUEGA J1 -------------");
      this.primeraTiradaJ1=false;
      this.lanzarDados();
    //  if(this.esDormida()) return;
      this.setPuntajeDisabled=false;
      this.calcularPosiblesPuntajes(1,this.puntajeJ1);
      this.mostrarOpcionesDePuntajeJ1();
      this.setMensaje('Anota tu puntaje o puedes volver a lanzar los dados',30);
      
    }else{
      if(this.turnoJ1 && this.dadosARelanzar.length===0) {this.setMensaje('Primero selecciona los dados a relanzar',17);return;}
      this.lanzaraNDados(this.getDadosEnMesa().slice());
      this.setPuntajeDisabled=true;
      this.botonLanzarDisabled=true;
      this.puntajeJ1Tablero=this.puntajeJ1.slice();
      this.setMensaje('Tienes que volcar uno o dos dados, luego anota',25);
    }
    this.verificarEstadoDelJuego();
  }
  mostrarOpcionesDePuntajeJ1(){
    this.puntajeJ1Tablero=this.posiblesPuntajes.slice();
    for(let i=0;i<11;i++){
      if(this.puntajeJ1[i]!==0){
        this.puntajeJ1Tablero[i]=this.puntajeJ1[i];
      }
    }
  }
  seleccionarDados(posDado:number){
    if(!this.turnoJ1 && !this.primeraTiradaJ1) return;    
    this.seleccionarDadosARelanzarJ1(posDado);
    this.volcarDadosJ1(posDado);
    
  }
  volcarDadosJ1(posDado:number){
    if(!this.botonLanzarDisabled) return;
    if(this.dadosVolcados.includes(posDado)){
      this.dadosVolcados=this.dadosVolcados.filter((dado) => dado !== posDado);
      console.log("DESVOLCANDO",this.dados[posDado]);
      this.dados[posDado]=7-this.dados[posDado];
    }else{
      if(this.dadosVolcados.length===2) return;
      this.dadosVolcados.push(posDado);
      console.log("VOLCANDO",this.dados[posDado]);
      this.dados[posDado]=7-this.dados[posDado];

      const posiblesPuntajes= this.posiblesPuntajes.filter(puntaje=>puntaje!=0);
      if(posiblesPuntajes.length===0){
        this.setMensaje('Si no puedes anotar nada, elimina una casilla vacia',20);
      }
    }
    if(this.dadosVolcados.length>0){
      this.calcularPosiblesPuntajes(2,this.puntajeJ1);
      this.mostrarOpcionesDePuntajeJ1();
      this.setPuntajeDisabled=false;
    }else{
      this.puntajeJ1Tablero=this.puntajeJ1;
      this.setPuntajeDisabled=false;
      this.setMensaje('Vuelca uno o dos dados, luego anota',20);
    }
    
  }
  seleccionarDadosARelanzarJ1(posDado:number){
    if(this.botonLanzarDisabled) return;
    if(this.dadosARelanzar.includes(posDado)){
      this.dadosARelanzar=this.dadosARelanzar.filter((dado) => dado !== posDado);
    }else{
      this.dadosARelanzar.push(posDado);
    } 
    let mensaje='Lanzar ';//mensaje para el usuario
    for(let i=0;i<this.dadosARelanzar.length;i++){//mensaje para el usuario
      mensaje+=" "+this.dados[this.dadosARelanzar[i]];
    }
    this.setMensaje(mensaje, 10);  
  }
  habilitarJ1(){
    if(this.partidaEnCurso){
    this.setMensaje('Es tu turno, lanza los dados',30);
    this.botonLanzarDisabled=false;
    this.primeraTiradaJ1=true;
    this.dadosARelanzar=[];
    this.dadosVolcados=[];
    this.turnoJ1=true;
    }
  }
  habilitarBot(){
    this.turnoJ1=false;
    this.jugarBot3();
  }
  calcularPosiblesPuntajes(lanzamiento: number,puntajesActuales:number[]){
    for (let i = 0; i <6; i++) {
      this.posiblesPuntajes[i]=this.calcularNumerosRepetidos(i+1)*(i+1);
    }
    this.posiblesPuntajes[9]=this.calcularGrande();
    this.posiblesPuntajes[10]=this.calcularGrande();
    this.posiblesPuntajes[6]=this.calcularEscalera(lanzamiento);
    this.posiblesPuntajes[7]=this.calcularFull(lanzamiento);
    this.posiblesPuntajes[8]=this.calcularPoker(lanzamiento);
    for (let i = 0; i <11; i++) {
      if(puntajesActuales[i]>0) this.posiblesPuntajes[i]=0;//si el puntaje existe se elimina poniendo 0
    }
  }
  calcularFull(lanzamiento: number){
    const dados2 = this.dados.slice();dados2.sort();
    if(this.calcularNumerosRepetidos(dados2[0])*this.calcularNumerosRepetidos(dados2[4])===6 && lanzamiento===1)return 35;
    if(this.calcularNumerosRepetidos(dados2[0])*this.calcularNumerosRepetidos(dados2[4])===6)return 30;
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
  calcularGrande(){
    let dados2 = this.dados.slice();
    dados2=dados2.filter((element) => element !=this.dados[0]);
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
  verificarEstadoDelJuego(){
    this.calcularTotales();
    if(this.jugadasRealizadas===11){
      this.terminarPartidaPorPuntos();
    }
  }
  terminarPartidaPorPuntos(){
    this.partidaEnCurso=false;
    this.setMensaje('Termino la partida',20);
    console.log("TERMINO LA PARTIDA"); // los botones se desactivan
  }
  setMensaje(estado: string, velocidad: number) {
    this.mensaje = " ";
    let i = 0;
    const intervalo = setInterval(() => {
      this.mensaje += estado[i];
      i++;
      if (i >= estado.length) {
        clearInterval(intervalo);
      }
    }, velocidad);
  }

  //________________________________________________________________________________________________________InicioBot
  async jugarBot3(){
    let i=0;
    const intervalobot = setInterval(() => {
      i++;
      if (i >= 2) {
        this.botonLanzarDisabled=true;
        console.log("JUEGA BOT -------------");
        this.jugadasRealizadas++;
        this.setMensaje('Mi turno', 30);



        let j = 0;
        const intervalo1 = setInterval(() => {
          j++;
          if (j == 0){this.lanzarDados()};
          if (j >= 5) {
            //if(this.esDormida()) return;
            this.calcularPosiblesPuntajes(1,this.puntajeBot);
            const posMejorPuntaje=this.elegirMejorPuntajeBot();
            if(posMejorPuntaje!=404){
              if(this.posiblesPuntajes[posMejorPuntaje]>=20){
                this.puntajeBot[posMejorPuntaje]=this.posiblesPuntajes[posMejorPuntaje];
                console.log("SE ANOTO",this.puntajeBot[posMejorPuntaje]);
                console.log("--",this.puntajeBot);
                this.setMensaje('Anoto '+ this.puntajeBot[posMejorPuntaje], 30);
              }else{
                this.setMensaje('Vuelvo a lanzar', 30);;
                this.lanzarDadosSegundaVez();
              }
            }else{
              this.setMensaje('Vuelvo a lanzar', 30);
              this.lanzarDadosSegundaVez();
            }    
            this.verificarEstadoDelJuego();
            this.habilitarJ1();
            clearInterval(intervalo1);
          }
        }, 1000);







        
        clearInterval(intervalobot);
      }
    }, 1000);

    

  }
  async lanzarDadosSegundaVez(){
    const res=this.elegirDadosARelanzar();
    this.lanzaraNDados(res);
    this.setMensaje('Vuelco dados', 30);
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
