import {
  handleClick,
  handleMouseMove,
  handleKeydown,
  handleKeyup,
} from "@/lib/helpers";
import { getDOMElements } from "@/utils/domElements";

const { canvasDOM } = getDOMElements();

export const initEventListeners = () => {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  document.addEventListener("mousemove", handleMouseMove);
  canvasDOM.addEventListener("click", handleClick, false);
};
