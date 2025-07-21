import { Ship } from "../src/battleship";

describe("Ship", () => {
    test("Takes a hit", () => {
        const ship = new Ship(2);
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test("Sinking the ship when hits taken equals length", () => {
        const ship = new Ship(2);
        ship.hit();
        ship.hit();
        expect(ship.sunk).toBe(true);
    })

    test("Stop incrementing hit when ship is already sunk", () => {
        const ship = new Ship(2);
        ship.hit();
        ship.hit();
        // sunked, try hitting again
        ship.hit();
        expect(ship.hits).toBe(2);
    });
});