import { Player } from "../src/player";

describe("Player", () => {
    test("Player object contains a gameboard object", () => {
        const player = new Player();
        
        expect(player.gameboard).not.toBeNull();
    });

    test("attack()", () => {
        const player1 = new Player();
        const player2 = new Player();
        player2.gameboard.placeShip(2, [0, 0]);

        const result = player1.attack(player2, [0, 0]);

        expect(result).toBe(1);
        expect(player1.moves).toEqual(["0,0"]);
        expect(player2.gameboard.striked).toEqual(["0,0"]);
    });
});