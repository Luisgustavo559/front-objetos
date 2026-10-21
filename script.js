// criar a classe modelo 
class Veiculo {
    //metodo construtor para definir os atributos que terá
    constructor(placa, modelo, categoria, emServico=true) {
        this.placa = placa.toUpperCase();
        this.modelo = modelo;
        this.categoria = categoria;
        this.emServico = emServico;
        this.id = Date.now()+Math.random();//criar identificar unico
    }
    //função interna de classe: Alternar o estado do vewiculo
    alternarServico() {
        this.emServico = !this.emServico;
    }

//função interna: retornar o UIem HTML do objeto
    renderizarHTML() {
        const badgeCor=this.emServico ? 'bg-success' : 'bg-danger';
        const statusTexto=this.emServico ? 'Em Operação' : 'Em Manutenção';
        const bntTexto = this.emServico ? 'Enviar para Manutenção' : 'Reativar Veiculo';

        return `<div class="col-12">
            <div class = "card border-start border-4 ${this.emServico ? 'border-success' : 'border-danger'} shadow-sm ">
                <div >
                    <h5 class="card-title mb-1>${this.modelo} <small class="text-muted">(${this.placa})</small></h5>
                    <p class="card-text mb-0 small text-secondary">Categoria: ${this.categoria}</p>
                    <span class="badge ${badgeCor} mt-1">${statusTexto}</span>
                </div>
                <div>
                    <button onClick="gerenciador.mudarStatusVeiculo(${this.id})" class="btn btn-outline--dark btn-sm min-44">
                        ${bntTexto}
                    </button>
                    </div>
                </div>
            </div>

        `;
    }
}

// segunda classse: classe gerenciadora: aplicar regras der negocio , manipular o DOM 

class GerenciadorFrota {

    
    consctructor() {
        this.frota = [];
        this.containerDOM = document.getElementById('container-veiculos');
        this.contadorDOM=document.getElementById('contador-frota');
        this.formularioDOM=document.getElementById('form-veiculo');
        
    }
    
    //função incializar e recuperar LocalSotorage 
    iniciar() {
        this.carregarStorage();
        this.configurarStorage();
        this.atualizarTela();
    }
    
    //função configurar eventos
    
    configurarEventos() {
        this.formularioDOM.addEventListener('submit', (event) => {
            event.preventDefault();
            this.cadastrarVeiculo();
        }); 
    }
    //cadastrar veiculo
    cadastrarVeiculo() {
        const placa = document.getElementById('placa').value;
        const modelo = document.getElementById('modelo').value;
        const categoria = document.getElementById('categoria').value;

        //lista de objetos de classe gerenciadora

        this.frota.push(novoVeiculo);
        this.salvarStorage();
        this.atualizarTela();
    }

    //mudar status do veiculo
    mudarStatusVeiculo(id) {
        const veiculoEncontrado = this.frota.find(v => v.id === id);
        if (veiculoEncontrado) {
            //execulta função interna no proprio objetivo
            veiculoEncontrado.alternarStatus();
            this.salvarStorage();
            this.atualizarTela();
        }
    }

    //atualizar tela
    atualizarTela() {
        this.containerDOM.innerHTML = "";

        //se não estiver vazio
        if (this.frota.length === 0) {
            this.containerDOM.innerHTML = `
             <div class="alert alert-info text-center shadow-sm">
                Nenhum veículo cadastrado.
             </div>
            `;
        } else {
            this.frota.forEach(veiculo => {
                //invocar o métodorenderizar do proprio
                this.containerDOM.innerHTML += veiculo.renderizarHTML();
            });
        }
        this.contadorDOM.innerHTML = ` ${this.frota.length} veiculo(s)`;
    }

    salvarStorage() {
        localStorage.setItem('techfleet_dados', JSON.stringify(this.frota));
    }
    carregarStorage() {
        const dados = localStorage.getItem('techfleet_dados');

        if (dados) {
            const objetosPuros = JSON.parse(dados);
            this.frota = objetosPuros.map(item => new Veiculo( item.placa, item.modelo, item.categoria, item.emServico));
        }
    }
}

//instanciar a classe global

const gerenciador = new GerenciadorFrota();
docunent.addEventListener('DOMContentLoaded', () => gerenciador.iniciar());