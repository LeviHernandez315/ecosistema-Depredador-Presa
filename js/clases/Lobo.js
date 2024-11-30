import Animal from "./Animal.js";

export default class Lobo extends Animal {
    constructor(x, y) {
        super(x, y);
        this.energy = 100; // Energía inicial de los lobos
    }

    // Método para consumir ovejas y ganar energía
    eatSheep() {
        this.energy += 20; // Energía ganada al comer una oveja
    }

    // Método para reducir energía por la tasa de mortalidad
    reduceEnergy() {
        const gamma = 0.1; // Tasa de mortalidad de lobos
        this.energy -= gamma * this.energy; // Aplica la tasa de mortalidad
    }

    // Método para reproducir lobos si tienen suficiente energía
    reproduce() {
        const delta = 0.01; // Tasa de reproducción de lobos por oveja comida
        const reproductionThreshold = 120; // Energía necesaria para reproducirse
        if (this.energy >= reproductionThreshold) {
            this.energy /= 2; // Reducir la energía al dividirla con la nueva cría
            // Crear un nuevo lobo con una probabilidad relacionada con delta
            return Math.random() < delta ? new Lobo(this.x, this.y) : null;
        }
        return null; // No se reproduce si no alcanza la energía necesaria
    }

    // Actualizar movimiento, buscar presas y reducir energía cada paso
    moveAndHunt(ovejas, gridSize) {
        const beta = 0.02; // Tasa de depredación (lobos comen ovejas)
        // Aceptamos gridSize como argumento
        // Movimiento aleatorio (puede ajustarse)
        this.move(gridSize);

        // Buscar una oveja en la misma posición
        const prey = ovejas.find(
            (oveja) => oveja.x === this.x && oveja.y === this.y
        );

        if (prey && Math.random() < beta) {
            // Aplicar tasa de depredación
            // Consumir oveja si está en la misma posición
            this.eatSheep();
            ovejas.splice(ovejas.indexOf(prey), 1); // Eliminar oveja del array
        }

        // Reducir energía según la tasa de mortalidad
        this.reduceEnergy();
    }
}
