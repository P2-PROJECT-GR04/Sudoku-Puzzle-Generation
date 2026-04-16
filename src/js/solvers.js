import { Sudoku } from './sudoku.js'

/**
 * Tries to solve a cell on the board with a naked single
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a naked single, False if not
 */
function naked_single(sudoku) {
    // Find an instance of a naked single
    // Update the board
    // Return true, or false if no naked single was found
}

/**
 * Tries to solve a cell on the board with a naked pair
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a naked pair, False if not */
function naked_pair(sudoku) {
    // Find an instance of a naked pair
    // Update the board
    // Return true, or false if no naked pair was found
}

/**
 * Tries to solve a cell on the board with a hidden single
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a hidden single, False if not
 */
function hidden_single(sudoku) {
    // Find an instance of a hidden single
    // Update the board
    // Return true, or false if no hidden single was found
}

/**
 * Tries to solve a cell on the board with a hidden pair
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a hidden pair, False if not */
function hidden_pair(sudoku) {
    // Find an instance of a hidden pair
    // Update the board
    // Return true, or false if no hidden pair was found
}

/**
 * Tries to solve a cell on the board with an x-wing
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find an x-wing, False if not */
function x_wing(sudoku) {}

/**
 * Tries to solve a cell on the board with a y-wing
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a y-wing, False if not */
function y_wing(sudoku) {}

/**
 * Tries to solve a cell on the board with a swordfish
 * @modifies {sudoku}
 * @param {Sudoku} sudoku
 * @returns {boolean} True if it could find a swordfish, False if not */
function swordfish(sudoku) {}
