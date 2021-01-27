import MazeSoundSrc from "../audio/maze.mp3";
import levelEndAudioSrc from "../audio/level_end.mp3";

export const ROUND_TIME = 6;
export const ROWS = 3;
export const COLS = 3;
export const arrowsKeys = [37, 38, 39, 40];
export const mazeAudio = new Audio(MazeSoundSrc);
mazeAudio.loop = true;
export const levelEndAudio = new Audio(levelEndAudioSrc);

export const initialState = {
  points: 0,
  round: 0,
  hiScore: 0,
  time: undefined,
  maze: undefined,
  currentCell: undefined,
  mazesEnd: false,
  gameOver: false,
  lollipopCell: null,
  lollipopAppeared: false,
  iceCreamCell: null,
  iceCreamAppeared: false,
};
