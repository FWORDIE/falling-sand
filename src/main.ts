import "./style.scss";
import { framerate,  loop, reset} from "./falling.ts";


window.addEventListener("load", () => {
    reset()
    setInterval(loop, framerate)
});
