import {
  handleClick,
  handleMouseMove,
  handleKeydown,
  handleKeyup,
} from "@/lib/helpers";

export const initEventListeners = () => {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  document.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("click", handleClick, false);
};
