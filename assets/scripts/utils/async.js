async function getPhotographers() {
    // Chargement du Json
    await fetch('assets/scripts/data/photographers.json')
    .then((res) => res.json())
    .then((data) => (photographers = data?.photographers));
  return {
    photographers: [...photographers],
  }; 

}

//getMedia qui me renvoi tout les media 

async function getMedia() {
  // Chargement du Json
  await fetch('assets/scripts/data/photographers.json')
  .then((res) => res.json())
  .then((data) => (medias = data?.media));
return {
  medias: [...medias],
}; 
}
