import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  users: Users
  columns = ['name', 'email', 'gender', 'height']

  constructor(public usersService: UsersService) {
    this.getAllUsers();

  }

  ngOnInit() {

    //ALGUNS TESTES COM O ES6
    var qqcoisa = true;

    if (qqcoisa) {
      let nome = 'Thiago'
      var teste = 'Thiago'
      console.log(nome)
    }

    // Variavel tipo var é visivel fora do bloco, já tipo let é visível apenas dentro do bloco.
    // console.log(nome);
    console.log(teste)
    console.log(qqcoisa)

    //Itera sobre o array e retorna cada item multiplicado por 3
    var meuArray = [1, 2, 3]
    let novo = meuArray.map((n) => n * 3)
    console.log('map ', novo)

    //Itera sobre o array e retorna apenas os que contem o valor a ser filtrado.
    var meuArray2 = ['joca', 'noca', 'beca']
    let novo2 = meuArray2.filter((no) => no.includes('o'))
    console.log('filter ',novo2)


    //Itera sobre o array e retorna cada item multiplicado por 3
    var meuArray3 = [1, 2, 3]
    let novo3 = meuArray3.reduce((acumulador, num) => acumulador + num)
    console.log('reduce ',novo3)

    //Variáveis em TypeScript
    let nomes: string = '2'

    // arrays em TypeScript
    let lista: number[] = [1, 2, 3, 4]

    // ou
    let listaGenerics: Array<number> = [1, 2, 3, 4]

    //Classes podem ser escritas em ts tal qual em java ou php
    class Pessoa{
      nome: string

      constructor(nome: string){
        this.nome = nome
      }

      disOla(){
        return "Olá, " + this.nome
      }
    }

    let testClass = new Pessoa('Thiago')

    let mensagem = testClass.disOla();

    console.log(mensagem)

    //Array de classes do tipo pessoa
    let arrayPessoas: Pessoa[] = new Array()

    let joao = new Pessoa('João')
    arrayPessoas.push(joao)

    let clara = new Pessoa('Clara')
    arrayPessoas.push(clara)

    console.log(arrayPessoas)

    //Uso de Any em ts
    let qqCoisa: any = [true, "Teste", 1, joao]
    console.log(qqCoisa)

    //Parametros opcionais

    //Paramentros com dois tipos

    

  }

  // postDiag(){
  //   this.usersService.postDiag().subscribe((res) =>{
  //       console.log(res)
  //   })
  // }

  getAllUsers() {
    this.usersService.getAll().subscribe((users) => {
      this.users = users.users;
      console.log(this.users)
    });
  }
}
