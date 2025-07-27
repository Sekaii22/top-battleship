import { Player } from "./player";

class Game {
    player1;
    player2;
    winner;
    turn = 0;
    gameOver = false;

    constructor(p1Name, p2Name, p1ShipDetails=[], p2ShipDetails=[], ai=true) {
        this.player1 = new Player(p1Name);
        this.player2 = new Player(p2Name, ai);

        for (let detail of p1ShipDetails) {
            this.player1.gameboard.placeShip(detail.length, detail.coor, detail.orientation, detail.name);
        }

        for (let detail of p2ShipDetails) {
            this.player2.gameboard.placeShip(detail.length, detail.coor, detail.orientation, detail.name);
        }
    }

    takeTurn(coor) {
        if (this.gameOver)
            return null;

        let result;
        if (this.whoseTurnIsIt() === 1) {
            console.log(`P1 attacks ${coor}`);
            result = this.player2.gameboard.receiveAttack(coor);
        } 
        else {
            console.log(`P2 attacks ${coor}`);
            result = this.player1.gameboard.receiveAttack(coor);
        }
        
        // invalid attack
        if (result === null)
            return null;

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