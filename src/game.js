import { Player } from "./player";

class Game {
    player1;
    player2;
    winner;
    turn = 0;
    gameOver = false;

    constructor(p1Name, p2Name, p1ShipDetails=[], p2ShipDetails=[]) {
        this.player1 = new Player(p1Name);
        this.player2 = new Player(p2Name, true);

        // place ships for player 1
        for (let detail of p1ShipDetails) {
            this.player1.gameboard.placeShip(detail.length, detail.coor, detail.orientation, detail.name);
        }

        // place ships for player 2
        if (p2ShipDetails.length > 0) {
            for (let detail of p2ShipDetails) {
                this.player2.gameboard.placeShip(detail.length, detail.coor, detail.orientation, detail.name);
            }
        }
        else {
            // use the same ship length and name information as p1ShipDetails
            // to place ships at random position for player 2
            this.player2.setupRandomShipPlacement(p1ShipDetails);
        }
    }

    // coor = [row:number, col:number]
    takeTurn(coor) {
        if (this.gameOver)
            return null;

        let result;
        if (this.whoseTurnIsIt() === 1) {
            console.log(`P1 attacks ${coor}`);
            result = this.player1.attack(this.player2, coor);
        } 
        else {
            console.log(`P2 attacks ${coor}`);
            result = this.player2.attack(this.player1, coor);
        }
        
        // invalid attack
        if (result === null)
            return result;

        this.checkGameOver();
        this.turn += 1;

        return result;
    }

    whoseTurnIsIt() {
        if (this.turn % 2 === 0) {
            // player1's turn
            return 1;
        } 
        else {
            // player2's turn
            return 2;
        }
    }

    checkGameOver() {
        if (this.player1.gameboard.allShipsDestroyed) {
            console.log("Winner is " + this.player2.name);
            this.gameOver = true;
            this.winner = this.player2;
        }

        else if (this.player2.gameboard.allShipsDestroyed) {
            console.log("Winner is " + this.player1.name);
            this.gameOver = true;
            this.winner = this.player1;
        }

        return this.gameOver;
    }
}

export { Game };