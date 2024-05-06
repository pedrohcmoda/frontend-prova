import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"
import { getFirestore, doc, setDoc, query, collection, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js"


const firebaseConfig = {
  apiKey: "AIzaSyBPTiuiW9Os0ocIApZnTzxwGc_LLKgoQ3U",
  authDomain: "frontend-prova-utfpr.firebaseapp.com",
  projectId: "frontend-prova-utfpr",
  storageBucket: "frontend-prova-utfpr.appspot.com",
  messagingSenderId: "722609539660",
  appId: "1:722609539660:web:c5d0caf847f2caf98f82e9",
  measurementId: "G-1G4V2NFVTV"
};

const app = initializeApp(firebaseConfig);
const bd = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();





async function cadastrarVacina() {
  var uuid = auth.currentUser.uid;
  var dataVacina = document.getElementById('data-vacina').value;
  var nomeVacina = document.getElementById('nome-vacina').value;
  var doseVacina = document.querySelector('input[name="dose"]:checked') ? document.querySelector('input[name="dose"]:checked').value : null;
  const image = document.getElementById('file-vacina').files[0];
  var proxDose = document.getElementById('prox-vacinacao').value;
  const reader = new FileReader();
  reader.onload = () => {
    const url = reader.result;
    const img = document.getElementById("img-vacina");
    img.src = url;
  }
  reader.readAsDataURL(image);
  const storageRef = ref(storage, `vacinas/${image.name}`);
  try {
    const uploadTask = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef)
    var vacina = {
      "data_vacina": dataVacina,
      "nome_vacina": nomeVacina,
      "dose": doseVacina,
      "file_vacina": url,
      "prox_vacinacao": proxDose,
      "uid": uuid,
      "id": nomeVacina + uuid + dataVacina,
    }
    await setDoc(doc(bd, "vacinas", nomeVacina + uuid), vacina);
    window.location.href = 'vacinas.html';
  } catch (e) {
    console.log(e);
  }

}

function encontrarVacinaPorTitulo(tituloBusca) {
  const todasVacinasDiv = document.getElementById("todas-vacinas");
  const cards = todasVacinasDiv.querySelectorAll(".card");

  cards.forEach(card => {
    const h1 = card.querySelector("h1");
    if (h1.textContent.toLowerCase().includes(tituloBusca.toLowerCase())) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}


function insertCards(vaccinations) {
  const cardContainer = document.getElementById('todas-vacinas');

  vaccinations.forEach((vaccination) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const h1 = document.createElement('h1');
    h1.textContent = vaccination.nome_vacina;
    card.appendChild(h1);

    const h2 = document.createElement('h2');
    h2.textContent = vaccination.dose;
    card.appendChild(h2);

    const h3 = document.createElement('h3');
    h3.textContent = vaccination.data_vacina;
    card.appendChild(h3);

    const img = document.createElement('img');
    img.src = vaccination.file_vacina || '';
    img.alt = 'Vaccine Image';
    card.appendChild(img);

    const p = document.createElement('p');
    if (vaccination.prox_vacinacao == '') {
      p.textContent = "Não há próxima dose";
    } else {
      p.textContent = "Proxim dose em: " + (vaccination.prox_vacinacao.replace('-', '/')).replace('-', '/');
    }
    p.classList.add('erro')
    card.appendChild(p);

    const id = document.createElement('p');
    id.textContent = vaccination.id;
    id.setAttribute('id', 'id');
    id.style.display = 'none';
    card.appendChild(id);

    card.addEventListener('click', () => {
      window.location.href = `edit-vacina.html?id=${id.textContent}`;
    })

    card.style.cursor = 'pointer';

    cardContainer.appendChild(card);
  });
}


function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    console.log(error);
  });
}

async function getVacinas(uid) {
  try {
    const q = query(collection(bd, "vacinas"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    const vaccinations = [];
    querySnapshot.forEach((doc) => {
      vaccinations.push(doc.data());
    });

    insertCards(vaccinations);
  } catch (e) {
    console.log(e);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    getVacinas(uid);
  } else {
    logout()
  }
});



if (document.title == "MyHealth - Adicionando vacina") {
  document.getElementById('file-vacina').addEventListener('change', () => {
    const image = document.getElementById('file-vacina').files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      const img = document.getElementById("img-vacina");
      img.src = url;
    }
    reader.readAsDataURL(image);
  });

  document.getElementById('form-vacina').addEventListener('submit', async (e) => {
    e.preventDefault();
    cadastrarVacina();
  })

}


if (document.title == "MyHealth - Vacinas") {
  document.getElementById('pesquisar').addEventListener('input', async (e) => {
    const tituloBusca = document.getElementById('pesquisar').value;
    encontrarVacinaPorTitulo(tituloBusca);
  });
}


if (document.title == "MyHealth - Editando vacina") {

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');


  const q = query(collection(bd, "vacinas"), where("id", "==", id));
  const querySnapshot = await getDocs(q);

  const vaccination = querySnapshot.docs[0].data();


  document.getElementById('data-vacina').value = vaccination.data_vacina;
  document.getElementById('nome-vacina').value = vaccination.nome_vacina;
  document.getElementById('prox-vacinacao').value = vaccination.prox_vacinacao;
  document.querySelector('input[name="dose"][value="' + vaccination.dose + '"]').checked = true;
  document.getElementById('img-vacina').src = vaccination.file_vacina;

  document.getElementById('file-vacina').addEventListener('change', () => {
    const image = document.getElementById('file-vacina').files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      const img = document.getElementById("img-vacina");
      img.src = url;
    }
    reader.readAsDataURL(image);
  });

  document.getElementById('prox-vacinacao').value = vaccination.prox_vacinacao;

  document.getElementById('form-vacina').addEventListener('submit', async (e) => {
    e.preventDefault();
    cadastrarVacina();
  })


  document.getElementById('sim').addEventListener('click', async () => {

    console.log(id)

    await deleteDoc(doc(bd, "vacinas", vaccination.nome_vacina + auth.currentUser.uid));
    window.location.href = 'vacinas.html';
  })

}