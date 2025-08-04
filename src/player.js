import { Gameboard } from "./battleship";

class Player {
    name;
    isAI;
    gameboard = new Gameboard();
    moves = [];
    #hints = {};
    /*
    #hints =
    { 
        uuid: { 
                queue: [[row. col], ...], 
                orientation: str 
            }, 
        ... 
    }     
    */

    constructor(name="Player", isAI=false) {
        this.name = name;
        this.isAI = isAI;
    }

    // player = Player obj, coor:array = [row:number, col:number]
    attack(player, coor) {
        if (this.moves.includes(String(coor)))
            return null;

        const result = player.gameboard.receiveAttack(coor);

        if (result === null) 
            return null;
        
        this.moves.push(String(coor));

        if (this.isAI) {
            this.#aiFeedback(result, coor);
            console.log(this.#hints);
        }   

        return result.outcome;
    }

    // attackResult: { outcome: int, orientation: null|str }
    #aiFeedback(attackResult, [row, col]) {
        const outcome = attackResult.outcome;
        const uuid = attackResult.uuid;
        const uuids = Object.keys(this.#hints);
        
        if (outcome === 1) {
            // attack hits a ship
            if (uuids.includes(uuid)) {
                const hint = this.#hints[uuid];
                hint.queue.push([row, col]);

                // set orientation based on common axis
                if (row === hint.queue[0][0])
                    hint.orientation = "h";
                else
                    hint.orientation = "v";
            }
            else {
                this.#hints[uuid] = {
                    queue: [[row, col]]
                }
            }
        }
        else if (outcome === 2) {
            // attack destroyed a ship
            delete this.#hints[uuid];
        }
    }

    #generateRandomMove() {        
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

    #generateAdjacentMove([row, col], orientation) {
        let adjacentCells = [];

        // add horizontally adjacent cells
        if (!orientation || orientation === "h") {
            const nextCol = col + 1;
            const prevCol = col - 1;

            if (nextCol <= 9 && !this.moves.includes(String([row, nextCol])))
                adjacentCells.push([row, nextCol]);

            if (prevCol >= 0 && !this.moves.includes(String([row, prevCol])))
                adjacentCells.push([row, prevCol]);
        }

        // add vertically adjacent cells
        if (!orientation || orientation === "v") {
            const nextRow = row + 1;
            const prevRow = row - 1;

            if (nextRow <= 9 && !this.moves.includes(String([nextRow, col])))
                adjacentCells.push([nextRow, col]);

            if (prevRow >= 0 && !this.moves.includes(String([prevRow, col])))
                adjacentCells.push([prevRow, col]);
        }

        // only return first available adjacent cell
        return adjacentCells.length > 0 ? adjacentCells[0] : null;
    }

    generateAIMove() {
        if (!this.isAI)
            return;

        const uuids = Object.keys(this.#hints);

        if (uuids.length === 0) {
            console.log("AI: Random move generated");
            return this.#generateRandomMove();
        }

        // there is a hint available, use first hint
        const hint = this.#hints[uuids[0]];
        const adjacentMove = this.#generateAdjacentMove(hint.queue[0], hint.orientation);
        
        // if no more adjacent move available
        if (!adjacentMove) {
            hint.queue.shift();
            return this.generateAIMove();
        }

        console.log("AI: Adjacent move generated");

        return adjacentMove;
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