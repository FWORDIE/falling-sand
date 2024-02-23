import { elements } from "./elements";

let curPartArr: string[];
let newPartArr: string[];
let curVelArr: number[];
let newVelArr: number[];
let southArr: number[] | false[] = [];
let southEastArr: number[] | false[] = [];
let southWestArr: number[] | false[] = [];
let paused = false;
export let framerate = 1000 / 60;
var timer: number | undefined = undefined;

let charSelect = document.getElementById("char") as HTMLInputElement;
let sizeSelect = document.getElementById("size") as HTMLInputElement;
let pausedSelect = document.getElementById("paused") as HTMLInputElement;
let showVelSelect = document.getElementById("showVel") as HTMLInputElement;

export let dimensions = {
    canvasWidth: 0,
    canvasHeight: 0,
    canvasTop: 0,
    canvasLeft: 0,
    columns: 0,
    rows: 0,
    charWidth: 0,
    charHeight: 0,
    total: 0,
};

export const loop = () => {
    if (!pausedSelect.checked) {
        sim();
    }
};

const sim = () => {
    gravity();
    writetoDom();
    curPartArr = newPartArr.slice(0);
    curVelArr = newVelArr.slice(0);
};

export const handleKey = (e: KeyboardEvent) => {
    if ((e as KeyboardEvent).key === "ArrowRight") {
        sim();
    }
};

export const stringOutput = (indicator: number[], canvasSize: DOMRect) => {
    console.log(indicator, canvasSize);
    dimensions = {
        canvasWidth: canvasSize.width,
        canvasHeight: canvasSize.height,
        canvasTop: canvasSize.top,
        canvasLeft: canvasSize.left,
        charWidth: indicator[0],
        charHeight: indicator[1],
        columns: Math.floor(canvasSize.width / indicator[0]),
        rows: Math.floor(canvasSize.height / indicator[1]),
        total: Math.floor(canvasSize.height / indicator[1]) * Math.floor(canvasSize.width / indicator[0]),
    };
    let str = new Array(dimensions.columns * dimensions.rows).fill("·");
    return str;
};

export const reset = () => {
    let indicator: number[] = [];
    let indicatorElem = document.getElementById("Indicator")?.getBoundingClientRect();
    console.log(indicatorElem);
    if (indicatorElem) {
        indicator[0] = indicatorElem?.width;
        indicator[1] = indicatorElem?.height;
    }
    let canvas = document.getElementById("Canvas");
    if (canvas) {
        clickDetect(canvas);
        let canvasSize = canvas.getBoundingClientRect();
        curPartArr = stringOutput(indicator, canvasSize);
        newPartArr = curPartArr.slice(0);
        curVelArr = new Array(dimensions.columns * dimensions.rows).fill(0);
        newVelArr = curVelArr.slice(0);
        createDirectionArrays();
        writetoDom();
    }
};

const createDirectionArrays = () => {
    for (let i = 0; i < dimensions.total; i++) {
        southArr[i] = getSouth(i);
        southEastArr[i] = getSouthEast(i);
        southWestArr[i] = getSouthWest(i);
    }
};

export const startUp = () => {
    reset();
    addOptions();
};

const addOptions = () => {
    let select = document.getElementById("char") as HTMLSelectElement;

    for (let key in elements) {
        let opt = document.createElement("option");
        opt.value = key;
        opt.innerHTML = elements[key].name;
        select.appendChild(opt);
    }
};

export const writetoDom = () => {
    let canvas = document.getElementById("Canvas");
    if (newPartArr == curPartArr) {
        return;
    }
    let visArr: string[] | number[] = newPartArr;
    if (showVelSelect.checked) {
        visArr = newVelArr;
    }
    if (canvas) {
        let string = visArr.join("");
        canvas.textContent = string;
    }
};

// Mouse Handle
const clickDetect = (main: HTMLElement) => {
    main.addEventListener("mousedown", (e: MouseEvent) => {
        let pos = [e.clientX - dimensions.canvasLeft, e.clientY - dimensions.canvasTop];
        window.addEventListener("mousemove", (e) => {
            pos = [e.clientX - dimensions.canvasLeft, e.clientY - dimensions.canvasTop];
        });
        timer = setInterval(function () {
            mouseEvents(pos);
        }, framerate);
    });

    function mouseDone() {
        clearInterval(timer);
        window.removeEventListener("mousemove", () => {});
    }

    main.addEventListener("mouseup", mouseDone);
    main.addEventListener("mouseleave", mouseDone);
};

