import { Gameboard } from "./battleship";

class Player {
    name;
    gameboard = new Gameboard();
    ai;

    constructor(name, ai=false) {
        this.name = name;
        this.ai = ai;
    }
}

export { Player };