const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.querySelector(".close");

// Abrir el modal
openModalBtn.onclick = function() {
  modal.style.display = "block";
};

// Cerrar el modal
closeModalBtn.onclick = function() {
  modal.style.display = "none";
};

// Cerrar el modal haciendo clic fuera de él
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};