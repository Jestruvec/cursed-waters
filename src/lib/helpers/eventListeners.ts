import {
  handleClick,
  handleMouseMove,
  handleKeydown,
  handleKeyup,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleJoystickTouchStar,
  handleJoystickTouchMove,
  handleJoystickTouchEnd,
} from "@/lib/helpers";
import { getDOMElements } from "@/utils/domElements";

const { canvasDOM, joystickContainerDOM } = getDOMElements();

export const initEventListeners = () => {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  document.addEventListener("mousemove", handleMouseMove);
  canvasDOM.addEventListener("click", handleClick, false);
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true });
  document.addEventListener("touchend", handleTouchEnd);
  joystickContainerDOM.addEventListener("touchstart", handleJoystickTouchStar);
  joystickContainerDOM.addEventListener("touchmove", handleJoystickTouchMove);
  joystickContainerDOM.addEventListener("touchend", handleJoystickTouchEnd);
};
