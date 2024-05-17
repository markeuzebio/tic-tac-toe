function Square()
{
    let value = null;

    const setValue = (value) => this.value = value;
    const getValue = () => this.value;

    return {
        setValue: setValue,
        getValue: getValue
    };
}

function Gameboard()
{
    const ROWS = 3;
    const COLUMNS = 3;
    const board = [];

    for(let i = 0 ; i < ROWS ; i++)
    {
        board[i] = [];

        for(let j = 0 ; j < COLUMNS ; j++)
            board[i].push(Square());
    }
}