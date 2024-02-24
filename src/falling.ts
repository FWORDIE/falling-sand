import { element, elements } from "./elements";

let curSymbolArr: string[];
let newSymbolArr: string[];
let oldSymbolArr: string[];
let curVelArr: number[];
let southArr: number[] | false[] = [];
let southEastArr: number[] | false[] = [];
let southWestArr: number[] | false[] = [];
let eastArr: number[] | false[] = [];
let westArr: number[] | false[] = [];
let randomArr: number[] = [];

let loopID: number;
let fontSize: number = 16;

const randomArrAmount = 100;
let randomArrNum = 0;

export let framerate = 1000 / 60;
var timer: number | undefined = undefined;

var charSelect = document.getElementById("char") as HTMLInputElement;
var sizeSelect = document.getElementById("size") as HTMLInputElement;
var fontSizeSelect = document.getElementById("font") as HTMLInputElement;
var pausedSelect = document.getElementById("paused") as HTMLInputElement;
var showVelSelect = document.getElementById("showVel") as HTMLInputElement;
var debugSelect = document.getElementById("debug") as HTMLInputElement;

const canvas = document.getElementById("Canvas") as HTMLElement;
var indicatorElem = document.getElementById("Indicator") as HTMLElement;

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
    if (fontSizeSelect.valueAsNumber != fontSize) {
        fontSize = fontSizeSelect.valueAsNumber;
        canvas.style.fontSize = fontSize.toString() + "px";
        indicatorElem.style.fontSize = fontSize.toString() + "px";
        clearInterval(loopID);
        reset();
    }
};

const sim = () => {
    iterateOver();
    writetoDom();
};

const writetoDom = () => {
    if (newSymbolArr == oldSymbolArr) {
        return;
    }
    let visArr: string[] | number[] = newSymbolArr;
    if (showVelSelect.checked) {
        visArr = curVelArr;
    }
    if (canvas) {
        let string = visArr.join("");
        oldSymbolArr = newSymbolArr.slice(0);
        canvas.textContent = string;
    }
};

const reset = () => {
    if (canvas) {
        InitArrays();
        writetoDom();
    }
    loopID = setInterval(loop, framerate);
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

    if (debugSelect.checked) {
        debugCell(index);
        return;
    }

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
                    curSymbolArr[pos] = char;
                }
            }
        }
    } else {
        curSymbolArr[index] = char;
    }
};

// INIT FUNCTIONS

export const startUp = () => {
    console.log("StartingUp");
    clickDetect(canvas);
    addMenuOptions();
    reset();
};

// TODO Set up init Function for Arrays

const InitArrays = () => {
    createDimensions();
    createSymbolArray();
    createDirectionArrays();
    createVelocityArray();
    createChanceArray();
};

const createDimensions = () => {
    let indicator: number[] = [];
    let indicatorElemRect = indicatorElem.getBoundingClientRect();
    if (indicatorElemRect) {
        indicator[0] = indicatorElemRect?.width;
        indicator[1] = indicatorElemRect?.height;
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
    }
};

const createSymbolArray = () => {
    let str = new Array(dimensions.columns * dimensions.rows).fill("·");
    curSymbolArr = str;
    newSymbolArr = str;
};

const createDirectionArrays = () => {
    southArr = [];
    southEastArr = [];
    southWestArr = [];
    westArr = [];
    eastArr = [];
    for (let i = 0; i < dimensions.total; i++) {
        southArr[i] = getSouth(i);
        southEastArr[i] = getSouthEast(i);
        southWestArr[i] = getSouthWest(i);
        westArr[i] = getWest(i);
        eastArr[i] = getEast(i);
    }
};

const createVelocityArray = () => {
    curVelArr = new Array(dimensions.total).fill(0);
};

