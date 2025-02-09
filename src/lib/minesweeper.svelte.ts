export default class Minesweeper implements App.Minesweeper{
    numberOfRows: number = $state(0);
    numberOfColumns: number = $state(0);
    mineField: (number | 'X')[][] = $state([]); // Grid for mine positions and number indicators that show how many mines are in the area
	  viewField: (number | 'F')[][] = $state([]); // Grid for keeping track of flags and what tiles should be revealed
    NUMBER_OF_MINES: number = $state(0);
    flags: number = $state(0);
    numberOfUnopenedTiles: number = $state(0);

    constructor(rows: number, columns: number) {
      this.numberOfRows = rows;
      this.numberOfColumns = columns;
      this.init();
    }
  
    createBoard = () => {
      this.mineField = new Array(this.numberOfRows)
        .fill(0)
        .map(() => new Array(this.numberOfColumns).fill(0));
      this.viewField = new Array(this.numberOfRows)
        .fill(0)
        .map(() => new Array(this.numberOfColumns).fill(0));
    }
  
    generateMines = () => {
      // Uses the Fisher–Yates Shuffle
      let numberOfTiles = this.numberOfColumns * this.numberOfRows;
      let randomizedArray = [];
      for (let i = 0; i < numberOfTiles; i++) {
        randomizedArray.push(i);
      }
  
      let x = numberOfTiles;
      let y = 0;
      let temp;
      while (x--) {
        y = Math.floor(Math.random() * x);
        temp = randomizedArray[x];
        randomizedArray[x] = randomizedArray[y];
        randomizedArray[y] = temp;
      }
      for (let i = 0; i < this.NUMBER_OF_MINES; i++) {
        let row = Math.floor(randomizedArray[i] / this.numberOfRows);
        let col = randomizedArray[i] % this.numberOfColumns;
        this.mineField[row][col] = 'X';
        if (row !== 0) {
          // Update above count
          if (this.mineField[row - 1][col] !== 'X') {
            this.mineField[row - 1][col] = (this.mineField[row - 1][col] as number) + 1;
          }
        }
        if (row !== this.numberOfRows - 1) {
          // Update below count
          if (this.mineField[row + 1][col] !== 'X') {
            this.mineField[row + 1][col] = (this.mineField[row + 1][col] as number) + 1;
          }
        }
        if (col !== 0) {
          // Update left count
          if (this.mineField[row][col - 1] !== 'X') {
            this.mineField[row][col -1] = (this.mineField[row][col - 1] as number) + 1;
          }
        }
        if (col !== this.numberOfColumns - 1) {
          // Update right count
          if (this.mineField[row][col + 1] !== 'X') {
            this.mineField[row][col + 1] = (this.mineField[row][col + 1] as number) + 1;
          }
        }
        if (row !== 0 && col !== 0) {
          // Update top-left count
          if (this.mineField[row - 1][col - 1] !== 'X') {
            this.mineField[row - 1][col - 1] = (this.mineField[row - 1][col - 1] as number) + 1;
          }
        }
        if (row !== 0 && col !== this.numberOfColumns - 1) {
          // Update top-right count
          if (this.mineField[row - 1][col + 1] !== 'X') {
            this.mineField[row - 1][col + 1] = (this.mineField[row - 1][col + 1] as number) + 1;
          }
        }
        if (row !== this.numberOfRows - 1 && col !== 0) {
          // Update bottom-left count
          if (this.mineField[row + 1][col - 1] !== 'X') {
            this.mineField[row + 1][col - 1] = (this.mineField[row + 1][col - 1] as number) + 1;
          }
        }
        if (row !== this.numberOfRows - 1 && col !== this.numberOfColumns - 1) {
          // Update bottom-right count
          if (this.mineField[row + 1][col + 1] !== 'X') {
            this.mineField[row + 1][col + 1] = (this.mineField[row + 1][col + 1] as number) + 1;
          }
        }
      }
    }
  
    init = () => {
      this.NUMBER_OF_MINES = (this.numberOfColumns * this.numberOfRows) * 0.2;
      this.flags = this.NUMBER_OF_MINES;
      this.numberOfUnopenedTiles = this.numberOfColumns * this.numberOfRows;
      this.createBoard();
      this.generateMines();
    }
  
    revealTiles = (row: number, col: number) => {
      if (0 <= row && row < this.numberOfRows && 0 <= col && col < this.numberOfColumns) {
        if (this.viewField[row][col] === 0) {
          this.viewField[row][col] = 1;
          this.numberOfUnopenedTiles -= 1;
          if (this.mineField[row][col] === 0) {
            this.revealTiles(row - 1, col);
            this.revealTiles(row, col - 1);
            this.revealTiles(row + 1, col);
            this.revealTiles(row, col + 1);
          }
        }
      }
    }
  
    checkSolution = () => {
      if (this.flags !== 0) return -1
      for (let row = 0; row < this.numberOfRows; row++) {
        for (let col = 0; col < this.numberOfColumns; col++) {
          if (this.viewField[row][col] === 'F') {
            if (this.mineField[row][col] !== 'X') {
              return -1;
            }
          }
        }
      }
      return 1;
    }
  
    handleClosedTileClick = (row: number, col: number) => {
      if (this.mineField[row][col] === 'X') {
        this.viewField[row][col] = 1;
        return -1;
      }
      this.revealTiles(row, col);
      if (this.numberOfUnopenedTiles === 0) {
        return this.checkSolution();
      }
      return 0;
    }
  
    handleFlag = (row: number, col: number) => {
      if (this.viewField[row][col] === 'F') {
        this.viewField[row][col] = 0;
        this.flags += 1;
        this.numberOfUnopenedTiles += 1;
      } else {
        this.viewField[row][col] = 'F';
        this.flags -= 1;
        this.numberOfUnopenedTiles -= 1;
      }
      if (this.numberOfUnopenedTiles === 0) {
        return this.checkSolution();
      }
      return 0;
    }

    handleOpenTileClick = (row: number, col: number) => {
      let flags = 0;
      const nonFlagCoordinate = [];
      if (row !== 0) {
        // Update above count
        if (this.viewField[row - 1][col] === 'F') {
          flags += 1;
        } else {
          nonFlagCoordinate.push([row - 1, col])
        }
      }
      if (row !== this.numberOfRows - 1) {
        // Update below count
        if (this.viewField[row + 1][col] === 'F') {
          flags += 1;
        } else {
          nonFlagCoordinate.push([row + 1, col])
        }
      }
      if (col !== 0) {
        // Update left count
        if (this.viewField[row][col - 1] === 'F') {
          flags += 1;
        } else {
          nonFlagCoordinate.push([row, col - 1])
        }
      }
      if (col !== this.numberOfColumns - 1) {
        // Update right count
        if (this.viewField[row][col + 1] === 'F') {
          flags += 1;
        } else {
          nonFlagCoordinate.push([row, col + 1])
        }
      }
      if (row !== 0 && col !== 0) {
        // Update top-left count
        if (this.viewField[row - 1][col - 1] === 'F') {
          flags += 1;
        } else {
          nonFlagCoordinate.push([row - 1, col - 1])
        }
      }
      if (row !== 0 && col !== this.numberOfColumns - 1) {
        // Update top-right count
        if (this.viewField[row - 1][col + 1] === 'F') {
          flags += 1;
        } else {
          nonFlagCoordinate.push([row - 1, col + 1])
        }
      }
      if (row !== this.numberOfRows - 1 && col !== 0) {
        // Update bottom-left count
        if (this.viewField[row + 1][col - 1] === 'F') {
          flags += 1;
        } else {
          nonFlagCoordinate.push([row + 1, col - 1])
        }
      }
      if (row !== this.numberOfRows - 1 && col !== this.numberOfColumns - 1) {
        // Update bottom-right count
        if (this.viewField[row + 1][col + 1] === 'F') {
          flags += 1;
        } else {
          nonFlagCoordinate.push([row + 1, col + 1])
        }
      }
      if (flags === this.mineField[row][col]) {
        let lost = false;
        nonFlagCoordinate.forEach((coord) => {
          if (this.mineField[coord[0]][coord[1]] === 'X') {
            lost = true;
          }
          this.viewField[coord[0]][coord[1]] = 1;
        })
        return lost ? -1 : 1
      }
      return 1;
    }
  }