<script>
    import { Minesweeper } from "$lib/index.ts";

    let minesweeper = new Minesweeper(20, 10);
    let handleReset = () => {
      minesweeper = new Minesweeper(20, 10);
    };
</script>

<div class="container">
    <div>
        {`Flags: ${minesweeper.flags}`}
    </div>
    <button class="reset" on:click={handleReset}>Reset</button>
    <div class="grid">
        {#each minesweeper.viewField as row, rowIndex}
        {#each minesweeper.viewField[rowIndex] as col, colIndex}
            {#if minesweeper.viewField[rowIndex][colIndex] === 1}
            <div class="tile">{minesweeper.mineField[rowIndex][colIndex]}</div>
            {:else}
            <button
                class="sweeper-button"
                on:contextmenu={(event) => {
                event.preventDefault();
                const result = minesweeper.handleFlag(rowIndex, colIndex);
                minesweeper.viewField = minesweeper.viewField;
                if (result !== 0) {
                    setTimeout(() => {
                    if (result === 1) {
                        alert("You win!");
                    } else {
                        alert("You lose");
                    }
                    }, 50);
                }
                }}
                on:click={() => {
                const result = minesweeper.handleClick(rowIndex, colIndex);
                minesweeper.viewField = minesweeper.viewField;
                if (result !== 0) {
                    setTimeout(() => {
                    if (result === 1) {
                        alert("You win!");
                    } else {
                        alert("You lose");
                    }
                    }, 50);
                }
                }}
            >
                {minesweeper.viewField[rowIndex][colIndex] === "F" ? "F" : ""}
            </button>
            {/if}
        {/each}
        {/each}
    </div>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
    }
    .reset {
        width: 12.5%;
        background-color: lightgray;
        border: 2px solid black;
    }
    .grid {
        display: grid;
        width: 50%;
        height: 80%;
        grid-template-columns: repeat(10, minmax(0, 1fr));
        grid-template-rows: repeat(20, minmax(0, 1fr));
    }
    .tile {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
    }
    .sweeper-button {
        margin: 0;
        background-color: gray;
    }
</style>
  
