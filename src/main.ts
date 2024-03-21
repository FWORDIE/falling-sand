import "./style.scss";
import { handleKey,  startUp } from "./falling.ts";



window.addEventListener("load", () => {
    startUp();
    // testArrays()
});

window.addEventListener("keydown", (e) => {
    handleKey(e);
});
