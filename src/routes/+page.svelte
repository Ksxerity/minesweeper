<script lang="ts">
    import { Minesweeper } from "$lib/index.ts";
    import { Button } from "$lib/components/ui/button/index.ts";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.ts";
    import { FlagIcon } from "$lib/assets/index.ts";

    let boardSize: '10x10' | '15x15' | '20x20' = $state('10x10');
    let rowInput = $state(10);
    let colInput = $state(10);
    let minesweeper = $state(new Minesweeper(rowInput, colInput));
    
    const handleReset = () => {
      minesweeper = new Minesweeper(rowInput, colInput);
    };

    const changeSizeOfBoard = (size: '10x10' | '15x15' | '20x20') => {
        switch (size) {
            case '10x10':
                rowInput = 10;
                colInput = 10;
                break;
            case '15x15':
                rowInput = 15;
                colInput = 15;
                break;
            default:
                rowInput = 20;
                colInput = 20;
                break;
        }
        handleReset();
    }
</script>

<div class="flex items-center justify-center flex-col h-screen w-screen">
    <div>
        <div class="flex justify-center font-['Poppins'] text-4xl mb-2">
            Minesweeper
        </div>
        <div class="flex justify-between items-center mb-2">
            <Button 
                onclick={handleReset}
            >
                Reset
            </Button>
            <div class="flex justify-center items-center self-stretch border-slate-500 border-2 px-2">
                <img class="h-[20px] pr-2" src={FlagIcon} alt="Flag" />
                {minesweeper.flags}
            </div>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <Button builders={[builder]}>
                        Size
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-56">
                    <DropdownMenu.RadioGroup bind:value={boardSize}>
                        <DropdownMenu.RadioItem on:click={() => changeSizeOfBoard('10x10')} value="10x10">10x10</DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem on:click={() => changeSizeOfBoard('15x15')} value="15x15">15x15</DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem on:click={() => changeSizeOfBoard('20x20')} value="20x20">20x20</DropdownMenu.RadioItem>
                    </DropdownMenu.RadioGroup>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
        <div 
            class="grid border-slate-500 border-2"
            style="
                grid-template-columns: repeat({colInput}, minmax(0, 30px));
                grid-template-rows: repeat({rowInput}, minmax(0, 30px));
            "
        >
            {#each minesweeper.viewField as row, rowIndex}
            {#each minesweeper.viewField[rowIndex] as col, colIndex}
                <div class="flex justify-center">
                    {#if minesweeper.viewField[rowIndex][colIndex] === 1}
                    <Button 
                        class="h-auto grow m-px rounded bg-transparent text-black hover:bg-transparent"
                        onclick={() => {
                            const result = minesweeper.handleOpenTileClick(rowIndex, colIndex);
                            if (result === -1) {
                                setTimeout(() => {
                                    alert("You lose");
                                }, 50);
                            }
                        }}
                    >
                        {minesweeper.mineField[rowIndex][colIndex]}
                    </Button>
                    {:else}
                    <Button
                        class="h-auto grow m-px p-1.5 rounded"
                        oncontextmenu={(event) => {
                            event.preventDefault();
                            const result = minesweeper.handleFlag(rowIndex, colIndex);
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
                        onclick={() => {
                            const result = minesweeper.handleClosedTileClick(rowIndex, colIndex);
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
                        {#if minesweeper.viewField[rowIndex][colIndex] === "F"}
                            <img src={FlagIcon} alt="Flag" />
                        {/if}
                    </Button>
                    {/if}
                </div>
            {/each}
            {/each}
        </div>
    </div>
</div>

