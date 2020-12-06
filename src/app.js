

import ReactDND from 'react-dnd';
import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { array } from 'prop-types';


const itemTypes = {
    TILE: 'tile'
}


const Cell = (props) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: itemTypes.TILE,
        collect: monitor => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver()
        }),
        drop: (item, monitor) => {
            return { thing: props.address }
        }
    })

    const isActive = canDrop && isOver

    let backgroundColor = '#fff';
    if (isActive) {
        backgroundColor = 'darkgreen';
    }
    else if (canDrop) {
        backgroundColor = 'darkkhaki';
    }

    return (
        <span
            ref={drop}
            style={{ width: "40px", height: "40px", display: "inline-flex", justifyContent: "center", alignItems: "center", border: "1px solid black", backgroundColor }}>
            {props.children}
        </span>
    );

}


const RackCell = (props) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: itemTypes.TILE,
        collect: monitor => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver()
        }),
        drop: (item, monitor) => {
            console.log('chops ' + props.idx)
            return { idx: props.idx, player: props.player }
        }
    })

    const isActive = canDrop && isOver

    let backgroundColor = '#fff';
    if (isActive) {
        backgroundColor = 'darkgreen';
    }
    else if (canDrop) {
        backgroundColor = 'darkkhaki';
    }

    return (
        <span
            ref={drop}
            style={{ width: "40px", height: "40px", display: "inline-flex", backgroundColor }}>
            {props.children}
        </span>
    );

}


const Player = ({ board, myRack, setMyRack, setBoard, setCurrentBoardState, player, gameBoard }) => {
    const [turn, setTurn] = useState(false);


    return (
        <>
            <Board board={board} setBoard={setBoard} rack={myRack} setRack={setMyRack} gameBoard={gameBoard} />
            <Rack player={player} myRack={myRack} setMyRack={setMyRack} player={player} board={board} setBoard={setBoard} setCurrentBoardState={setCurrentBoardState} />
        </>
    )

}


const GameBoard = ({ gameBoard, updateGameBoard }) => {

    return gameBoard.map((row, i) => (

        <div style={{ display: "flex", position: "relative", left: "400px", top: "150px" }}>
            {row.map((piece, j) => {
                // console.log(`gameBoard: ${JSON.stringify(piece)}`)
                return < CellTile key={`1${i}${j}`} board={gameBoard} setBoard={updateGameBoard} address={[i, j]} piece={piece}>{piece.value}</CellTile>
            }
            )}
        </div >
    ))
}

const Board = ({ board, setBoard, rack, setRack, gameBoard }) => {

    return board.map((row, i) => (
        <div style={{ display: "flex" }}>
            {row.map((piece, j) => {
                if (gameBoard[i][j].value === 'x') {
                    if (piece.isActive) {
                        return (<CellTile key={`${i}${j}`} board={board} setBoard={setBoard} address={[i, j]} rack={rack} setRack={setRack} piece={piece}>{piece.value}</CellTile>)
                    } else {
                        return (<Cell key={`${i}${j}`} address={[i, j]}>{piece.value}</Cell>)
                    }
                } else {
                    return (<SetTile key={`${i}${j}`} address={[i, j]} piece={piece} >{piece.value}</SetTile>)
                }
            }
            )}
        </div>
    ))
}



const SetTile = (props) => {
    // 
    return (
        <span style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black" }}>{props.children}</span>
    );
}

const CellTile = (props) => {
    const [collectedProps, drag] = useDrag({
        item: { type: itemTypes.TILE, value: props.piece, address: props.address },
        begin: (monitor) => {

            const setPiece = Object.assign({}, props.piece)
            const refreshBoard = [...props.board]
            refreshBoard[props.address[0]][props.address[1]].value = 'x';
            refreshBoard[props.address[0]][props.address[1]].isActive = false;

            console.log(setPiece)

            return ({ piece: setPiece, newBoard: refreshBoard });

        },
        end: (item, monitor) => {
            console.log('hello')
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                console.log(`In CellTile: ${JSON.stringify(item)} - ${JSON.stringify(dropResult)}`)
                const newBoard = [...item.newBoard]
                console.log('14' + JSON.stringify(props) + '123 ' + JSON.stringify(collectedProps) + '1234 ' + JSON.stringify(item));
                if (dropResult.idx) {
                    console.log(`12 ${JSON.stringify(item)}`)
                    const newRack = [...props.rack]
                    newRack[dropResult.idx] = item.piece.value;
                    props.setRack(dropResult.player, newRack)
                } else if (dropResult.thing) {
                    newBoard[dropResult.thing[0]][dropResult.thing[1]].value = item.piece.value;
                    newBoard[dropResult.thing[0]][dropResult.thing[1]].isActive = true;
                }

                props.setBoard(newBoard);


            }
        }
    })
    return (
        <span ref={drag} style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black" }}>{props.children}</span>
    );
}
const insert = (arr, index, newItem) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index)
]

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item)
}


