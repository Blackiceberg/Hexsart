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
