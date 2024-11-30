import Patch from "./clases/Patch.js";
import Oveja from "./clases/Oveja.js";
import Lobo from "./clases/Lobo.js";

// Parámetros del modelo Lotka-Volterra
const alpha = 0.1; // Tasa de crecimiento de las ovejas
const beta = 0.02; // Tasa de depredación (lobos comen ovejas)
const delta = 0.01; // Tasa de reproducción de lobos por oveja comida
const gamma = 0.1; // Tasa de mortalidad de lobos
const initialSheepCount = 50; // Número de ovejas
const initialWolfCount = 20; // Número de lobos

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
        oveja.moveAndGraze(grid, gridSize); // Pasar gridSize

        if (oveja.energy <= 0) return [];

        const offspring = oveja.reproduce();
        return offspring ? [oveja, offspring] : [oveja];
    });

    // Mover lobos y cazar ovejas
    lobos = lobos.flatMap((lobo) => {
        lobo.moveAndHunt(ovejas, gridSize); // Pasar gridSize

        // Si el lobo no tiene energía, muere (es eliminado)
        if (lobo.energy <= 0) return [];

        // Verificar si el lobo puede reproducirse
        const offspring = lobo.reproduce();
        return offspring ? [lobo, offspring] : [lobo];
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
            ctx.fillStyle = patch.hasGrass ? "green" : "brown";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        })
    );

    // Dibujar ovejas
    ovejas.forEach((s) => {
        ctx.fillStyle = "white";
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

function loop() {
    step(); // Avanzar un paso en la simulación
    draw(); // Dibujar el estado actual
    requestAnimationFrame(loop, 200); // Repetir en el siguiente frame
}

// Iniciar simulación
setup();
loop();
