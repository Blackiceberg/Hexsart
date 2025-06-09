//Mettre le code JavaScript lié à la page photographer.html
document.getElementById("TITRE").style.opacity = "0";

//va chercher l'ID dans l'url
function getPhotographerId() {
  return new URL(location.href).searchParams.get("id");
}
const photographerIdURL = getPhotographerId();
async function initId() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  //revoir ma fonction pour renvoyer directement le bon photographe
  //crée un getMedia() et displayMedia
  const { medias } = await getMedia();
  // Récupère les datas des Media
  displayMedia(medias);
  displayData(photographers);
}

//display pour afficher les photographe
async function displayData(photographers) {
  const photographersMain = document.getElementById("main");
  photographers.forEach((photographer) => {
    if (photographer.id == photographerIdURL) {
      const photographerModelId = photographerFactory(photographer);
      const UserProfilDOM = photographerModelId.getUserProfilDOM();
      photographersMain.appendChild(UserProfilDOM);
    }
  });
}

//display pour afficher la galery

async function displayMedia(medias) {
  const galeryMedia = document.getElementById("galeryMedia");
  var totalLike = 0;
  medias.forEach((media) => {
    if (photographerIdURL == media.photographerId) {
      totalLike += media.likes;
      const galeryMediasId = galeryFactory(media);
      const UserGaleryDOM = galeryMediasId.getUserGaleryDOM();
      galeryMedia.appendChild(UserGaleryDOM);
    }
  });
  var compteurLike = document.getElementById("totalLikes");
  compteurLike.textContent = totalLike;
}

const menuBTN = document.getElementById("curent-order");
const dataBTN = document.getElementById("data");
const popularyBTN = document.getElementById("populary");
const titleBTN = document.getElementById("title");
const valueBTN = document.getElementById("data-order");
console.log();
let btn = ["Date", "Populaire", "Titre"];
menuBTN.onclick = function () {
  switchBTN();
};
popularyBTN.onclick = function () {
  popularyBTN.classList.add("numberOne");
  popularyBTN.classList.remove("numberTwo");
  popularyBTN.classList.remove("numberThree");

  dataBTN.classList.add("numberTwo");
  dataBTN.classList.remove("numberOne");
  titleBTN.classList.remove("numberOne");
  titleBTN.classList.add("numberThree");

  menuBTN.innerHTML = btn[1];
  switchBTN();
};
dataBTN.onclick = function () {
  dataBTN.classList.add("numberOne");
  dataBTN.classList.remove("numberTwo");
  dataBTN.classList.remove("numberThree");

  popularyBTN.classList.remove("numberOne");
  popularyBTN.classList.add("numberTwo");
  titleBTN.classList.remove("numberOne");
  titleBTN.classList.add("numberThree");

  menuBTN.innerHTML = btn[0];
  switchBTN();
};

titleBTN.onclick = function () {
  titleBTN.classList.remove("numberThree");
  titleBTN.classList.add("numberOne");

  popularyBTN.classList.remove("numberOne");
  dataBTN.classList.remove("numberOne");

  dataBTN.classList.add("numberThree");
  popularyBTN.classList.add("numberTwo");

  menuBTN.innerHTML = btn[2];

  switchBTN();
};

function switchBTN() {
  const switchBTN = document.getElementById("data-order");
  if (switchBTN.style.display === "none") {
    switchBTN.style.display = "flex";
    valueBTN.style.zIndex = 200;
  } else {
    switchBTN.style.display = "none";
    valueBTN.style.zIndex = -2;
  }
}

function recupForm() {
  const prenom = document.getElementById("prenom").value;
  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const form = `prénom : ${prenom}    nom : ${nom}    email : ${email}    message : ${message}`;

  return console.log(form);
}

initId();
switchBTN();
