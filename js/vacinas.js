

function getCards(){
    var retorno = axios.get()

    for (var i = 0; i < retorno.length; i++) {

        
        var card = document.createElement('div');
        card.classList.add('card');
        
        var h1 = document.createElement('h1');
        h1.textContent = retorno[i].nomevacina
        
        var h2 = document.createElement('h2');
        h2.textContent = retorno[i].dose
        
        var h3 = document.createElement('h3');
        h3.textContent = retorno[i].data
        
        var img = document.createElement('img');
        img.src = '';
        img.alt = '';
        
        if(retorno[i].dose != "Dose única"){
            var p = document.createElement('p');
            p.textContent = 'Não há próxima dose';
        }
        
        card.appendChild(h1);
        card.appendChild(h2);
        card.appendChild(h3);
        card.appendChild(img);
        card.appendChild(p);
        
        document.getElementById('cardContainer').appendChild(card);
    }
}


criarCards();