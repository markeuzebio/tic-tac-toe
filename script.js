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
            else {
                console.log(`Position already taken by ${_board[row][column].getValue()}`);
                return false;
            }
        }
        else {
            console.log("NOT A VALID POSITION TO BE PUT");
            return false;
        }

        return true;
    };

    const printBoard = function() {
        console.log(_board.map((row) => row.map((cell) => cell.getValue())));
    };

    return {
        insertToken: insertToken,
        printBoard: printBoard
    };
}

function Player(player_name, player_token)
{
    const name = player_name;
    const token = player_token;

    return {
        getPlayerName: () => name,
        getPlayerToken: () => token
    }
}

function GameController(player_one_name = "Player 1", player_two_name = "Player 2")
{
    const _game_board = Gameboard();
    const _player_one = Player(player_one_name, 'X');
    const _player_two = Player(player_two_name, 'O');

    let active_player = _player_one;

    const printNewRound = function() {
        console.log(`${active_player.getPlayerName()}'s (${active_player.getPlayerToken()}) turn.`);
        _game_board.printBoard();
    }

    const switchPlayerTurn = () => active_player === _player_one ? active_player = _player_two : active_player = _player_one;

    const playRound = function(row, column) {
        console.log(`${active_player.getPlayerName()}'s turn. Try to put ${active_player.getPlayerToken()} on (${row}, ${column}).`);

        // Checks if the play is valid
        if(_game_board.insertToken(row, column, active_player.getPlayerToken()) === true)
        {
            switchPlayerTurn();
            printNewRound();
        }
    }

    return {
        playRound: playRound,
        getActivePlayer: () => active_player
    };
}