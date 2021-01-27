import React, { useCallback, useEffect, useReducer } from "react";
import styles from "./App.module.css";
import useInterval from "@use-it/interval";
import Header from "./Components/Header";
import Notification from "./Components/Notification";
import MazeGenerator from "./maze/MazeGenerator";
import Board from "./Components/Board";
import * as myGameConstant from "./gameConstant/gameConstant";
import reducer from "./reducers/reducers";

function App() {
  const [state, dispatch] = useReducer(reducer, myGameConstant.initialState);
  const callBackOnLollipop = () => {
    dispatch({ type: "hitLollipop" });
  };
  const callBackOnIceCream = () => {
    dispatch({ type: "hitIceCream" });
  };
  //Start new game
  const handleOnEnterKeyPressed = useCallback(() => {
    if (!state.time) {
      myGameConstant.mazeAudio.play();
      dispatch({
        type: "startGame",
        payload: {
          maze: new MazeGenerator(
            myGameConstant.ROWS,
            myGameConstant.COLS
          ).generate(),
          round: state.round + 1,
        },
      });
    }
  }, [state.time]);
  //move logo
  const handleOnArrowKeyPressed = useCallback(
    (arrowsKey) => {
      if (state.time) {
        dispatch({
          type: "moveLogo",
          payload: {
            arrowsKey,
          },
        });
      }
    },
    [state.time]
  );
  //Event Listtener on enter key to start new game
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.keyCode === 13) {
        handleOnEnterKeyPressed();
      }

      if (myGameConstant.arrowsKeys.includes(e.keyCode)) {
        handleOnArrowKeyPressed(e.keyCode);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleOnEnterKeyPressed]);

  useInterval(
    () => {
      dispatch({ type: "decrementTime" });
    },
    state.time ? 1000 : null
  );
  //game over
  useEffect(() => {
    if (
      state.time === 0 &&
      !(
        state.currentCell[0] == myGameConstant.ROWS - 1 &&
        state.currentCell[1] == myGameConstant.COLS - 1
      )
    ) {
      myGameConstant.mazeAudio.load();
      dispatch({ type: "gameOver" });
    }
  }, [state.time]);

  //generate lollipop cell index after amount of time
  const generateMatrixNumber = () => {
    let tempIndexs = [
      Math.floor(Math.random() * myGameConstant.ROWS),
      Math.floor(Math.random() * myGameConstant.COLS),
    ];

    if (
      state.currentCell[0] == tempIndexs[0] &&
      state.currentCell[1] == tempIndexs[1]
    ) {
      generateMatrixNumber();
    }
    return tempIndexs;
  };
  //Lollipop Image
  useEffect(() => {
    if (state.time === 4) {
      let lolipopIndexs = generateMatrixNumber();
      state.lollipopCell = lolipopIndexs;
    }
  }, [state.time]);

  //Ice Cream Image
  useEffect(() => {
    if (state.time === 3) {
      let iceCreamIndexs = generateMatrixNumber();
      state.iceCreamCell = iceCreamIndexs;
    }
  }, [state.time]);

  //success to escape the maze and win the stage!
  useEffect(() => {
    if (state.mazesEnd === true && state.time) {
      myGameConstant.mazeAudio.load();
      myGameConstant.levelEndAudio.play();
      const endMaze = () => {
        dispatch({ type: "win" });
        myGameConstant.mazeAudio.play();
        dispatch({
          type: "startGame",
          payload: {
            maze: new MazeGenerator(
              myGameConstant.ROWS,
              myGameConstant.COLS
            ).generate(),
            round: state.round + 1,
          },
        });
      };
      myGameConstant.levelEndAudio.addEventListener("ended", endMaze);
      return () =>
        myGameConstant.levelEndAudio.removeEventListener("ended", endMaze);
    }
  }, [state.mazesEnd]);

  return (
    <div className={styles.root}>
      <Header
        hiScore={state.hiScore}
        points={state.points}
        time={state.time}
        round={state.round}
      />
      <Board
        maze={state.maze}
        currentCell={state.currentCell}
        time={state.time}
        lollipopCell={state.lollipopCell}
        iceCreamCell={state.iceCreamCell}
        callBackOnLollipop={callBackOnLollipop}
        callBackOnIceCream={callBackOnIceCream}
      />
      <Notification
        show={!state.maze || state.gameOver}
        gameOver={state.time === 0 && !state.mazesEnd}
      />
    </div>
  );
}

export default App;
