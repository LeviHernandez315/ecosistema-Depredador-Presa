export default class Animal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energy = Math.random() * 20 + 10;
    }

    move(gridSize) {
        // Generar un movimiento aleatorio para x e y
        let dx = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        let dy = Math.floor(Math.random() * 3) - 1;

        // Actualizar la posición de x
        this.x += dx;

        // Rebotar en el borde izquierdo o derecho
        if (this.x < 0) {
            this.x = 0; // Rebote en el borde izquierdo
        } else if (this.x >= gridSize) {
            this.x = gridSize - 1; // Rebote en el borde derecho
        }

        // Actualizar la posición de y
        this.y += dy;

        // Rebotar en el borde superior o inferior
        if (this.y < 0) {
            this.y = 0; // Rebote en el borde superior
        } else if (this.y >= gridSize) {
            this.y = gridSize - 1; // Rebote en el borde inferior
        }

        // Reducir energía
        this.energy--;
    }

    // Método para verificar si el animal está vivo
    isAlive() {
        return this.energy > 0;
    }

    // Método para aumentar o reducir energía (genérico)
    changeEnergy(amount) {
        this.energy += amount;
    }
}
