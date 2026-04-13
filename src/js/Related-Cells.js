//creates a relations between the selected row, column and box
const cells = [];

for (let row = 0; row < 9; row++) {
    cells[row] = [];

    for (let col = 0; col < 9; col++) {
        const cell = createCell();
        cell.classList.add("sudoku-cell");

        cells[row][col] = cell;

        cell.addEventListener("click", () => {
            highlightRelated(row, col);
        });
    }
}
export function clearRelatedHighlights() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            cells[row][col].classList.remove("selected");
            cells[row][col].classList.remove("related");
        }
    }
}

exportfunction highlightRelated(selectedRow, selectedCol) {
    clearRelatedHighlights();

    const boxRow = Math.floor(selectedRow / 3);
    const boxCol = Math.floor(selectedCol / 3);

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const sameRow = row === selectedRow;
            const sameCol = col === selectedCol;
            const sameBox =
                Math.floor(row / 3) === boxRow &&
                Math.floor(col / 3) === boxCol;

            if (sameRow || sameCol || sameBox) {
                cells[row][col].classList.add("related");
            }
        }
    }

    cells[selectedRow][selectedCol].classList.remove("related");
    cells[selectedRow][selectedCol].classList.add("selected");
}