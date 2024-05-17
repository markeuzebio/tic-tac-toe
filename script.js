function Square()
{
    let value = null;

    const setValue = (token) => value = token;
    const getValue = () => value;

    return {
        setValue: setValue,
        getValue: getValue
    };
}

function Gameboard()
{
    const _ROWS = 3;
    const _COLUMNS = 3;
    const _board = [];

    for(let i = 0 ; i < _ROWS ; i++)
    {
        _board[i] = [];

        for(let j = 0 ; j < _COLUMNS ; j++)
            _board[i].push(Square());
    }

    const insertToken = function(row, column, token) {
        if(row >= 0 && row < _ROWS && column >= 0 && column < _COLUMNS)
        {
            if(_board[row][column].getValue() == null)
                _board[row][column].setValue(token);
            else
                console.log(`Position already taken by ${_board[row][column].getValue()}`);
        }
        else
            console.log("NOT A VALID POSITION TO BE PUT");
    };

    const printBoard = function() {
        console.log(_board.map((row) => row.map((cell) => cell.getValue())));
    };

    return {
        insertToken: insertToken,
        printBoard: printBoard
    };
}