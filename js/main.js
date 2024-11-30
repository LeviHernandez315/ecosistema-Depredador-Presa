import Patch from "./clases/Patch.js";
import Oveja from "./clases/Oveja.js";
import Lobo from "./clases/Lobo.js";

// Canvas y configuración
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 40;

// Variables globales
let grid, ovejas, lobos;

function setup() {
  grid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => new Patch())
  );

  ovejas = Array.from({ length: 30 }, () =>
    new Oveja(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize))
  );

  lobos = Array.from({ length: 10 }, () =>
    new Lobo(Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize))
  );
}

function step() {
  // Mover ovejas y lobos
  ovejas = ovejas.flatMap((s) => {
    s.move(gridSize);
    const patch = grid[s.x][s.y];
    s.eatGrass(patch);
    if (s.energy <= 0) return [];
    const offspring = s.reproduce();
    return offspring ? [s, offspring] : [s];
  });

  lobos = lobos.flatMap((w) => {
    w.move(gridSize);
    const prey = ovejas.find((s) => s.x === w.x && s.y === w.y);
    if (prey) {
      w.eatSheep(prey);
      ovejas = ovejas.filter((s) => s !== prey);
    }
    if (w.energy <= 0) return [];
    const offspring = w.reproduce();
    return offspring ? [w, offspring] : [w];
  });

  grid.forEach((row) => row.forEach((patch) => patch.growGrass()));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cellSize = canvas.width / gridSize;

  grid.forEach((row, x) =>
    row.forEach((patch, y) => {
      ctx.fillStyle = patch.hasGrass ? "green" : "brown";
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    })
  );

  ovejas.forEach((s) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(s.x * cellSize + cellSize / 2, s.y * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
    ctx.fill();
  });

  lobos.forEach((w) => {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(w.x * cellSize + cellSize / 2, w.y * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function loop() {
  step();
  draw();
  requestAnimationFrame(loop);
}

// Iniciar simulación
setup();
loop();
