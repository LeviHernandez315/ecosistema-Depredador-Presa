import Animal from "./Animal.js";

const formData = JSON.parse(localStorage.getItem("formData"));
console.log("delta", formData.tasaReproduccionLobos);
console.log("gamma", formData.tasaMortalidadLobos);
console.log("beta", formData.tasaDepredacionLobos);

export default class Lobo extends Animal {
    constructor(x, y) {
        super(x, y);
        this.energy = 120; // Energía inicial de los lobos
    }

    // Método para consumir ovejas y ganar energía
    eatSheep() {
        const energyGained = 200; // Energía ganada por comer una oveja
        this.energy += energyGained;
    }

    // Método para reducir energía por la tasa de mortalidad
    reduceEnergy() {
        const gamma = formData.tasaMortalidadLobos; // Tasa de mortalidad de lobos
        this.energy -= gamma * this.energy; // Aplica la tasa de mortalidad

        // Redondear la energía a dos decimales
        this.energy = Math.round(this.energy * 100) / 100;
    }

    // Método para reproducir lobos si tienen suficiente energía
    reproduce() {
        const delta = formData.tasaReproduccionLobos; // Tasa de reproducción de lobos
        const reproductionThreshold = 100; // Energía necesaria para reproducirse

        // Verificar si el lobo tiene suficiente energía para reproducirse
        if (this.energy >= reproductionThreshold) {
            // Reducir la energía al dividirla con la nueva cría
            this.energy /= 2;

            return Math.random() < delta ? new Lobo(this.x, this.y) : null; // Usar delta como probabilidad
        }
        return null; // No se reproduce si no alcanza la energía necesaria
    }

    // Actualizar movimiento, buscar presas y reducir energía cada paso
    moveAndHunt(ovejas, gridSize) {
        const beta = formData.tasaDepredacionLobos; // Tasa de depredación (lobos comen ovejas)

        // Movimiento hacia la oveja más cercana
        const closestSheep = this.findClosestSheep(ovejas);

        // Si hay ovejas, mover hacia la más cercana y tratar de comerla
        if (closestSheep) {
            const dx = closestSheep.x - this.x;
            const dy = closestSheep.y - this.y;

            // Mover al lobo en la dirección de la oveja
            if (Math.abs(dx) > Math.abs(dy)) {
                this.x += Math.sign(dx); // Mover en el eje X
            } else {
                this.y += Math.sign(dy); // Mover en el eje Y
            }

            // Si el lobo está en la misma posición que la oveja, intenta comerla
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
        } else {
            // Si no hay ovejas, el lobo se mueve aleatoriamente
            const randomDirection = Math.floor(Math.random() * 4);
            switch (randomDirection) {
                case 0: // Mover hacia arriba
                    this.y = (this.y - 1 + gridSize) % gridSize;
                    break;
                case 1: // Mover hacia abajo
                    this.y = (this.y + 1) % gridSize;
                    break;
                case 2: // Mover hacia la izquierda
                    this.x = (this.x - 1 + gridSize) % gridSize;
                    break;
                case 3: // Mover hacia la derecha
                    this.x = (this.x + 1) % gridSize;
                    break;
            }
        }

        // console.log("Energía antes de reducir:", this.energy);
        this.reduceEnergy();
        // console.log("Energía después de reducir:", this.energy);

        // Si la energía del lobo es cero o negativa, eliminarlo (muere)
        if (this.energy <= 0.01) {
            return null; // El lobo muere (es eliminado de la simulación)
        }

        return this; // El lobo sigue vivo
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
