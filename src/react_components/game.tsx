import React, { useState } from 'react';
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { useComponentValue } from "@dojoengine/react";
import BoardComponent from './board';
import Leaderboard from './leaderboard';
import Modal from './modal';
import "../App.css";
import { BurnerAccount } from '@dojoengine/create-burner';
import { getGame } from '../dojo/utils/getGame';
import { decodeString } from '../dojo/utils/decodeString';
import { getMap } from '../dojo/utils/getMap';

interface GameProps {
  account: BurnerAccount;
  entityId: Entity;
  gameId: number;
}

const Game: React.FC<GameProps> = ({ account, entityId, gameId }) => {
  const {
      setup: {
          systemCalls: { move },
          clientComponents: { Board, Tile, Game },
      },
  } = useDojo();

  // get current component values
  const game = getGame(gameId, Game) ?? { player_name: 'Unknown Player', round: 1, score: 0 };
  const matrix = getMap(gameId, Tile, Board);
  console.log("matrix", matrix);

  const [showModal, setShowModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleEndGame = () => {
    setGameEnded(true);
  };

  return (
    <div className="game-background">
      {gameEnded ? (
        <Leaderboard />
      ) : (
        <div className="game-content">
          <div>
            <div>Player: {decodeString(game.player_name)}</div>
            <div>Round: {game.round}</div>
            <div>Score: {game.score}</div>
            <div className="how-to-play" onClick={handleModalToggle}>
              How to play?
            </div>
          </div>
          <div className="board-content">
            <BoardComponent matrix={matrix} />
          </div>
          <div className="buttons-container">
            <div className="button-container">
              <button className="next-round-button" disabled={true}>Next Round</button>
            </div>
            <div className="button-container">
              <button className="end-game-button" onClick={handleEndGame}>End Game</button>
            </div>
          </div>
        </div>
      )}
      <Modal show={showModal} handleClose={handleModalToggle}>
        <h2>How to Play</h2>
        <p>
          Your goal is to collect all missing characters and bring them to their corresponding planet. Make sure
          not to run out of gas!
        </p>
      </Modal>
    </div>
  );
};

export default Game;
