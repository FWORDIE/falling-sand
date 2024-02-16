import { elements } from "./elements";

let curPartArr: string[];
let newPartArr: string[];
let curVelArr: number[];
let newVelArr: number[];
export let framerate = 1000 / 100;
var timer: number | undefined = undefined;

let charSelect = document.getElementById("char") as HTMLInputElement;
let sizeSelect = document.getElementById("size") as HTMLInputElement;

export let dimensions = {
    canvasWidth: 0,
    canvasHeight: 0,
    canvasTop: 0,
    canvasLeft: 0,
    columns: 0,
    rows: 0,
    charWidth: 0,
    charHeight: 0,
};

export const loop = () => {
    gravity();
    writetoDom();
    curPartArr = newPartArr.slice(0);
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
        curVelArr = new Array(dimensions.columns * dimensions.rows).fill("0");
        newVelArr = curVelArr.slice(0)
        writetoDom();
    }
};

export const writetoDom = () => {
    let canvas = document.getElementById("Canvas");
    if (newPartArr == curPartArr) {
        return;
    }
    if (canvas) {
        let string = newPartArr.join("");
        canvas.innerHTML = string;
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
    let size = +sizeSelect?.value || 1;
    for (let x = -size + 1; x < size; x++) {
        for (let y = -size + 1; y < size; y++) {
            let pos = x * dimensions.columns + y + index;
            if (
                checkInGrid(pos) &&
                Math.floor(index / dimensions.columns) == Math.floor(pos / dimensions.columns) + -x &&
                Math.random() > 0.9 &&
                Math.abs(x * y) < size - 1
            ) {
                newPartArr[pos] = char;
            }
        }
    }
};

const checkInGrid = (index: number) => {
    return index > 0 && index < dimensions.columns * dimensions.rows;
};

const gravity = () => {
    for (let x = 0; x < curPartArr.length; x++) {
        let el = elements[curPartArr[x].toLowerCase()];
        let vol = curVelArr[x] + el.acc;
        if (el.graved) {
            let dancePartner = south(x, curPartArr);
            if (dancePartner && dancePartner.el.movable) {
                swap(x, dancePartner.i);
            } else {
                let dancePartner = southWest(x, curPartArr);
                if (dancePartner && dancePartner.el.movable) {
                    swap(x, dancePartner.i);
                } else {
                    let dancePartner = southEast(x, curPartArr);
                    if (dancePartner && dancePartner.el.movable) {
                        swap(x, dancePartner.i);
                    }
                }
            }
        }
    }
};

const swap = (a: number, b: number) => {
    newPartArr[a] = Math.random() > 0.5 ? curPartArr[b].toLowerCase() :  curPartArr[b].toUpperCase();
    newPartArr[b] = Math.random() > 0.5 ? curPartArr[a].toLowerCase() :  curPartArr[a].toUpperCase();
};

const south = (index: number, arr: string[]) => {
    let i = index + dimensions.columns;
    let el = elements[arr[i]];
    if (el) {
        return { i: i, el: el };
    }
    return false;
};

const southWest = (index: number, arr: string[]) => {
    if ((index % dimensions.columns) - 1 < 0) {
        return false;
    }
    let i = index + dimensions.columns - 1;
    let el = elements[arr[i]];
    if (el) {
        return { i: i, el: el };
    }
    return false;
};

const southEast = (index: number, arr: string[]) => {
    if ((index % dimensions.columns) + 1 >= dimensions.columns) {
        return false;
    }
    // console.log('east', index % dimensions.columns)
    let i = index + dimensions.columns + 1;
    let el = elements[arr[i]];
    if (el) {
        return { i: i, el: el };
    }
    return false;
};