const Tile = (props) => {

    const [collectedProps, drag] = useDrag({
        item: { type: itemTypes.TILE, value: props.children, index: props.idx },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                console.log(`${JSON.stringify(item)} - ${JSON.stringify(dropResult)}`)
                if (dropResult.thing) {
                    const newBoard = [...props.board]
                    newBoard[dropResult.thing[0]][dropResult.thing[1]].value = item.value;
                    newBoard[dropResult.thing[0]][dropResult.thing[1]].isActive = true;
                    props.setBoard(newBoard);


                    const newRack = [...props.myRack];
                    // newRack.splice(props.idx, 1);
                    newRack[props.idx] = 'Cell';
                    props.setMyRack(props.player, newRack);
                } else {
                    const thisRack = [...props.myRack]
                    thisRack.map((d) => {
                        console.log('s ' + d);
                    })
                    const thisItem = thisRack.splice(item.index, 1);
                    console.log('fire' + thisItem);

                    thisRack.insert(dropResult.idx, thisItem);
                    console.log(props.myRack)
                    console.log(thisRack)
                    props.setMyRack(props.player, thisRack);

                }


            }
        }
    })

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: itemTypes.TILE,
        collect: monitor => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver()
        }),
        hover: (item, monitor) => {
            console.log("hovr ")
        },
        drop: (item, monitor) => {
            console.log('poop' + JSON.stringify(item))
            return { idx: props.idx }
        }
    })

    const isActive = canDrop && isOver

    let backgroundColor = '#fff';
    if (isActive) {
        backgroundColor = 'darkgreen';
    }
    else if (canDrop) {
        backgroundColor = 'lightblue';
    }

    const attachRef = el => {
        drag(el)
        drop(el)
    }
    return (
        <span ref={attachRef} style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", backgroundColor }}>{props.children}</span>
    );
}

const Rack = ({ board, setBoard, myRack, setMyRack, setCurrentBoardState, player }) => {
    return (
        <div style={{ marginTop: "50px", display: "flex" }}>
            {myRack.map((piece, idx) => {
                console.log('building rack ' + piece)
                if (piece === "Cell") {
                    return <RackCell key={idx} idx={idx} player={player}></RackCell>
                } else {
                    return <Tile key={idx} player={player} board={board} setBoard={setBoard} myRack={myRack} setMyRack={setMyRack} idx={idx} setCurrentBoardState={setCurrentBoardState} >{piece}</Tile>
                }
            })}
        </div>
    )
}


