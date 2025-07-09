import React, { useState } from "react";
import "./TenziesProject.css";
import Die from "./Die";

export default function TenziesProject() {

    const [dice, setDice] = useState(() => generateAllNewDice());
    const [gameLost, setGameLost] = useState(false);

    const allClicked = dice.every(die => die.isClicked);
    const allSameValue = dice.every(die => die.value === dice[0].value);
    const diceValid = dice.length === 10 && dice.every(die => typeof die.value === 'number' && die.value >= 1 && die.value <= 6 && typeof die.isClicked === 'boolean' && typeof die.id !== 'undefined');

    const gameWon = diceValid && allClicked && allSameValue;

    // Detect loss: all dice clicked but not all values the same
    React.useEffect(() => {
        if (diceValid && allClicked && !allSameValue) {
            setGameLost(true);
        }
    }, [diceValid, allClicked, allSameValue]);

    function generateAllNewDice () {
        const newDice = [];

        for (let i = 0; i < 10; i++) {
            const rand = { 
                value: Math.ceil(Math.random() * 6), 
                isClicked: false,
                id: i + 1 
            };
            newDice.push(rand);
        }

        return newDice;
    }

    function rollDice() {   
        if (!diceValid || gameLost) return; // Prevent rolling if dice are invalid or lost
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isClicked ? die : { ...die, value: Math.ceil(Math.random() * 6) } 
            ));    
        }
        else {
            setDice(generateAllNewDice());
            setGameLost(false);
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ? { ...die, isClicked: !die.isClicked } : die
        ));
    }

    function newGame() {
        setDice(generateAllNewDice());
        setGameLost(false);
    }

    const diceElements = dice.map(dieObj => (
        <Die 
            key = {dieObj.id}
            value = {dieObj.value} 
            isClicked = {dieObj.isClicked}
            hold = {hold}
            id = {dieObj.id}
        />
    ));

    return ( 
        <div className="project-container">
            <main>
                <h1 className="title">
                    {gameWon ? "Congrats, You Won!" : gameLost ? "You lost!" : "Tenzies"} 
                </h1>
                <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

                {!diceValid && <p className="error-message">Error: Invalid dice state. Please refresh the game.</p>}

                <div className="dice-container">
                    {diceElements}
                </div>

                {gameLost ? (
                    <button className="roll-dice-btn" onClick={newGame}>New Game</button>
                ) : (
                    <button className="roll-dice-btn" onClick={rollDice} disabled={!diceValid}>
                        {gameWon ? "New Game" : "Roll"}
                    </button>
                )}
            </main>
        </div>
    )
}
