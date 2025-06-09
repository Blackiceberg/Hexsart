function galeryFactory(data) {
  const { id, photographerId, title, image, likes, date, price } = data;
  let srcMedia = `assets/images/photographers/${photographerId}/`;
  if (image) {
    srcMedia += image;
  } 

  /** ---------- CREATION DU GABARIT DE LA GALERIE DES MEDIAS DU PHOTOGRAPHE ---------- */

  function getUserGaleryDOM() {
    /** FIGURES pour chaque médias */
    const figureGalery = document.createElement("figure");
    figureGalery.classList.add("media-figure");
    figureGalery.setAttribute("id", "figure-" + id);
    figureGalery.setAttribute("aria-label", "carte du média " + title);

    /** LIEN VERS LA GALLERIE*/
    const linkGalery = document.createElement("div");
    figureGalery.appendChild(linkGalery);

    /** LEGENDES(TITRES) */
    const legendGalery = document.createElement("figcaption");

    /** TITRES des médias */
    const legendTitle = document.createElement("p");
    legendTitle.classList.add("legend-title");
    legendTitle.textContent = title;

    

    const galeryMedia = document.getElementById("galeryMedia");

    /** MEDIAS => vidéo ou image */
    const modal = document.getElementById("galery_modal");
    figureGalery.appendChild(linkGalery);
    
    const imgPhoto = document.createElement("img");
    imgPhoto.classList.add("galery-medias");
    imgPhoto.setAttribute("data-mediaid", id);
    imgPhoto.setAttribute("src", srcMedia);
    imgPhoto.setAttribute("alt", title + ", closeup view");
    imgPhoto.setAttribute("role", "link");
    imgPhoto.setAttribute("tilte", title);
    imgPhoto.setAttribute("tabindex", 0);
    linkGalery.appendChild(imgPhoto);
    

    const galerieContent = document.getElementById("modal-content");
    const items = document.querySelectorAll('[role="link"]');

    const selectTilte = document.querySelectorAll("p.legend-title");
    1234;
    console.dir(selectTilte[2]);

    let nbSlide = items.length;
    let count = 0;

    function slideSuivant() {
      if (count < nbSlide - 1) {
        count++;
      } else {
        count = 0;
      }
    }

    function slidePrecedent() {
      if (count > 0) {
        count--;
      } else {
        count = nbSlide - 1;
      }
    }
    function nextMedia() {
      let titreImgGalery = document.getElementById("h3Img");
      titreImgGalery.innerHTML = `${selectTilte}`;
      let mediaSource = document.getElementById("imgPhoto");
      mediaSource.setAttribute("src", `${items[count].src}`);
      console.log(`${items[count].src}`);
      console.log(`${titreImgGalery}`);
    }

    const suivant = document.querySelector(".right");
    const precedent = document.querySelector(".left");
    const live = document.querySelector("#live");

    suivant.onclick = function () {
      slideSuivant();
      nextMedia();
    };

    precedent.onclick = function () {
      slidePrecedent();
      nextMedia();
    };

    linkGalery.onclick = function () {
      //affiché la modale
      modal.classList.add("show");

      const titreImgGalery = document.createElement("h3");
      titreImgGalery.textContent = title;
      titreImgGalery.setAttribute("id", "h3Img");
      live.appendChild(titreImgGalery);

        const imgPhoto = document.createElement("img");
        imgPhoto.classList.add("galery-medias");
        imgPhoto.classList.add("modal-content");
        imgPhoto.setAttribute("id", "imgPhoto");
        imgPhoto.setAttribute("src", srcMedia);
        imgPhoto.setAttribute("data-mediaid", id);
        imgPhoto.setAttribute("alt", title + ", closeup view");
        imgPhoto.setAttribute("role", "link");

        imgPhoto.setAttribute("tabindex", 0);
        live.appendChild(imgPhoto);

      /**contenu de la modal galery */
      //modal.appendChild(clonelinkGalery);
    };
    // fonction close
    const close = document.getElementById("close");
    close.onclick = function () {
      modal.classList.remove("show");
      galerieContent.removeChild(galerieContent.lastChild);
    };

    figureGalery.appendChild(legendGalery).lastChild;
    legendGalery.appendChild(legendTitle);

    //suivant.onclick = function slideSuivant() {
    // var elemShow = document.getElementById("showDiv");
    // elemShow.remove();
    //};

    return figureGalery;
  }

  /** modal galerie */

  /** modal galerie partie fonctionnel */

  /*




    
    })
}*/
  return {
    id,
    photographerId,
    title,
    image,
    date,
    price,
    srcMedia,
    getUserGaleryDOM,
  };
}