const App = () => {
    const [game, setGame] = useState([
        { score: 0, rack: [], key: "1" },
        { score: 0, rack: [], key: "2" }
    ]);
    const [flag, setFlag] = useState(false);
    const [gameBoard, setGameBoard] = useState([[{ value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }],
    [{ value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }],
    [{ value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }]]);
    // const [myRack, setMyRack] = useState(['a', 'b', 'c'])
    const rackSize = 7;
    const [board, setBoard] = useState([
        [{ value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }],
        [{ value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }],
        [{ value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }, { value: 'x', isActive: false, positionMultiplier: '1', rowMultiplier: '1' }]]);



    const [currentBoardState, setCurrentBoardState] = useState([...board]);
    const [letterBank, setLetterBank] = useState(
        {
            'A': { letter: 'A', count: 9, value: 1 }, 'B': { letter: 'B', count: 2, value: 3 },
            'C': { letter: 'C', count: 2, value: 3 }, 'D': { letter: 'D', count: 4, value: 2 },
            'E': { letter: 'E', count: 12, value: 1 }, 'F': { letter: 'F', count: 2, value: 4 },
            'G': { letter: 'G', count: 3, value: 3 }, 'H': { letter: 'H', count: 2, value: 2 },
            'I': { letter: 'I', count: 9, value: 1 }, 'J': { letter: 'J', count: 1, value: 8 },
            'K': { letter: 'K', count: 1, value: 5 }, 'L': { letter: 'L', count: 4, value: 1 },
            'M': { letter: 'M', count: 3, value: 3 }, 'N': { letter: 'N', count: 6, value: 1 },
            'O': { letter: 'O', count: 8, value: 1 }, 'P': { letter: 'P', count: 2, value: 3 },
            'Q': { letter: 'Q', count: 1, value: 10 }, 'R': { letter: 'R', count: 6, value: 1 },
            'S': { letter: 'S', count: 4, value: 1 }, 'T': { letter: 'T', count: 6, value: 1 },
            'U': { letter: 'U', count: 4, value: 1 }, 'V': { letter: 'V', count: 2, value: 4 },
            'W': { letter: 'W', count: 2, value: 4 }, 'X': { letter: 'X', count: 1, value: 10 },
            'Y': { letter: 'Y', count: 2, value: 4 }, 'Z': { letter: 'Z', count: 1, value: 10 },
            'Blank': { letter: '', count: 2, value: 0 }
        })

    const getRandomNumber = () => {
        return Math.floor(Math.random() * 27);
    }

    const setPlayerRack = (playerIndex, newRack) => {

        const myGame = [...game]
        myGame[playerIndex].rack = newRack;
        // console.log('24' + myGame[playerIndex].rack)
        setGame(myGame)
        // console.log(game);


    }

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Blank']

    const getRandomLetter = () => {
        let rand = getRandomNumber();
        while (letterBank[letters[rand]].count <= 0) {
            rand = getRandomNumber();
        }
        const newLetterBank = Object.assign({}, letterBank);
        const letter = newLetterBank[letters[rand]]
        letter.count = letter.count - 1;
        setLetterBank(newLetterBank)
        // console.log(letter.letter);
        return letter.letter;
    }

    let fillRack = (player, idx) => {
        let startingLetters = [];

        for (var i = 0; i < 7; i++) {
            startingLetters.push(getRandomLetter());
        }

        const myPlayers = [...game];
        console.log(`${idx} ${JSON.stringify(myPlayers[idx])}`);
        myPlayers[idx].rack = startingLetters;
        setGame(myPlayers);
        console.log(game)
    };

    useEffect(() => {


        console.log(gameBoard)
        game.forEach((player, i) => {
            fillRack(player, i)
        })
    }, [])

    const updateGameBoard = () => {
        let gameBoardState = [...gameBoard]
        console.log('gravy' + JSON.stringify(board))
        gameBoard.map((row, i) => {
            row.map((tile, idx) => {
                if (gameBoard[i][idx].value == 'x') {
                    // console.log(`${i}${idx}` + JSON.stringify(board[i][idx]))
                    gameBoardState[i][idx] = JSON.parse(JSON.stringify(board[i][idx]))
                }
            })
        })

        setGameBoard([...gameBoardState])

    }


    const refillRack = (i) => {
        const newRack = [];
        let newLetters = [...game][i].rack;

        for (var j = 0; j < rackSize; j++) {
            if (newLetters[j] !== 'Cell') {
                newRack.push(newLetters[j])
                console.log('adding' + newLetters[j])
            }
        }

        while (newRack.length < rackSize) {
            newRack.push(getRandomLetter());
        }
        setPlayerRack(i, newRack);

        setCurrentBoardState([...board])
        updateGameBoard();

    }

    const refreshBoardState = () => {
        setBoard(currentBoardState);
    }


    return (
        <div>
            <GameBoard gameBoard={gameBoard} setGameBoard={setGameBoard} />
            {game.map((player, i) => (
                <div key={i}>
                    <Player player={i} board={board} myRack={player.rack} setMyRack={setPlayerRack} setBoard={setBoard} setCurrentBoardState={setCurrentBoardState} gameBoard={gameBoard} />
                    <button onClick={() => refreshBoardState()}>refresh board</button>
                    <button onClick={() => refillRack(i)}>click</button>
                </div>
            ))}

        </div>
    );
}





export default App;

