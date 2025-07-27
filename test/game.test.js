import { Game } from "../src/game";

describe("Game", () => {
    test("takeTurn()", () => {
        const shipDetails = [
            { 
                name: undefined,
                orientation: undefined,
                length: 2,
                coor: [0,4]
            }
        ]
        const game = new Game("p1", "p2", shipDetails, shipDetails);

        // p1's turn
        game.takeTurn([0, 4]);
        expect(game.player2.gameboard.striked).toEqual(["0,4"]);
        
        // p2's turn
        game.takeTurn([0, 5]);
        expect(game.player1.gameboard.striked).toEqual(["0,5"]);
    });

    test("gameOver()", () => {
        const shipDetails = [
            { 
                name: undefined,
                orientation: undefined,
                length: 2,
                coor: [0,4]
            }
        ]
        const game = new Game("p1", "p2", shipDetails, shipDetails);
        
        // p1's turn
        game.takeTurn([0, 4]);
        
        // p2's turn
        game.takeTurn([0, 4]);

        // p1 destroys p2's ship;
        game.takeTurn([0, 5]);
        
        expect(game.gameOver).toBe(true);
    });
});