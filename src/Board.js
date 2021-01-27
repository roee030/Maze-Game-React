import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Board.module.css";
import useInterval from "@use-it/interval";
import PropTypes from "prop-types";
import logoImage from "./logo.svg";
import LollipopImage from "./images/lollipop.svg";
import IceCreamImage from "./images/ice_cream.svg";
function Board({
  maze,
  currentCell,
  time,
  lollipopCell,
  callBackOnLollipop,
  iceCreamCell,
  callBackOnIceCream,
}) {
  const canvas = useRef(null);
  const container = useRef(null);
  const [ctx, setCtx] = useState(undefined);
  const [displayText, setDisplayText] = useState(true);
  //generate lollipop cell  index

  useEffect(() => {
    const fitToContainer = () => {
      const { offsetWidth, offsetHeight } = container.current;
      canvas.current.width = offsetWidth;
      canvas.current.height = offsetHeight;
      canvas.current.style.width = offsetWidth + "px";
      canvas.current.style.height = offsetHeight + "px";
    };

    setCtx(canvas.current.getContext("2d"));
    setTimeout(fitToContainer, 0);
  }, []);

  useEffect(() => {
    const drawLine = (x1, y1, width, height) => {
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + width, y1 + height);
      ctx.stroke();
    };

    const draw = () => {
      if (!maze) {
        return;
      }

      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

      const blockWidth = Math.floor(canvas.current.width / maze.cols);
      const blockHeight = Math.floor(canvas.current.height / maze.rows);

      const xOffset = Math.floor(
        (canvas.current.width - maze.cols * blockWidth) / 2
      );

      for (let y = 0; y < maze.rows; y++) {
        for (let x = 0; x < maze.cols; x++) {
          const cell = maze.cells[x + y * maze.cols];
          if (y === 0 && cell[0]) {
            drawLine(blockWidth * x + xOffset, blockHeight * y, blockWidth, 0);
          }
          if (cell[1]) {
            drawLine(
              blockWidth * (x + 1) + xOffset,
              blockHeight * y,
              0,
              blockHeight
            );
          }
          if (cell[2]) {
            drawLine(
              blockWidth * x + xOffset,
              blockHeight * (y + 1),
              blockWidth,
              0
            );
          }
          if (x === 0 && cell[3]) {
            drawLine(blockWidth * x + xOffset, blockHeight * y, 0, blockHeight);
          }
        }
      }
      //StorrSoft Logo
      let logoSize = 0.75 * Math.min(blockWidth, blockHeight);
      const image = new Image(logoSize, logoSize);
      image.onload = () => {
        ctx.drawImage(
          image,
          currentCell[0] * blockWidth + xOffset + (blockWidth - logoSize) / 2,
          currentCell[1] * blockHeight + (blockHeight - logoSize) / 2,
          logoSize,
          logoSize
        );
      };
      image.src = logoImage;
      //the prize disappears - lollipopCell
      if (lollipopCell) {
        if (
          lollipopCell[0] == currentCell[0] &&
          lollipopCell[1] == currentCell[1]
        ) {
          console.log("hit");
          callBackOnLollipop();
        }
      }
      //the prize disappears - iceCream
      if (iceCreamCell) {
        if (
          iceCreamCell[0] == currentCell[0] &&
          iceCreamCell[1] == currentCell[1]
        ) {
          callBackOnIceCream();
        }
      }
      //Lollipop
      if (lollipopCell) {
        const lollipopImageOnBoard = new Image(logoSize, logoSize);

        lollipopImageOnBoard.onload = () => {
          ctx.drawImage(
            lollipopImageOnBoard,
            lollipopCell[0] * blockWidth +
              xOffset +
              (blockWidth - logoSize) / 2,
            lollipopCell[1] * blockHeight + (blockHeight - logoSize) / 2,
            logoSize,
            logoSize
          );
        };
        lollipopImageOnBoard.src = LollipopImage;
      }
      //iceCream
      if (iceCreamCell) {
        const IceCreamImageOnBoard = new Image(logoSize, logoSize);

        IceCreamImageOnBoard.onload = () => {
          ctx.drawImage(
            IceCreamImageOnBoard,
            iceCreamCell[0] * blockWidth +
              xOffset +
              (blockWidth - logoSize) / 2,
            iceCreamCell[1] * blockHeight + (blockHeight - logoSize) / 2,
            logoSize,
            logoSize
          );
        };
        IceCreamImageOnBoard.src = IceCreamImage;
      }

      //Goal Text

      const textSize = Math.min(blockWidth, blockHeight);
      ctx.fillStyle = "red";
      ctx.font = '20px "Joystix"';
      ctx.textBaseline = "top";
      if (displayText) {
        ctx.fillText(
          "Goal",
          maze.endCell[1] * blockWidth + xOffset + (blockWidth - textSize) / 2,
          maze.endCell[0] * blockHeight + (blockHeight - textSize) / 2,
          textSize
        );
      }
    };

    draw();
  }, [ctx, currentCell, maze, lollipopCell, iceCreamCell, time]);
  useInterval(() => {
    setDisplayText((prev) => !prev);
  }, 1000);
  return (
    <div className={styles.root} ref={container}>
      <canvas ref={canvas} />
    </div>
  );
}

Board.propTypes = {
  maze: PropTypes.shape({
    cols: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    cells: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.bool)).isRequired,
    currentCell: PropTypes.arrayOf(PropTypes.number),
  }),
};

export default Board;
