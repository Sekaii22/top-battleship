import { Gameboard } from "./battleship";

class Player {
    name;
    isAI;
    gameboard = new Gameboard();
    moves = [];

    constructor(name="Player", isAI=false) {
        this.name = name;
        this.isAI = isAI;
    }

    attack(player, coor) {
        if (this.moves.includes(String(coor)))
            return null;

        const result = player.gameboard.receiveAttack(coor);

        if (result != null)
            this.moves.push(String(coor));

        return result;
    }

    generateNextMove() {
        if (this.isAI) {
            let randRow;
            let randCol;

            while (true) {
                randRow = Math.floor(Math.random() * 10);
                randCol = Math.floor(Math.random() * 10);

                if (!this.moves.includes(String([randRow, randCol])))
                    break;
            }

            return [randRow, randCol];
        }
    }
}

export { Player };