const mouseEvents = (pos: number[]) => {
    //find index
    let trueX = Math.floor(pos[0] / dimensions.charWidth);
    let trueY = Math.floor(pos[1] / dimensions.charHeight);
    let index = trueY * dimensions.columns + trueX;

    //get options
    let char = charSelect?.value || "s";
    char = Math.random() > 0.5 ? char.toUpperCase() : char;
    let size = +sizeSelect?.value || 1;
    if (size > 1) {
        for (let x = -size + 1; x < size; x++) {
            for (let y = -size + 1; y < size; y++) {
                let pos = x * dimensions.columns + y + index;
                if (
                    checkInGrid(pos) &&
                    Math.floor(index / dimensions.columns) == Math.floor(pos / dimensions.columns) + -x &&
                    Math.random() > 0.5 &&
                    Math.abs(x * y) < size - 1
                ) {
                    newPartArr[pos] = char;
                }
            }
        }
    } else {
        newPartArr[index] = char;
    }
};

const checkInGrid = (index: number) => {
    return index > 0 && index < dimensions.columns * dimensions.rows;
};

const gravity = () => {
    for (let x = curPartArr.length - 1; x > 0; x--) {
        let el = elements[curPartArr[x].toLowerCase()];
        if (el.graved) {
            //check below
            let directBelowIndex = southArr[x];
            if (directBelowIndex) {
                let directBelow = elements[curPartArr[directBelowIndex].toLowerCase()];
                let moved = false;
                if (directBelow.movable) {
                    curVelArr[x] += el.acc;
                    if (curVelArr[x] > el.max) {
                        curVelArr[x] = el.max;
                    }
                    for (let dis = Math.floor(curVelArr[x]); dis >= 0 && !moved; dis--) {
                        let dancePartnerIndex = southArr[x + dimensions.columns * dis];
                        if (dancePartnerIndex) {
                            let dancePartner = elements[curPartArr[dancePartnerIndex].toLowerCase()];
                            if (dancePartner.movable && !moved) {
                                swap(x, dancePartnerIndex);
                                moved = true;
                            }
                        }
                    }
                } else {
                    curVelArr[x] = 0;
                    let dancePartnerIndex = southWestArr[x];
                    if (dancePartnerIndex) {
                        let dancePartner = elements[curPartArr[dancePartnerIndex].toLowerCase()];
                        if (dancePartner.movable) {
                            swap(x, dancePartnerIndex);
                            moved = true;
                        }
                    }
                    if(!moved){
                        dancePartnerIndex = southEastArr[x];
                        if (dancePartnerIndex) {
                            let dancePartner = elements[curPartArr[dancePartnerIndex].toLowerCase()];
                            if (dancePartner.movable) {
                                swap(x, dancePartnerIndex);
                                moved = true;
                            }
                        }

                    }
                }
                if (!moved) {
                    newVelArr[x] = curVelArr[x];
                }
            }
        }
    }
};

const swap = (a: number, b: number) => {
    newPartArr[a] = Math.random() > 0.5 ? curPartArr[b].toLowerCase() : curPartArr[b].toUpperCase();
    newPartArr[b] = Math.random() > 0.5 ? curPartArr[a].toLowerCase() : curPartArr[a].toUpperCase();
    newVelArr[a] = curVelArr[b];
    newVelArr[b] = curVelArr[a];
};

const getSouth = (i: number) => {
    let result = i + dimensions.columns;
    if (result >= dimensions.total) {
        return false;
    }
    return result;
};

const getSouthWest = (i: number) => {
    let result = i + dimensions.columns - 1;
    if ((i % dimensions.columns) - 1 < 0 || result >= dimensions.total) {
        return false;
    }
    return result;
};

const getSouthEast = (i: number) => {
    let result = i + dimensions.columns + 1;
    if ((i % dimensions.columns) + 1 >= dimensions.columns || result >= dimensions.total) {
        return false;
    }
    return result;
};

const getEast = (i: number) => {
    let result = i+ 1;
    if ((i % dimensions.columns) + 1 >= dimensions.columns || result >= dimensions.total) {
        return false;
    }
    return result;
};

const getWest = (i: number) => {
    let result = i+ 1;
    if ((i % dimensions.columns) + 1 >= dimensions.columns || result <= 0) {
        return false;
    }
    return result;
};

