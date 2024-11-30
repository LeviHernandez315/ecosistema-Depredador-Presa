export default class Animal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energy = Math.random() * 20 + 10;
    }

    move(gridSize) {
        this.x =
            (this.x + (Math.floor(Math.random() * 3) - 1) + gridSize) %
            gridSize;
        this.y =
            (this.y + (Math.floor(Math.random() * 3) - 1) + gridSize) %
            gridSize;
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
