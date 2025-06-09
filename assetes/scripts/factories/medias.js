function galeryFactory(data) {
  const { id, photographerId, title, image, video, likes, date, price } = data;
  let srcMedia = `assets/images/photographers/${photographerId}/`;
  if (image) {
    srcMedia += image;
  } else {
    srcMedia += video;
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

    /** Like */

    const like = document.createElement("b");
    like.classList.add("like");
    like.setAttribute("id", "likeBTN");
    like.textContent = likes;

    /** Picto_Like */
    const pictoLike = document.createElement("a");
    pictoLike.classList.add("fa-solid", "fa-heart", "dislike");
    const spanTarif = document.getElementById("tarif");
    spanTarif.textContent = `${price} €/Jour`;

    pictoLike.onclick = function () {
      let compteurLike = document.getElementById("totalLikes");
      if (pictoLike.classList.contains("dislike")) {
        pictoLike.classList.remove("dislike");
        like.textContent = likes + 1;
        compteurLike.textContent = parseInt(compteurLike.innerHTML) + 1;
        console.log(likes);
      } else {
        pictoLike.classList.add("dislike");
        like.textContent = likes + 1 - 1;
        compteurLike.textContent = parseInt(compteurLike.innerHTML) - 1;

        console.log(likes);
      }
    };

    const galeryMedia = document.getElementById("galeryMedia");

    /** MEDIAS => vidéo ou image */
    const modal = document.getElementById("galery_modal");
    figureGalery.appendChild(linkGalery);
    if (image) {
      const imgPhoto = document.createElement("img");
      imgPhoto.classList.add("galery-medias");
      imgPhoto.setAttribute("data-mediaid", id);
      imgPhoto.setAttribute("src", srcMedia);
      imgPhoto.setAttribute("alt", title + ", closeup view");
      imgPhoto.setAttribute("role", "link");
      imgPhoto.setAttribute("tilte", title);
      imgPhoto.setAttribute("tabindex", 0);
      linkGalery.appendChild(imgPhoto);
    } else {
      const vidPhoto = document.createElement("video");
      vidPhoto.classList.add("galery-medias");
      vidPhoto.setAttribute("type", "video/mp4");
      vidPhoto.setAttribute("src", srcMedia);
      vidPhoto.setAttribute("data-mediaid", id);
      vidPhoto.setAttribute("alt", title + ", closeup view");
      vidPhoto.setAttribute("role", "link");
      vidPhoto.setAttribute("tabindex", 0);
      vidPhoto.setAttribute("autoplay", "true");

      linkGalery.insertBefore(vidPhoto, linkGalery.firstChild);
    }

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

      if (image) {
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
      } else {
        const vidPhoto = document.createElement("video");
        vidPhoto.classList.add("galery-medias");
        vidPhoto.classList.add("modal-content");
        vidPhoto.setAttribute("id", "imgPhoto");
        vidPhoto.classList.add("class", "mediaShow");
        vidPhoto.setAttribute("type", "video/mp4");
        vidPhoto.setAttribute("src", srcMedia);
        vidPhoto.setAttribute("data-mediaid", id);
        vidPhoto.setAttribute("alt", title + ", closeup view");
        vidPhoto.setAttribute("role", "link");
        vidPhoto.setAttribute("tabindex", 0);
        vidPhoto.setAttribute("autoplay", "true");
        live.appendChild(vidPhoto);
      }
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
    legendGalery.appendChild(like);
    legendGalery.appendChild(pictoLike);
    galeryMedia.appendChild(compteurLike);

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
    video,
    likes,
    date,
    price,
    srcMedia,
    getUserGaleryDOM,
  };
}
