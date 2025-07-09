var items = [];

document.querySelector('input[type=submit]')
.addEventListener('click',()=>{
    var nomeProduto = document.querySelector('input[name=nome_produto]').value;
    var precoProduto = document.querySelector('input[name=price]').value;

    items.push({
        nome: nomeProduto,
        valor: precoProduto
    });

    /*<div class="lista-produtos-single"
            <h3>RedBull</h3>
            <h3 class="price-produto"><span>$20,00</span></h3>
    </div>
    */
   let listaProdutos = document.querySelector('.lista-produtos');
   let soma = 0;
   listaProdutos.innerHTML = "";
    items.map(function(val){
        soma+=parseFloat(val.valor);
        listaProdutos.innerHTML+=`
        <div class="lista-produtos-single"
            <h3>`+val.nomeProduto`</h3>
            <h3 class="price-produto"><span>`+val.valor+`</span></h3>
        </div>
        `;

    })
    soma = soma.toFixed(2);
    nomeProduto.value = "";
    precoProduto.value = "";

    let elementoSoma = document.querySelector('.soma-produto h1');
    elementoSoma.innerHTML = 'R$'+soma;
  
});

document.querySelector('button[name=limpar]')
.addEventListener('click',()=>{
    item = [];

    document.querySelector('.lista-produtos').innerHTML = "";
     document.querySelector('.soma-produtos h1').innerHTML = "R$0";
    
})