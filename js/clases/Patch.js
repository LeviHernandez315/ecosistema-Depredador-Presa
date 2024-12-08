export default class Patch {
    constructor() {
        this.hasGrass = Math.random() > 0.5; // 50% de probabilidad de comenzar con pasto
        this.grassCountdown = this.hasGrass ? 0 : 10; // Si tiene pasto, no hay cuenta regresiva
        this.growthRate = 10; // Tiempo predeterminado para regenerar el pasto
    }

    // Método para regenerar pasto con un tiempo configurable
    growGrass() {
        if (!this.hasGrass) {
            this.grassCountdown--; // Disminuye el tiempo de regeneración

            if (this.grassCountdown <= 0) {
                this.hasGrass = true; // El pasto vuelve a crecer
                this.grassCountdown = this.growthRate; // Reiniciar la cuenta regresiva
            }
        }
    }

    // Método para consumir pasto y reiniciar el crecimiento
    consumeGrass() {
        if (this.hasGrass) {
            this.hasGrass = false; // El pasto es consumido
            this.grassCountdown = this.growthRate; // Reiniciar el tiempo de crecimiento
            return 10; // Energía que proporciona el pasto (puedes ajustar este valor)
        }
        return 0; // Si no hay pasto, no proporciona energía
    }
}
