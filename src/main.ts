import "./style.scss";
import { handleKey,  startUp } from "./falling.ts";

window.addEventListener("load", () => {
    startUp();
});

window.addEventListener("keydown", (e) => {
    handleKey(e);
});
