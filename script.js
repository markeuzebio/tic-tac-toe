const game_controler = (
    function() 
    {   
        const _ROWS = 3;
        const _COLUMNS = 3;

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

            const getTokenAt = function(row, column) {
                return _board[row][column].getValue();
            };

            return {
                insertToken: insertToken,
                printBoard: printBoard,
                getTokenAt: getTokenAt
            };
        }

        function Player(player_name, player_token)
        {
            const name = player_name;
            const token = player_token;

            return {
                getPlayerName: () => name,
                getPlayerToken: () => token
            };
        }

        function GameController(player_one_name = "Player 1", player_two_name = "Player 2")
        {
            const _game_board = Gameboard();
            const _player_one = Player(player_one_name, 'X');
            const _player_two = Player(player_two_name, 'O');

            let active_player = _player_one;
            let game_over = false;

            const printNewRound = function() {
                console.log(`${active_player.getPlayerName()}'s (${active_player.getPlayerToken()}) turn.`);
                _game_board.printBoard();
            };

            const switchPlayerTurn = () => active_player === _player_one ? active_player = _player_two : active_player = _player_one;

            const isGameOver = function(row, column, token) {
                game_over = true;
                
                // Iterates over the row
                for(let c = 0 ; c < _COLUMNS ; c++)
                {
                    if(_game_board.getTokenAt(row, c) != token)
                    {
                        game_over = false;
                        break;
                    }
                }

                // Iterates over the column if it's not game over yet
                if(game_over == false)
                {
                    let r;

                    for(r = 0 ; r < _ROWS ; r++)
                        if(_game_board.getTokenAt(r, column) != token)
                            break;

                    game_over = r == _ROWS ? true : game_over;
                }

                // Iterates over diagonals if it's not game over yet
                if(game_over == false)
                {
                    let i;

                    for(i = 0 ; i < _ROWS ; i++)
                        if(_game_board.getTokenAt(i, i) != token)
                            break;

                    game_over = i == _ROWS ? true : game_over;

                    if(game_over == false)
                    {
                        let r = 0;
                        let c = _COLUMNS - 1;

                        while(r < _ROWS)
                        {
                            if(_game_board.getTokenAt(r, c) != token)
                            {
                                game_over = false;
                                break;
                            }

                            r++;
                            c--;
                        }

                        game_over = r == _ROWS ? true : game_over;
                    }
                }

                // Finally, checks is the board is fully filled
                if(game_over == false)
                {
                    for(let i = 0 ; i < _ROWS ; i++)
                        for(let j = 0 ; j < _COLUMNS ; j++)
                            if(_game_board.getTokenAt(i, j) == null)
                                return false;

                    game_over = true;
                    active_player = null;
                }

                return game_over;
            };

            const playRound = function(row, column) {
                if(game_over)
                    return false;
                else
                {
                    console.log(`${active_player.getPlayerName()}'s turn. Try to put ${active_player.getPlayerToken()} on (${row}, ${column}).`);

                    // Checks if the play is valid
                    if(_game_board.insertToken(row, column, active_player.getPlayerToken()) === true)
                    {
                        if(isGameOver(row, column, active_player.getPlayerToken()))
                        {
                            // Checks if it's a draw
                            if(active_player == null)
                                console.log("IT'S A DRAW");
                            else
                                console.log(`PLAYER ${active_player.getPlayerName()} WON!`);
                        }
                        else
                        {
                            switchPlayerTurn();
                            printNewRound();
                        }
                    }
                    else
                        return false;
                }

                return true;
            };

            return {
                playRound: playRound,
                getActivePlayer: () => active_player,
                isGameOver: () => game_over
            };
        }

        return GameController();
    }
)();

const game_ui = (
    function()
    {
        const _display_active_player = document.querySelector('.display');
        const _board_squares_array = Array.from(document.querySelectorAll('.board-square'));

        _board_squares_array.forEach((square) => square.addEventListener("click", addTokenToSquare));

        renderDisplay();

        function renderDisplay(string = game_controler.getActivePlayer().getPlayerName() + ` (${game_controler.getActivePlayer().getPlayerToken()})`) {
            _display_active_player.textContent = string;
        }

        function addTokenToSquare(e)
        {
            const square = e.target;
            const row = Math.floor(_board_squares_array.indexOf(square) / 3);
            const column = _board_squares_array.indexOf(square) % 3;
            const active_player = game_controler.getActivePlayer();

            if(game_controler.isGameOver())
                return;
            else
            {
                // If it is possible to put active_player_token in (row,column) square
                if(game_controler.playRound(row, column) === true)
                {
                    square.textContent = active_player.getPlayerToken();

                    if(game_controler.isGameOver())
                    {
                        if(game_controler.getActivePlayer() == null)
                            renderDisplay("DRAW!");
                        else
                            renderDisplay(`${active_player.getPlayerName()} WON!`);
                    }
                    else
                        renderDisplay();
                }
            }
        }
    }
)();