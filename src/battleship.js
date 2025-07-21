class Ship {
    length;
    hits = 0;
    sunk = false;

    constructor(length=1) {
        this.length = length;
    }

    hit() {
        if (!this.sunk) {
            this.hits += 1;
            this.#isSunk();
        }
    }

    #isSunk() {
        if (this.hits === this.length) {
            this.sunk = true;
        }

        return this.sunk;
    }
}

export { Ship };