import React, { useCallback, useEffect, useReducer } from "react";
import styles from "./App.module.css";
import useInterval from "@use-it/interval";
import Header from "./Header";
import Notification from "./Notification";
import MazeGenerator from "./maze/MazeGenerator";
import Board from "./Board";
import MazeSoundSrc from "./audio/maze.mp3";
import levelEndAudioSrc from "./audio/level_end.mp3";
const ROUND_TIME = 5;
const ROWS = 3;
const COLS = 3;
const arrowsKeys = [37, 38, 39, 40];
const mazeAudio = new Audio(MazeSoundSrc);
mazeAudio.loop = true;
const levelEndAudio = new Audio(levelEndAudioSrc);
function reducer(state, action) {
  switch (action.type) {
    case "startGame": {
      return {
        ...state,
        mazesEnd: false,
        maze: action.payload.maze,
        currentCell: action.payload.maze.startCell,
        time: ROUND_TIME,
      };
    }
    case "decrementTime": {
      return {
        ...state,
        time: state.time - 1,
      };
    }

    case "gameOver": {
      return {
        ...state,
        points: 0,
        round: 1,
      };
    }
    case "win": {
      console.log(state.round);
      let reachingGoalPoint = state.round * state.time * 100;

      return {
        ...state,
        points: 0,
        hiScore: Math.max(state.hiScore, reachingGoalPoint),
        time: 60,
        round: state.round + 1,
      };
    }
    case "moveLogo": {
      if (!state.time || state.mazesEnd) {
        return state;
      }
      let nextCell = undefined;

      switch (action.payload.arrowsKey) {
        case 37: {
          //LEFT
          if (state.currentCell[0] == 0 && state.currentCell[1] == 0) {
            break;
          }
          if (
            !state.maze.cells[
              state.currentCell[0] + state.currentCell[1] * state.maze.cols
            ][3]
          ) {
            nextCell = [state.currentCell[0] - 1, state.currentCell[1]];
            if (
              state.currentCell[0] - 1 === ROWS - 1 &&
              state.currentCell[1] === COLS - 1
            ) {
              state.mazesEnd = true;
            }
          }
          break;
        }
        case 38: {
          //UP
          if (
            !state.maze.cells[
              state.currentCell[0] + state.currentCell[1] * state.maze.cols
            ][0]
          ) {
            nextCell = [state.currentCell[0], state.currentCell[1] - 1];
            if (
              state.currentCell[0] === ROWS - 1 &&
              state.currentCell[1] - 1 === COLS - 1
            ) {
              state.mazesEnd = true;
            }
          }
          break;
        }
        case 39: {
          //RIGHT
          if (
            !state.maze.cells[
              state.currentCell[0] + state.currentCell[1] * state.maze.cols
            ][1]
          ) {
            nextCell = [state.currentCell[0] + 1, state.currentCell[1]];
            if (
              state.currentCell[0] + 1 === ROWS - 1 &&
              state.currentCell[1] === COLS - 1
            ) {
              state.mazesEnd = true;
            }
          }
          break;
        }
        case 40: {
          //DOWN
          if (
            !state.maze.cells[
              state.currentCell[0] + state.currentCell[1] * state.maze.cols
            ][2]
          ) {
            nextCell = [state.currentCell[0], state.currentCell[1] + 1];
            //check if logo reach the goal cell
            if (
              state.currentCell[0] === ROWS - 1 &&
              state.currentCell[1] + 1 === COLS - 1
            ) {
              state.mazesEnd = true;
            }
          }
          break;
        }
      }
      return {
        ...state,
        currentCell: nextCell || state.currentCell,
        points: nextCell ? state.points + 10 : state.points,
      };
    }
    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    points: 0,
    round: 1,
    hiScore: 0,
    time: undefined,
    maze: undefined,
    currentCell: undefined,
    mazesEnd: false,
  });

  const handleOnEnterKeyPressed = useCallback(() => {
    if (!state.time) {
      mazeAudio.play();
      dispatch({
        type: "startGame",
        payload: {
          maze: new MazeGenerator(ROWS, COLS).generate(),
        },
      });
    }
  }, [state.time]);

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
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.keyCode === 13) {
        handleOnEnterKeyPressed();
      }

      if (arrowsKeys.includes(e.keyCode)) {
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

  useEffect(() => {
    if (state.time === 0) {
      mazeAudio.load();
      dispatch({ type: "gameOver" });
    }
  }, [state.time]);

  useEffect(() => {
    if (state.mazesEnd === true && state.time) {
      mazeAudio.load();
      levelEndAudio.play();
      levelEndAudio.addEventListener("ended", () => {
        dispatch({ type: "win" });
        mazeAudio.play();
        dispatch({
          type: "startGame",
          payload: {
            maze: new MazeGenerator(ROWS, COLS).generate(),
          },
        });
      });
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
      <Board maze={state.maze} currentCell={state.currentCell} />
      <Notification
        show={!state.time}
        gameOver={state.time === 0 && !state.mazesEnd}
      />
    </div>
  );
}

export default App;
