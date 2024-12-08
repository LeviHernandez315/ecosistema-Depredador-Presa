import Patch from "./clases/Patch.js";
import Oveja from "./clases/Oveja.js";
import Lobo from "./clases/Lobo.js";

// // Parámetros del modelo Lotka-Volterra
// const alpha = 0.1; // Tasa de reproducción de las ovejas
// const beta = 0.02; // Tasa de depredación (lobos comen ovejas)
// const delta = 0.01; // Tasa de reproducción de lobos por oveja comida
// const gamma = 0.1; // Tasa de mortalidad de lobos

let lastFrameTime = 0;
const frameDelay = 200; // Tiempo en milisegundos (200 ms = 5 FPS)

const cantAGuardado = localStorage.getItem("cantA");
console.log(cantAGuardado);

const datosGuardados = JSON.parse(localStorage.getItem("datos"));

const initialSheepCount = 1; // Número de ovejas
console.log(datosGuardados.cantidadAnimalA);
const initialWolfCount = 0; // Número de lobos
console.log(datosGuardados.cantidadAnimalB);

const pauseResumeButton = document.getElementById("pauseResumeButton");
const resetButton = document.getElementById("resetButton");

// Estado inicial para pausar/reanudar
let isPaused = false;

// Canvas y configuración
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 40;

// Variables globales
let grid, ovejas, lobos;
let grassCount = 0; // Contador de pasto
let simulationTime = 0; // Variable para el tiempo de simulación
let lastSecondTime = 0; // Para controlar el tiempo en segundos
let simulationRunning = true; // Controlar si la simulación sigue corriendo

function actualizarCantidades() {
    // Actualizar los campos de cantidad de ovejas y lobos
    document.querySelector('input[placeholder="cantidad de Ovejas"]').value =
        ovejas.length;
    document.querySelector('input[placeholder="cantidad de Lobos"]').value =
        lobos.length;
}

// Actualiza el input con la cantidad de pasto
function updateGrassInput() {
    const grassInput = document.querySelector(
        'input[placeholder="cantidad de pasto"]'
    );
    grassInput.value = grassCount;
}

// Actualiza el contador de pasto
function updateGrassCount() {
    grassCount = grid.reduce((acc, row) => {
        return acc + row.filter((patch) => patch.hasGrass).length;
    }, 0); // Contar los parches de pasto
    updateGrassInput(); // Llamar para actualizar el input
}

// Función para verificar si hay animales vivos
function checkIfAnimalsAlive() {
    return ovejas.length > 0 || lobos.length > 0; // Verifica si hay al menos una oveja o un lobo
}

function setup() {
    // Inicializar el grid y las poblaciones de ovejas y lobos
    grid = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => new Patch())
    );

    ovejas = Array.from(
        { length: initialSheepCount }, // Usamos la variable `initialSheepCount`
        () =>
            new Oveja(
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize)
            )
    );

    lobos = Array.from(
        { length: initialWolfCount }, // Usamos la variable `initialWolfCount`
        () =>
            new Lobo(
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize)
            )
    );

    // Resetear el contador de pasto
    updateGrassCount(); // Esto asegura que la cantidad de pasto se muestre al iniciar
}

function step() {
    if (!simulationRunning) return;

    // Mover ovejas y comer pasto
    ovejas = ovejas.flatMap((oveja) => {
        oveja.moveAndGraze(grid, gridSize);
        if (oveja.isDead) return []; // Excluir ovejas muertas
        const offspring = oveja.reproduce();
        return offspring ? [oveja, offspring] : [oveja];
    });

    // Mover lobos y cazar ovejas
    lobos = lobos.flatMap((lobo) => {
        // Mover el lobo y hacerle cazar (pasar gridSize)
        const updatedLobo = lobo.moveAndHunt(ovejas, gridSize);

        // Si el lobo ha muerto (energy <= 0), no lo agregamos de nuevo
        if (!updatedLobo) return []; // El lobo muere y no se incluye en el array

        // Verificar si el lobo puede reproducirse
        const offspring = updatedLobo.reproduce();
        return offspring ? [updatedLobo, offspring] : [updatedLobo]; // Incluir al lobo y su cría si se reproduce
    });

    // Crecer la hierba en los parches
    grid.forEach((row) => row.forEach((patch) => patch.growGrass()));

    // Actualizar la cantidad de pasto
    updateGrassCount();

    // Actualizar las cantidades de ovejas y lobos en el HTML
    actualizarCantidades();

    // Verificar si hay animales vivos
    if (!checkIfAnimalsAlive()) {
        simulationRunning = false; // Detener la simulación si no hay animales vivos
    }

    // Incrementar el tiempo de simulación cada segundo
    const currentTime = performance.now();
    if (currentTime - lastSecondTime >= 1000) {
        // Si ha pasado 1 segundo
        simulationTime++; // Incrementar el tiempo en segundos
        lastSecondTime = currentTime; // Actualizar el tiempo del último incremento
    }

    // Actualizar el tiempo transcurrido
    updateSimulationTime();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / gridSize;

    // Dibujar parches de hierba
    grid.forEach((row, x) =>
        row.forEach((patch, y) => {
            ctx.fillStyle = patch.hasGrass ? "green" : "gray";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        })
    );

    // Dibujar las ovejas
    ovejas.forEach((s) => {
        ctx.fillStyle = s.isDead ? "red" : "white"; // Cambiar color si la oveja está muerta
        ctx.beginPath();
        ctx.arc(
            s.x * cellSize + cellSize / 2,
            s.y * cellSize + cellSize / 2,
            cellSize / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
    // Dibujar lobos
    lobos.forEach((w) => {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(
            w.x * cellSize + cellSize / 2,
            w.y * cellSize + cellSize / 2,
            cellSize / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
}

function loop(timestamp) {
    if (timestamp - lastFrameTime >= frameDelay) {
        lastFrameTime = timestamp;
        step(); // Llama a la función step() para actualizar la simulación
        draw(); // Dibuja los resultados
    }
    requestAnimationFrame(loop); // Llama a la siguiente iteración de la simulación
}

// Función para actualizar el tiempo en el HTML
function updateSimulationTime() {
    const timeInput = document.querySelector('input[placeholder="Tiempo"]');
    timeInput.value = simulationTime; // Actualiza el input con el tiempo transcurrido
}

// Evento para pausar/reanudar la simulación
pauseResumeButton.addEventListener("click", () => {
    if (isPaused) {
        // Reanudar simulación
        simulationRunning = true; // Permitir que la simulación corra
        pauseResumeButton.textContent = "Pausar"; // Cambiar el texto del botón
        loop(); // Reanudar el loop
    } else {
        // Pausar simulación
        simulationRunning = false; // Detener la simulación
        pauseResumeButton.textContent = "Reanudar"; // Cambiar el texto del botón
    }
    isPaused = !isPaused; // Alternar el estado
});

// Evento para reiniciar la simulación
resetButton.addEventListener("click", () => {
    simulationRunning = false; // Detener la simulación antes de reiniciarla
    setup(); // Volver a inicializar las variables
    simulationTime = 0; // Reiniciar el tiempo
    updateSimulationTime(); // Actualizar el tiempo en la interfaz
    simulationRunning = true; // Permitir que la simulación vuelva a correr
    lastFrameTime = 0; // Resetear el tiempo del último fotograma
    lastSecondTime = 0; // Resetear el tiempo del último segundo
    loop(); // Volver a iniciar la simulación
});

// Iniciar simulación
setup();
loop();
