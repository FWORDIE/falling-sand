import { elements } from "./elements";

let curSymbolArr: string[];
let newSymbolArr: string[];
let curVelArr: number[];
let newVelArr: number[];
let southArr: number[] | false[] = [];
let southEastArr: number[] | false[] = [];
let southWestArr: number[] | false[] = [];
let randomArr: number[] = [];

let paused = false;

const randomArrAmount = 100;
let randomArrNum = 0;

export let framerate = 1000 / 60;
var timer: number | undefined = undefined;

const charSelect = document.getElementById("char") as HTMLInputElement;
const sizeSelect = document.getElementById("size") as HTMLInputElement;
const pausedSelect = document.getElementById("paused") as HTMLInputElement;
const showVelSelect = document.getElementById("showVel") as HTMLInputElement;
const canvas = document.getElementById("Canvas") as HTMLElement;

let dimensions = {
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

//MAIN LOOP

export const loop = () => {
    if (!pausedSelect.checked) {
        sim();
    }
};

const sim = () => {
    gravity();
    writetoDom();
    curSymbolArr = newSymbolArr.slice(0);
    curVelArr = newVelArr.slice(0);
};

const writetoDom = () => {
    if (newSymbolArr == curSymbolArr) {
        return;
    }
    let visArr: string[] | number[] = newSymbolArr;
    if (showVelSelect.checked) {
        visArr = newVelArr;
    }
    if (canvas) {
        let string = visArr.join("");
        canvas.textContent = string;
    }
};

const reset = () => {
    if (canvas) {
        clickDetect(canvas);
        InitArrays();
        writetoDom();
    }
};

//INPUT FUNCTIONS

export const handleKey = (e: KeyboardEvent) => {
    if ((e as KeyboardEvent).key === "ArrowRight") {
        sim();
    }
};

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
    char = randomNumCheck() ? char.toUpperCase() : char;
    let size = +sizeSelect?.value || 1;
    if (size > 1) {
        for (let x = -size + 1; x < size; x++) {
            for (let y = -size + 1; y < size; y++) {
                let pos = x * dimensions.columns + y + index;
                if (
                    checkInGrid(pos) &&
                    Math.floor(index / dimensions.columns) == Math.floor(pos / dimensions.columns) + -x &&
                    randomNumCheck() &&
                    Math.abs(x * y) < size - 1
                ) {
                    newSymbolArr[pos] = char;
                }
            }
        }
    } else {
        newSymbolArr[index] = char;
    }
};

// INIT FUNCTIONS

export const startUp = () => {
    reset();
    addMenuOptions();
};

// TODO Set up init Function for Arrays

const InitArrays = () => {
    createSymbolArray();
    createDirectionArrays();
    createVelocityArray();
    createChanceArray();
};

const createSymbolArray = () => {
    let indicator: number[] = [];
    let indicatorElem = document.getElementById("Indicator")?.getBoundingClientRect();

    if (indicatorElem) {
        indicator[0] = indicatorElem?.width;
        indicator[1] = indicatorElem?.height;
    }

    let canvasSize = canvas.getBoundingClientRect();

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

    curSymbolArr = str;
    newSymbolArr = str;
};

const createDirectionArrays = () => {
    for (let i = 0; i < dimensions.total; i++) {
        southArr[i] = getSouth(i);
        southEastArr[i] = getSouthEast(i);
        southWestArr[i] = getSouthWest(i);
    }
};

const createVelocityArray = () => {
    curVelArr = new Array(dimensions.total).fill(0);
    newVelArr = curVelArr.slice(0);
};

const createChanceArray = () => {
    randomArr = new Array(randomArrAmount).fill(0).map(() => Math.round(Math.random() * 10) / 10);
    console.log(randomArr);
};

const addMenuOptions = () => {
    let select = document.getElementById("char") as HTMLSelectElement;

    for (let key in elements) {
        let opt = document.createElement("option");
        opt.value = key;
        opt.innerHTML = elements[key].name;
        select.appendChild(opt);
    }
};

// EFFECTRS

// TODO Non Loop call if graved
const gravity = () => {
    for (let x = curSymbolArr.length - 1; x > 0; x--) {
        const el = elements[curSymbolArr[x].toLowerCase()];
        if (el.graved) {
            //check below
            const directBelowIndex = southArr[x];
            if (directBelowIndex) {
                const directBelow = elements[curSymbolArr[directBelowIndex].toLowerCase()];
                let moved = false;
                if (directBelow.movable) {
                    curVelArr[x] += el.acc;
                    if (curVelArr[x] > el.max) {
                        curVelArr[x] = el.max;
                    }
                    for (let dis = Math.floor(curVelArr[x]); dis >= 0 && !moved; dis--) {
                        const dancePartnerIndex = southArr[x + dimensions.columns * dis];
                        if (dancePartnerIndex && elements[curSymbolArr[dancePartnerIndex].toLowerCase()].movable) {
                            swap(x, dancePartnerIndex);
                            moved = true;
                        }
                    }
                } else {
                    curVelArr[x] = 0;
                    const dancePartnerIndexSouthWest = southWestArr[x];
                    const dancePartnerIndexsouthEast = southEastArr[x];
                    const dancePartnerIndexsouthWestMatch =
                        dancePartnerIndexSouthWest && elements[curSymbolArr[dancePartnerIndexSouthWest].toLowerCase()].movable
                            ? dancePartnerIndexSouthWest
                            : false;
                    const dancePartnerIndexsouthEastMatch =
                        dancePartnerIndexsouthEast && elements[curSymbolArr[dancePartnerIndexsouthEast].toLowerCase()].movable
                            ? dancePartnerIndexsouthEast
                            : false;

                    const chosenDancePartner = randomBetweenTwo(dancePartnerIndexsouthEastMatch, dancePartnerIndexsouthWestMatch);

                    if (chosenDancePartner) {
                        swap(x, chosenDancePartner);
                        moved = true;
                    }
                }
                if (!moved) {
                    newVelArr[x] = curVelArr[x];
                }
            }
        }
    }
};

// HELPERS
const swap = (a: number, b: number) => {
    newSymbolArr[a] = randomNumCheck() ? curSymbolArr[b].toLowerCase() : curSymbolArr[b].toUpperCase();
    newSymbolArr[b] = randomNumCheck() ? curSymbolArr[a].toLowerCase() : curSymbolArr[a].toUpperCase();
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
    let result = i + 1;
    if ((i % dimensions.columns) + 1 >= dimensions.columns || result >= dimensions.total) {
        return false;
    }
    return result;
};

const getWest = (i: number) => {
    let result = i + 1;
    if ((i % dimensions.columns) + 1 >= dimensions.columns || result <= 0) {
        return false;
    }
    return result;
};

const checkInGrid = (index: number) => {
    return index > 0 && index < dimensions.columns * dimensions.rows;
};

const randomNum = () => {
    let randomNum = randomArr[randomArrNum];
    randomArrNum++;
    if (randomArrNum >= randomArrAmount) {
        randomArrNum = 0;
    }
    return randomNum;
};

const randomNumCheck = (chance: number = 0.5) => {
    return chance > randomNum();
};

const randomBetweenTwo = (a: number | false, b: number | false) => {
    const aValid = a !== false;
    const bValid = b !== false;
    if (aValid && bValid) {
        return randomNumCheck() ? a : b;
    } else if (aValid) {
        return a;
    } else if (bValid) {
        return b;
    } else {
        return false;
    }
};
