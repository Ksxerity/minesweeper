// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Minesweeper {
			numberOfRows: number;
			numberOfColumns: number;
			mineField: (number | 'X')[][];
			viewField: (number | 'F')[][];
			NUMBER_OF_MINES: number;
			flags: number;
			numberOfUnopenedTiles: number;
		}
	}
}

export {};
