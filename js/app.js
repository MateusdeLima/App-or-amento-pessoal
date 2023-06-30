/*Primeiro passo vai ser dar função ao botão cadastrar despesa que tem um
sinal de + que irá regatar os dados dos campos digitados.*/

//Criando uma classe para poder representar o objeto despesa no nosso projeto.

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }

}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)        
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    //Acessando o local Storage que nda mais é um banco de dados do próprio browser para armazenar alguns dados
    gravar(d) {
        //transformando o objeto literal em uma notação JSON
        
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        //Array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //Recuperar todas as despesas em localStorage
        for(let i = 1; i <= id; i++){
            //Recuperar a despesa

            //Em operação inversa do stringify o parse transforma o objeto JSON em objeto literal assim conseguimos utiliza-los 
            let despesa = JSON.parse(localStorage.getItem(i))

            //Existe a possibilidade de de haver indices que foram pulados/removidos
            //Neste casos nós vamos pular esses indices.

            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)

        }
        return despesas

    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        console.log(despesa)
        console.log(despesasFiltradas)

        //ano
        if(despesa.ano != ''){
            console.log('Filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ''){
            console.log('Filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ''){
            console.log('Filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            console.log('Filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if(despesa.descricao != ''){
            console.log('Filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            console.log('Filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }

}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    
    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )
    
    if(despesa.validarDados()) {
        bd.gravar(despesa)
        document.getElementById('modal_Dinamico').innerHTML = 'Registro inserido com sucesso!'
        document.getElementById('modal_Dinamico_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso!'
        document.getElementById('modal_button').innerHTML = 'Voltar'
        document.getElementById('modal_button').className = 'btn btn-success'
        //diolog de sucesso
        $('#registraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

        
    }else {

        document.getElementById('modal_Dinamico').innerHTML = 'Erro na inclusão do registro!'
        document.getElementById('modal_Dinamico_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos!'
        document.getElementById('modal_button').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_button').className = 'btn btn-danger'
        
        //diolog de erro
        $('#registraDespesa').modal('show')
        
    }
}

function carregaListaDespesas( despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
	    despesas = bd.recuperarTodosRegistros()
    } 

    //selecionando o elemento tboby da tabela
	let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''

    /*

	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>

	*/
    //Percorrer o array, listanto cada despesa de forma dinâmica
	despesas.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor
        //Criando o botão exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //Remover a despesa
            let id = this.id.replace('id_despesa_', '')
            //alert(id)
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)
        
	})

 }

 //Trabalhando com os botões consulta 
 function pesquisarDespesa() {  
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)


    
   this.carregaListaDespesas(despesas, true)

   // Cálculo do total gasto
   var totalGasto = calcularTotalGasto();
   // Atualiza o valor na tabela
   document.getElementById("totalGasto").textContent = totalGasto;
 }

 function calcularTotalGasto() {
   var despesas = document.getElementById("listaDespesas").getElementsByTagName("tr");
   var total = 0;
   for (var i = 0; i < despesas.length; i++) {
     var valor = parseFloat(despesas[i].querySelector("td:nth-child(4)").textContent);
     if (!isNaN(valor)) {
       total += valor;
     }
   }
   return total.toFixed(2);
 }

 function reload() {
    window.location.reload()
 }

 






