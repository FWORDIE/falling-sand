import "./style.scss";
import { handleKey,  startUp } from "./falling.ts";
import { testArrays } from "./testScripts.ts";



window.addEventListener("load", () => {
    startUp();
    // testArrays()
});

window.addEventListener("keydown", (e) => {
    handleKey(e);
});
