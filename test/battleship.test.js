import { Ship, Gameboard, RealPlayer, ComputerPlayer } from "../src/battleship";

describe("Ship", () => {
    test("hit()", () => {
        const ship = new Ship(2);
        ship.hit();

        expect(ship.hits).toBe(1);
    });

    test("hit(): Sinking the ship when hits taken equals length", () => {
        const ship = new Ship(2);
        ship.hit();
        ship.hit();

        expect(ship.sunk).toBe(true);
    })

    test("hit(): Stop incrementing hit when ship is already sunk", () => {
        const ship = new Ship(2);
        ship.hit();
        ship.hit();
        // sunked, try hitting again
        ship.hit();

        expect(ship.hits).toBe(2);
    });
});

describe("Gameboard", () => {
    test("placeShip(): Place ship of length 2 horizontally starting at (0,0) and ending at (0,1)", () => {
        const gameboard = new Gameboard();
        const ship = gameboard.placeShip(2, [0, 0]);

        expect(gameboard.board[0][0]).toBe(ship);
        expect(gameboard.board[1][0]).toBe(ship);
    });

    test("placeShip(): Place ship of length 2 vertically starting at (0,0) and ending at (1,0)", () => {
        const gameboard = new Gameboard();
        const ship = gameboard.placeShip(2, [0, 0], "v");

        expect(gameboard.board[0][0]).toBe(ship);
        expect(gameboard.board[0][1]).toBe(ship);
    });

    test("placeShip(): Placing a ship on cell already occupied by another ship should not be allowed", () => {
        const gameboard = new Gameboard();
        gameboard.placeShip(2, [0,0]);
        const ship = gameboard.placeShip(2, [0, 0]);

        expect(ship).toBeNull();
    });

    test("placeShip(): Placing a ship outside board should not be allowed", () => {
        const gameboard = new Gameboard();
        const ship = gameboard.placeShip(2, [9, 0]);

        expect(ship).toBeNull();
    });

    test("receiveAttack()", () => {
        const gameboard = new Gameboard();
        const ship = gameboard.placeShip(2, [0, 0]);
        gameboard.receiveAttack([0, 0]);

        expect(ship.hits).toBe(1);
        expect(gameboard.striked).toEqual(["00"]);
    });
    
    test("receiveAttack(): sink a ship", () => {
        const gameboard = new Gameboard();
        const ship = gameboard.placeShip(2, [0, 0]);
        gameboard.receiveAttack([0, 0]);
        gameboard.receiveAttack([1, 0]);
        
        expect(ship.hits).toBe(2);
        expect(ship.sunk).toBe(true);
        expect(gameboard.noOfShipsSunk).toBe(1);
    });

    test("receiveAttack(): missed", () => {
        const gameboard = new Gameboard();
        const ship = gameboard.placeShip(2, [0, 0]);
        gameboard.receiveAttack([9, 9]);
        
        expect(ship.hits).toBe(0);
        expect(gameboard.missed).toEqual(["99"]);
    });
});

describe("Player", () => {
    test("RealPlayer and ComputerPlayer contains a gameboard object", () => {
        const realPlayer = new RealPlayer();
        const computerPlayer = new ComputerPlayer();
        
        expect(realPlayer.gameboard).not.toBeNull();
        expect(computerPlayer.gameboard).not.toBeNull();
    });
});