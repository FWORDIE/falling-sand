import "./style.scss";
import { framerate, handleKey, loop, startUp } from "./falling.ts";

window.addEventListener("load", () => {
    startUp();
    setInterval(loop, framerate);
});

window.addEventListener("keydown", (e) => {
    handleKey(e);
});
