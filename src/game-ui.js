function createPlayBoard(board, isPlayer=true) {
    const boardDiv = document.createElement("div");
    boardDiv.classList.add("board");

    for(let row = 0; row < 10; row++) {
        for(let col = 0; col < 10; col++) {
            const cell = document.createElement("div");
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.classList.add("cell");

            if (isPlayer && board.board[String([row, col])]) {
                cell.classList.add("occupied");
            }

            boardDiv.appendChild(cell);

            cell.addEventListener("click", () => {
                // attacks
            });
        }
    }

    return boardDiv
}

export { createPlayBoard };