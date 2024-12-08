import Animal from "./Animal.js";

export default class Oveja extends Animal {
    constructor(x, y) {
        super(x, y);
        this.energy = 90; // Energía inicial de las ovejas
        this.isDead = false; // Nuevo atributo para marcar si la oveja está muerta
    }

    eatGrass(patch) {
        const energyGained = patch.consumeGrass(); // Consumir el pasto del parche
        if (energyGained > 0) {
            this.energy += energyGained; // Ganar energía solo si hay pasto
        }
    }

    reproduce() {
        const alpha = 0.6; // Tasa de reproducción de las ovejas
        const reproductionThreshold = 60; // Energía necesaria para reproducirse
        if (this.energy >= reproductionThreshold) {
            this.energy /= 2; // Dividir la energía entre la madre y la cría
            return Math.random() < alpha ? new Oveja(this.x, this.y) : null; // Usar alpha como probabilidad
        }
        return null; // No se reproduce si no alcanza la energía necesaria
    }

    reduceEnergy() {
        this.energy -= 4; // Disminuir la energía en cada paso

        // Evitar que la energía se vuelva negativa
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    moveAndGraze(grid, gridSize) {
        // Si la oveja ya está muerta, no realizar ningún paso
        if (this.energy <= 0) {
            this.isDead = true;
            console.log("La oveja ha muerto");
            return null;
        }

        this.move(gridSize); // Pasar gridSize como argumento

        // Buscar pasto en la posición actual y comerlo
        const patch = grid[this.x][this.y];
        this.eatGrass(patch);

        // console.log("Energía antes de reducir:", this.energy);
        this.reduceEnergy();
        // console.log("Energía después de reducir:", this.energy);

        // Si la oveja se queda sin energía, marcarla como muerta
        if (this.energy <= 0) {
            return null; // La oveja muere (es eliminado de la simulación)
        }
    }
}
