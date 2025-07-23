class Ship {
    length;
    hits = 0;
    sunk = false;

    constructor(length=1) {
        if (length < 1)
            length = 1;

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
    }
}

class Gameboard {
    // board size of 10 rows, 10 cols
    board = [
                Array(10), 
                Array(10), 
                Array(10), 
                Array(10), 
                Array(10), 
                Array(10), 
                Array(10), 
                Array(10), 
                Array(10), 
                Array(10)
            ];
    ships = [];
    striked = [];           // coors where attacks received correctly striked ships
    missed = [];            // coors where attacks missed
    noOfShipsSunk = 0;

    checkValidPlacement(coors) {
        for (let [x, y] of coors) {
            // check if coordinates outside of board
            if (x < 0 || x > 9 || y < 0 || y > 9) {
                return false;
            }
            // check if cell alr occupied
            else if (this.board[x][y] != null) {
                return false;
            }
        }

        return true;
    }

    placeShip(length=1, [x, y], orientation="h") {
        if (!["h", "v"].includes(orientation)) {
            orientation = "h";
        }

        let coors = Array(length);
        for (let i = 0; i < length; i++) {
            if (orientation === "h") {
                coors[i] = [x+i, y];
            }
            else {
                coors[i] = [x, y+i];
            }
        }

        if(!this.checkValidPlacement(coors)) {
            return null;
        };

        const ship = new Ship(length);
        for (let [x, y] of coors) {
            this.board[x][y] = ship;
        }
        this.ships.push(ship);

        return ship;
    }

    receiveAttack([x, y]) {
        const ship = this.board[x][y];

        if (ship != null) {
            ship.hit();
            
            if (ship.sunk === true)
                this.noOfShipsSunk += 1;
            
            if (this.noOfShipsSunk === this.ships.length)
                this.#report();
            
            this.striked.push(String(x) + String(y));
        }
        else {
            this.missed.push(String(x) + String(y));
        }
    }

    #report() {
        console.log("All friendly ships sunk!");
    }
}

class Player {
    gameboard = new Gameboard();
}

class RealPlayer extends Player {

}

class ComputerPlayer extends Player {

}

export { Ship, Gameboard, RealPlayer, ComputerPlayer };