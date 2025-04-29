import {
  handleClick,
  handleMouseMove,
  handleKeydown,
  handleKeyup,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} from "@/lib/helpers";
import { getDOMElements } from "@/utils/domElements";

const { canvasDOM } = getDOMElements();

export const initEventListeners = () => {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  document.addEventListener("mousemove", handleMouseMove);
  canvasDOM.addEventListener("click", handleClick, false);
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true });
  document.addEventListener("touchend", handleTouchEnd);
};
