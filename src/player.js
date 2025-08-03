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

    // player = Player obj, coor = [row:number, col:number]
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

    // shipList = [{name:string, length:number}]
    setupRandomShipPlacement(shipList) {
        for (let ship of shipList) {
            
            // try to place ship randomly until sucessful
            while (true) {
                let randRow = Math.floor(Math.random() * 10);
                let randCol = Math.floor(Math.random() * 10);
                let randOrient = (Math.random() > 0.5) ? "h" : "v";

                let placingResult = this.gameboard.placeShip(
                    ship.length, 
                    [randRow, randCol], 
                    randOrient, 
                    ship.name
                );

                if (placingResult != null)
                    break;
            }
        }
    }
}

export { Player };