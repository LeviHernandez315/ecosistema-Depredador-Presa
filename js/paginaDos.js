const inicio = document.getElementById("Start");
const CantA = document.getElementById("range1");
const CantB = document.getElementById("range2");



const datos = {
    cantidadAnimalA: parseInt(CantA.value),
    cantidadAnimalB: parseInt(CantB.value)
};

const NumCantA = parseInt(CantA.value);

inicio.addEventListener("click", () => {


    localStorage.setItem("datos", JSON.stringify(datos));
    localStorage.setItem("cantA", NumCantA);
})