const createChanceArray = () => {
    randomArr = new Array(randomArrAmount).fill(0).map(() => Math.round(Math.random() * 10) / 10);
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

const iterateOver = () => {
    for (let row = dimensions.rows - 1; row > -0; row--) {
        const rowOffset = row * dimensions.columns;
        const leftToRight = randomNumCheck();
        for (let column = 0; column < dimensions.columns; column++) {
            const columnOffset = leftToRight ? column : -column - 1 + dimensions.columns;
            doEffects(rowOffset + columnOffset);
        }
    }
};
const doEffects = (x: number) => {
    let moved = false;
    const el = elements[curSymbolArr[x].toLowerCase()];
    if (el.graved) moved = gravity(x, el);
    if (el.liquidy && !moved) slide(x);
};

const slide = (x: number) => {
    const dancePartnerWestIndex = westArr[x];
    const dancePartnerEastIndex = eastArr[x];
    const dancePartnerWestMatch = dancePartnerWestIndex && elements[curSymbolArr[dancePartnerWestIndex].toLowerCase()].density < elements[curSymbolArr[x].toLowerCase()].density ? dancePartnerWestIndex : false;
    const dancePartnerEastMatch = dancePartnerEastIndex && elements[curSymbolArr[dancePartnerEastIndex].toLowerCase()].density < elements[curSymbolArr[x].toLowerCase()].density ? dancePartnerEastIndex : false;
    const chosenDancePartner = randomBetweenTwo(dancePartnerWestMatch, dancePartnerEastMatch);

    if (chosenDancePartner) {
        swap(x, chosenDancePartner);
    }
};

const gravity = (x: number, el: element) => {
    //check below
    const directBelowIndex = southArr[x];
    if (directBelowIndex) {
        const directBelow = elements[curSymbolArr[directBelowIndex].toLowerCase()];
        if (directBelow.density < elements[curSymbolArr[x].toLowerCase()].density) {
            curVelArr[x] += el.acc;
            if (curVelArr[x] > el.max) {
                curVelArr[x] = el.max;
            }
            for (let dis = Math.floor(curVelArr[x]); dis >= 0; dis--) {
                const dancePartnerIndex = southArr[x + dimensions.columns * dis];
                if (dancePartnerIndex && elements[curSymbolArr[dancePartnerIndex].toLowerCase()].density < elements[curSymbolArr[x].toLowerCase()].density) {
                    swap(x, dancePartnerIndex);
                    return true;
                }
            }
        } else {
            const dancePartnerIndexSouthWest = southWestArr[x];
            const dancePartnerIndexsouthEast = southEastArr[x];
            const dancePartnerIndexsouthWestMatch =
                dancePartnerIndexSouthWest && elements[curSymbolArr[dancePartnerIndexSouthWest].toLowerCase()].density < elements[curSymbolArr[x].toLowerCase()].density ? dancePartnerIndexSouthWest : false;
            const dancePartnerIndexsouthEastMatch =
                dancePartnerIndexsouthEast && elements[curSymbolArr[dancePartnerIndexsouthEast].toLowerCase()].density < elements[curSymbolArr[x].toLowerCase()].density? dancePartnerIndexsouthEast : false;

            const chosenDancePartner = randomBetweenTwo(dancePartnerIndexsouthEastMatch, dancePartnerIndexsouthWestMatch);

            if (chosenDancePartner) {
                swap(x, chosenDancePartner);
                return true;
            }
        }
    }
    curVelArr[x] = 0;
    return false;
};

// HELPERS
const swap = (a: number, b: number) => {
    const temp = curSymbolArr[a];
    curSymbolArr[a] = randomNumCheck() ? curSymbolArr[b].toLowerCase() : curSymbolArr[b].toUpperCase();
    curSymbolArr[b] = randomNumCheck() ? temp.toLowerCase() : temp.toUpperCase();
    const tempVol = curVelArr[a];
    curVelArr[a] = curVelArr[b];
    curVelArr[b] = tempVol;
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
    let result = i - 1;
    if ((i % dimensions.columns) - 1 < 0 || result <= 0) {
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

//DEBUG

const debugCell = (x: number) => {
    console.log(
        "INDEX:",
        x,
        "\n",
        "ELEMENT:",
        curSymbolArr[x],
        "\n",
        "VELOCITY",
        elements[curSymbolArr[x]],
        "\n",
        "E:",
        getEast(x),
        "\n",
        "SE",
        getSouthEast(x),
        "\n",
        "S:",
        getSouth(x),
        "\n",
        "SW:",
        getSouthWest(x),
        "\n",
        "W:",
        getWest(x)
    );
};
