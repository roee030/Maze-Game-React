import * as myGameConstant from "../gameConstant/gameConstant";

function reducer(state, action) {
  switch (action.type) {
    case "startGame": {
      return {
        ...state,
        mazesEnd: false,
        round: state.gameOver ? 1 : action.payload.round,
        gameOver: false,
        maze: action.payload.maze,
        currentCell: action.payload.maze.startCell,
        time:
          action.payload.time > myGameConstant.ROUND_TIME
            ? action.payload.time
            : myGameConstant.ROUND_TIME,
        lollipopAppeared: false,
        iceCreamAppeared: false,
      };
    }
    case "decrementTime": {
      return {
        ...state,
        time: state.time - 1,
      };
    }
    case "hitLollipop": {
      return {
        ...state,
        points: state.points + 5000,
        time: state.time + 5,
        lollipopCell: null,
        lollipopAppeared: true,
      };
    }
    case "hitIceCream": {
      return {
        ...state,
        points: state.points + 10000,
        time: state.time + 4,
        iceCreamCell: null,
        iceCreamAppeared: true,
      };
    }
    case "gameOver": {
      return {
        ...state,
        points: 0,
        hiScore: Math.max(state.hiScore, state.points),
        gameOver: true,
        round: 0,
        lollipopCell: null,
        iceCreamCell: null,
        lollipopAppeared: false,
        iceCreamAppeared: false,
      };
    }
    case "win": {
      console.log(state.round, state.time, state.points);
      let reachingGoalPoint = state.round * state.time * 100 + state.points;
      console.log("state.time", state.time);
      return {
        ...state,
        points: reachingGoalPoint,

        time: myGameConstant.ROUND_TIME,
        round: state.round + 1,
        lollipopCell: null,
        iceCreamCell: null,
      };
    }
    case "moveLogo": {
      if (!state.time || state.mazesEnd) {
        return state;
      }
      let nextCell = undefined;
      let endOfStage;
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
              state.currentCell[0] - 1 === myGameConstant.ROWS - 1 &&
              state.currentCell[1] === myGameConstant.COLS - 1
            ) {
              endOfStage = true;
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
              state.currentCell[0] === myGameConstant.ROWS - 1 &&
              state.currentCell[1] - 1 === myGameConstant.COLS - 1
            ) {
              endOfStage = true;
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
              state.currentCell[0] + 1 === myGameConstant.ROWS - 1 &&
              state.currentCell[1] === myGameConstant.COLS - 1
            ) {
              endOfStage = true;
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
              state.currentCell[0] === myGameConstant.ROWS - 1 &&
              state.currentCell[1] + 1 === myGameConstant.COLS - 1
            ) {
              endOfStage = true;
            }
          }
          break;
        }
      }
      return {
        ...state,
        mazesEnd: endOfStage ? true : false,
        currentCell: nextCell || state.currentCell,
        points: nextCell ? state.points + 10 : state.points,
      };
    }
    default:
      throw new Error("Unknown action");
  }
}
export default reducer;
