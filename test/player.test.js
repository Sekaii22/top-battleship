import { Player } from "../src/player";

describe("Player", () => {
    test("Player object contains a gameboard object", () => {
        const player = new Player();
        
        expect(player.gameboard).not.toBeNull();
    });
});