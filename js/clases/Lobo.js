import Animal from "./Animal.js";

export default class Lobo extends Animal {
    constructor(x, y) {
        super(x, y);
        this.energy = 100; // Energía inicial de los lobos
    }

    // Método para consumir ovejas y ganar energía
    eatSheep() {
        const delta = 0.5; // Tasa de reproducción de lobos por oveja comida
        const energyGained = 20; // Energía ganada por comer una oveja
        this.energy += energyGained;

        // Aumentar la tasa de reproducción por cada oveja comida
        this.energy += delta * energyGained; // Incrementar energía por la tasa delta
    }

    // Método para reducir energía por la tasa de mortalidad
    reduceEnergy() {
        const gamma = 0.02; // Tasa de mortalidad de lobos
        this.energy -= gamma * this.energy; // Aplica la tasa de mortalidad
    }

    // Método para reproducir lobos si tienen suficiente energía
    reproduce() {
        const reproductionThreshold = 120; // Energía necesaria para reproducirse

        // Verificar si el lobo tiene suficiente energía para reproducirse
        if (this.energy >= reproductionThreshold) {
            // Reducir la energía al dividirla con la nueva cría
            this.energy /= 2;

            // Crear un nuevo lobo en la misma posición
            return new Lobo(this.x, this.y);
        }
        return null; // No se reproduce si no alcanza la energía necesaria
    }

    // Actualizar movimiento, buscar presas y reducir energía cada paso
    moveAndHunt(ovejas) {
        const beta = 0.02; // Tasa de depredación (lobos comen ovejas)
        // Movimiento hacia la oveja más cercana
        const closestSheep = this.findClosestSheep(ovejas);

        if (closestSheep) {
            // Mover hacia la oveja
            const dx = closestSheep.x - this.x;
            const dy = closestSheep.y - this.y;

            // Mover al lobo en la dirección de la oveja (puedes ajustar la lógica para movimiento diagonal o cardinal)
            if (Math.abs(dx) > Math.abs(dy)) {
                this.x += Math.sign(dx); // Mover en el eje X
            } else {
                this.y += Math.sign(dy); // Mover en el eje Y
            }

            // Si el lobo está en la misma posición que la oveja, se evalúa si la "come"
            const prey = ovejas.find(
                (oveja) => oveja.x === this.x && oveja.y === this.y
            );

            if (prey) {
                // Usar la tasa de depredación (beta) para determinar si el lobo comerá la oveja
                if (Math.random() < beta) {
                    this.eatSheep(); // Comer la oveja
                    ovejas.splice(ovejas.indexOf(prey), 1); // Eliminarla de la lista
                }
            }
        }

        // Reducir energía por la tasa de mortalidad
        this.reduceEnergy();
    }

    // Función para encontrar la oveja más cercana
    findClosestSheep(ovejas) {
        let closestSheep = null;
        let minDistance = Infinity;

        ovejas.forEach((oveja) => {
            const distance =
                Math.abs(oveja.x - this.x) + Math.abs(oveja.y - this.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestSheep = oveja;
            }
        });

        return closestSheep;
    }
}
