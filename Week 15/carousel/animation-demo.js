
import { Timeline, Animation } from "./animation.js";
import { ease, linear, easeIn, easeOut, easeInOut } from "./timingFunction.js";

let tl = new Timeline();
const el = document.getElementById("el").style;
const pauseBtn = document.getElementById("pause");
const resumeBtn = document.getElementById("resume");
let animation = new Animation(
  el,
  "transform",
  0,
  500,
  2000,
  0,
  easeInOut,
  (v) => `translateX(${v}px)`,
);
const el2 = document.getElementById("el2").style;
el2.transition = "transform ease-in-out 2s";
el2.transform = "translateX(500px)";
window.tl = tl;
window.animation = animation;
window.el = el;
tl.add(animation);
tl.start();
pauseBtn.onclick = () => tl.pause();
resumeBtn.onclick = () => tl.resume();
