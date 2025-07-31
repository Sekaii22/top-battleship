class Ship {
    name;
    length;
    hits = 0;
    sunk = false;

    constructor(length=1, name="ship") {
        if (length < 1)
            length = 1;

        this.length = length;
        this.name = name;
    }

    hit() {
        if (!this.sunk) {
            this.hits += 1;
            this.#checkSunk();
        }
    }

    #checkSunk() {
        if (this.hits === this.length) {
            this.sunk = true;
        }
    }
}

class Gameboard {
    // board size is 9 x 9
    board = {};             // {"row,col": ship obj}
    ships = [];
    striked = [];           // coors where attacks received correctly striked ships
    missed = [];            // coors where attacks missed
    noOfShipsSunk = 0;
    allShipsDestroyed = false;

    checkValidPlacement(coors) {
        for (let coorStr of coors) {
            const coorArr = coorStr.split(",");
            const row = coorArr[0];
            const col = coorArr[1];

            // check if coordinates outside of board
            if (row < 0 || row > 9 || col < 0 || col > 9) {
                return false;
            }
            // check if cell alr occupied
            else if (this.board[coorStr] != null) {
                return false;
            }
        }

        return true;
    }

    placeShip(length, [row, col], orientation="h", name) {
        if (!["h", "v"].includes(orientation)) {
            orientation = "h";
        }

        let coors = Array(length);
        for (let i = 0; i < length; i++) {
            if (orientation === "h") {
                coors[i] = String([row, col+i]);
            }
            else {
                coors[i] = String([row+i, col]);
            }
        }

        if(!this.checkValidPlacement(coors)) {
            return null;
        };

        const ship = new Ship(length, name);
        for (let coorStr of coors) {
            this.board[coorStr] = ship;
        }
        this.ships.push(ship);

        return ship;
    }

    // 0 if missed, 1 if hit, 2 if ship sunk from hit, null if invalid
    receiveAttack([row, col]) {
        const coorStr = String([row, col]);
        const ship = this.board[coorStr];

        if (
            this.striked.includes(coorStr) || 
            this.missed.includes(coorStr) ||
            (row < 0 || row > 9 || col < 0 || col > 9)
        )
            return null

        if (ship != null) {
            ship.hit();
            
            if (ship.sunk === true)
                this.noOfShipsSunk += 1;
            
            if (this.noOfShipsSunk === this.ships.length)
                this.allShipsDestroyed = true;
            
            this.striked.push(coorStr);
            return ship.sunk ? 2 : 1;
        }
        else {
            this.missed.push(coorStr);
            return 0;
        }
    }
}

export { Ship, Gameboard };