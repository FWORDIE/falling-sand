import { elements } from "./elements";

let currentArr: string[];
let newArr: string[];
export let framerate = 1000 / 24;
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
        currentArr = stringOutput(indicator, canvasSize);
        newArr = currentArr.slice(0);
        writetoDom();
    }
};

export const writetoDom = () => {
    let canvas = document.getElementById("Canvas");
    if (canvas) {
        let string = newArr.join("");
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
            if (checkInGrid(pos) && Math.floor(index/dimensions.columns) == Math.floor(pos/dimensions.columns)+ -x && Math.random() > 0.5) {
                newArr[pos] = char;
            }
        }
    }
};

const checkInGrid = (index: number) => {
    return index > 0 && index < dimensions.columns * dimensions.rows;
};

export const loop = () => {
    gravity();
    writetoDom();
    currentArr = newArr.slice(0);
};

const gravity = () => {
    for (let x = 0; x < currentArr.length; x++) {
        let el = elements[currentArr[x]];
        if (el.graved) {
            let dancePartner = south(x, currentArr);
            if (dancePartner && dancePartner.el.movable) {
                swap(x, dancePartner.i);
            } else {
                let dancePartner = southWest(x, currentArr);
                if (dancePartner && dancePartner.el.movable) {
                    swap(x, dancePartner.i);
                } else {
                    let dancePartner = southEast(x, currentArr);
                    if (dancePartner && dancePartner.el.movable) {
                        swap(x, dancePartner.i);
                    }
                }
            }
        }
    }
};

const swap = (a: number, b: number) => {
    newArr[a] = currentArr[b];
    newArr[b] = currentArr[a];
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
