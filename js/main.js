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

const initialSheepCount = 10; // Número de ovejas
console.log(datosGuardados.cantidadAnimalA);
const initialWolfCount = 0; // Número de lobos
console.log(datosGuardados.cantidadAnimalB);

// Canvas y configuración
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 40;

// Variables globales
let grid, ovejas, lobos;

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
}

function step() {
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

// Iniciar simulación
setup();
loop();
