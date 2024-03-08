import { element, elements } from "./elements";

let curSymbolArr: element[];
let newSymbolArr: element[];
let oldSymbolArr: element[];
// let curVelArr: number[];
let southArr: DirectionArray = [];
let southEastArr: DirectionArray = [];
let southWestArr: DirectionArray = [];
let eastArr: DirectionArray = [];
let westArr: DirectionArray = [];
let northArr: DirectionArray = [];
let northEastArr: DirectionArray = [];
let northWestArr: DirectionArray = [];
let randomArr: number[] = [];

type DirectionArray = number[] | false[];

let mouseDown: boolean = false;
let elementSelected: element;
let size: number;
let loopID: number;
let fontSize: number = 16;

const randomArrAmount = 100;
let randomArrNum = 0;

export let framerate = 1000 / 24;
var timer: number | undefined = undefined;

var charSelect = document.getElementById("char") as HTMLInputElement;
var sizeSelect = document.getElementById("size") as HTMLInputElement;
var fontSizeSelect = document.getElementById("font") as HTMLInputElement;
var pausedSelect = document.getElementById("paused") as HTMLInputElement;
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
        // mouseEvents([dimensions.canvasHeight / 2, dimensions.canvasWidth / 2]);
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
    // TODO seems to stop loop so nothing updates, should just stop rendering
    // if (newSymbolArr == oldSymbolArr) {
    //     return;
    // }
    let visArr: string[] | number[] = new Array(dimensions.total).fill("").map((element, index) => {
        return curSymbolArr[index].symbol;
    });
    // if (showVelSelect.checked) {
    //     visArr = curVelArr;
    // }
    if (canvas) {
        const string = visArr.join("");
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

function debounce(func: (...args: any[]) => void, timeout = 100): (...args: any[]) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}

export const handleKey = debounce((e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
        console.log("next");
        sim();
    }
});

const clickDetect = (main: HTMLElement) => {
    main.addEventListener("mousedown", (e: MouseEvent) => {
        let pos = [e.clientX - dimensions.canvasLeft, e.clientY - dimensions.canvasTop];
        mouseEvents(pos);
        window.addEventListener("mousemove", (e) => {
            pos = [e.clientX - dimensions.canvasLeft, e.clientY - dimensions.canvasTop];
        });
        timer = setInterval(function () {
            mouseEvents(pos);
        }, framerate);
    });

    main.addEventListener("touchstart", (e: TouchEvent) => {
        let pos = [e.touches[0].clientX - dimensions.canvasLeft, e.touches[0].clientY - dimensions.canvasTop];
        window.addEventListener("touchmove", (e) => {
            pos = [e.touches[0].clientX - dimensions.canvasLeft, e.touches[0].clientY - dimensions.canvasTop];
        });
        timer = setInterval(function () {
            mouseEvents(pos);
        }, framerate);
    });

    function mouseDone() {
        clearInterval(timer);
        window.removeEventListener("mousemove", () => {});
        window.removeEventListener("touchmove", () => {});
    }

    main.addEventListener("mouseup", mouseDone);
    main.addEventListener("mouseleave", mouseDone);
    main.addEventListener("touchcancel", mouseDone);
    main.addEventListener("touchend", mouseDone);
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
    const char = charSelect?.value || "s";
    const element = elements[char];
    const size = +sizeSelect?.value || 1;
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
                    element.symbol = randomNumCheck() ? element.symbol.toUpperCase() : element.symbol.toLowerCase();
                    curSymbolArr[pos] = { ...element };
                }
            }
        }
    } else {
        element.symbol = randomNumCheck() ? element.symbol.toUpperCase() : element.symbol;
        curSymbolArr[index] = { ...element };
    }
};

const debugPanal = () => {
    const debugArea = document.getElementById("debugPanal");
    if (debugArea && debugArea.style.display == "block") {
        debugArea.style.display = "none";
    } else if (debugArea) {
        debugArea.style.display = "block";
    }
};

// INIT FUNCTIONS

export const startUp = () => {
    console.log("StartingUp");
    debugSelect.addEventListener("change", debugPanal);
    clickDetect(canvas);
    addMenuOptions();
    reset();
};

const InitArrays = () => {
    createDimensions();
    createSymbolArray();
    createDirectionArrays();
    // createVelocityArray();
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
    let str = new Array(dimensions.total).fill(elements["·"]);
    curSymbolArr = str;
    newSymbolArr = str;
    console.log(str);
};

const createDirectionArrays = () => {
    southArr = [];
    southEastArr = [];
    southWestArr = [];
    westArr = [];
    eastArr = [];
    for (let i = 0; i < dimensions.total; i++) {
        northArr[i] = getNorth(i);
        northEastArr[i] = getNorthEast(i);
        northWestArr[i] = getNorthWest(i);
        southArr[i] = getSouth(i);
        southEastArr[i] = getSouthEast(i);
        southWestArr[i] = getSouthWest(i);
        westArr[i] = getWest(i);
        eastArr[i] = getEast(i);
    }
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
    for (let pass = -1; pass <= 1; pass += 2) {
        for (let row = dimensions.rows - 1; row >= 0; row--) {
            const rowOffset = row * dimensions.columns;
            const leftToRight = randomNumCheck();
            for (let column = 0; column < dimensions.columns; column++) {
                const columnOffset = leftToRight ? column : -column - 1 + dimensions.columns;

                let index = rowOffset + columnOffset;
                if (pass === -1) {
                    index = dimensions.total - index - 1;
                }

                doEffects(index, pass, leftToRight);
            }
        }
    }
};

const doEffects = (x: number, pass: number, direction: boolean) => {
    const el = curSymbolArr[x];
    if (el.symbol == "·") {
        return true;
    }
    //Need to re write, if elment changed, or x changes causes issues
    let moved = false;
    let fired = false;
    let slid = false;

    //Actions
    if (pass !== -1) {
        if (el.acidic) acid(x);
    } else {
        if (el.bug) doBugSexOrDie(x, el);
        if (el.burn) fired = fire(x, el);
    }

    //Movements
    if (pass !== -1) {
        if (el.graved) moved = gravity(x, el);
    } else {
        if (el.antiGraved) moved = antiGravity(x, el);
        if (el.chaotic && !moved) moved = chaosMovement(x, el);
    }

    if (el.horizontalVelocity !== 0 && !moved && pass !== -1) slid = slide(x, el, direction);

    if (pass === -1) {
    }
};

const slide = (x: number, el: element, direction: boolean) => {
    let vol = curSymbolArr[x].horizontalVelocity - Math.sign(curSymbolArr[x].horizontalVelocity) * el.friction;

    if ((Math.sign(vol) == -1) != direction) {
        return false;
    }

    if (Math.sign(vol) !== Math.sign(curSymbolArr[x].horizontalVelocity)) {
        curSymbolArr[x].horizontalVelocity = 0;
        return false;
    }

    if (Math.abs(vol) > Math.abs(el.horizontalMax)) {
        vol = Math.sign(vol) * Math.abs(el.horizontalMax);
    }
    curSymbolArr[x].horizontalVelocity = vol;

    var dancePartnerIndex = x;

    for (let dis = 1; dis < Math.floor(Math.abs(vol)) + 1; dis++) {
        const tempDancePartnerIndex = x + Math.sign(vol) * dis;
        if (Math.floor(tempDancePartnerIndex / dimensions.columns) == Math.floor(x / dimensions.columns) && curSymbolArr[tempDancePartnerIndex].null) {
            // curSymbolArr[x].horizontalVelocity = curSymbolArr[x].horizontalVelocity - (Math.sign(curSymbolArr[x].horizontalVelocity) * el.friction * (dis));
            dancePartnerIndex = tempDancePartnerIndex;
        } else {
            break;
        }
    }

    if (dancePartnerIndex !== x) {
        swap(x, dancePartnerIndex);
        return true;
    }

    curSymbolArr[x].horizontalVelocity = curSymbolArr[x].horizontalVelocity * -1;
    return false;
};

const gravity = (x: number, el: element) => {
    //check below
    const directBelowIndex = southArr[x];
    if (directBelowIndex) {
        const directBelow = curSymbolArr[directBelowIndex];
        if (directBelow.density < el.density) {
            curSymbolArr[x].velocity += el.acc;
            if (curSymbolArr[x].velocity > el.max) {
                curSymbolArr[x].velocity = el.max;
            }
            for (let dis = Math.floor(curSymbolArr[x].velocity); dis >= 0; dis--) {
                var dancePartnerIndex = southArr[x + dimensions.columns * dis];
                if (dancePartnerIndex && curSymbolArr[dancePartnerIndex].density < el.density && !curSymbolArr[dancePartnerIndex].static) {
                    if (
                        !southArr[dancePartnerIndex] ||
                        (typeof southArr[dancePartnerIndex] === "number" &&
                            curSymbolArr[southArr[dancePartnerIndex]].symbol !== "·" &&
                            curSymbolArr[x].velocity > 1)
                    ) {
                        curSymbolArr[x].horizontalVelocity = (((100 / el.density) * curSymbolArr[x].velocity) / 2) * (randomNumCheck() ? -1 : 1);
                        if (curSymbolArr[x].horizontalVelocity < 1 && curSymbolArr[x].horizontalVelocity > -1 && el.liquidy) {
                            curSymbolArr[x].horizontalVelocity = 1;
                        }
                    }
                    //check left and right
                    const neighbourWest = westArr[x]
                    const neighbourEast = eastArr[x]
                    if(neighbourWest && curSymbolArr[neighbourWest].graved &&curSymbolArr[neighbourWest].velocity == 0 && randomNumCheck(1-curSymbolArr[neighbourWest].friction)){
                        curSymbolArr[neighbourWest].velocity = 2;
                        curSymbolArr[neighbourWest].horizontalVelocity = -10
                    }
                    if(neighbourEast && curSymbolArr[neighbourEast].graved &&curSymbolArr[neighbourEast].velocity == 0 && randomNumCheck(1- curSymbolArr[neighbourEast].friction)){
                        curSymbolArr[neighbourEast].velocity = 2;
                        curSymbolArr[neighbourEast].horizontalVelocity = 10
                    }

                    swap(x, dancePartnerIndex);
                    return true;
                }
            }
        } else if (curSymbolArr[x].velocity > 0) {
            const dancePartnerIndexSouthWest = southWestArr[x];
            const dancePartnerIndexsouthEast = southEastArr[x];
            const dancePartnerIndexsouthWestMatch =
                dancePartnerIndexSouthWest && curSymbolArr[dancePartnerIndexSouthWest].density < el.density && !curSymbolArr[dancePartnerIndexSouthWest].static
                    ? dancePartnerIndexSouthWest
                    : false;
            const dancePartnerIndexsouthEastMatch =
                dancePartnerIndexsouthEast && curSymbolArr[dancePartnerIndexsouthEast].density < el.density && !curSymbolArr[dancePartnerIndexsouthEast].static
                    ? dancePartnerIndexsouthEast
                    : false;

            const chosenDancePartner = randomBetweenTwo(dancePartnerIndexsouthEastMatch, dancePartnerIndexsouthWestMatch);

            if (chosenDancePartner) {
                swap(x, chosenDancePartner);
                return true;
            }
        }
    }
    curSymbolArr[x].velocity = 0;
    curSymbolArr[x].symbol = curSymbolArr[x].symbol.toUpperCase();
    return false;
};

const antiGravity = (x: number, el: element) => {
    //check above
    const directAboveIndex = northArr[x];
    if (directAboveIndex) {
        const directAbove = curSymbolArr[directAboveIndex];

        if (directAbove.density > el.density) {
            curSymbolArr[x].velocity += el.acc;
            if (curSymbolArr[x].velocity < el.max) {
                curSymbolArr[x].velocity = el.max;
            }
            for (let dis = Math.floor(curSymbolArr[x].velocity); dis <= 0; dis++) {
                const dancePartnerIndex = northArr[x + dimensions.columns * dis];
                if (dancePartnerIndex && curSymbolArr[dancePartnerIndex].density > el.density && !curSymbolArr[dancePartnerIndex].static) {
                    if (
                        !northArr[dancePartnerIndex] ||
                        (typeof northArr[dancePartnerIndex] === "number" &&
                            curSymbolArr[northArr[dancePartnerIndex]].symbol !== "·" &&
                            curSymbolArr[x].velocity < 0)
                    ) {
                        curSymbolArr[x].horizontalVelocity = (((100 / el.density) * curSymbolArr[x].velocity) / 2) * (randomNumCheck() ? -1 : 1);
                        if (curSymbolArr[x].horizontalVelocity < 1 && curSymbolArr[x].horizontalVelocity > -1 && el.liquidy) {
                            curSymbolArr[x].horizontalVelocity = 1;
                        }
                    } else {
                        console.log("boo", curSymbolArr[x].velocity, curSymbolArr[northArr[dancePartnerIndex]].symbol);
                    }
                    swap(x, dancePartnerIndex);
                    return true;
                }
            }
        } else if (curSymbolArr[x].velocity < 0) {
            const dancePartnerIndexNorthWest = northWestArr[x];
            const dancePartnerIndexNorthEast = northEastArr[x];
            const dancePartnerIndexNorthWestMatch =
                typeof dancePartnerIndexNorthWest === "number" &&
                curSymbolArr[dancePartnerIndexNorthWest].density > el.density &&
                curSymbolArr[dancePartnerIndexNorthWest].liquidy
                    ? dancePartnerIndexNorthWest
                    : false;
            const dancePartnerIndexNorthEastMatch =
                typeof dancePartnerIndexNorthEast === "number" &&
                curSymbolArr[dancePartnerIndexNorthEast].density > el.density &&
                curSymbolArr[dancePartnerIndexNorthEast].liquidy
                    ? dancePartnerIndexNorthEast
                    : false;

            const chosenDancePartner = randomBetweenTwo(dancePartnerIndexNorthEastMatch, dancePartnerIndexNorthWestMatch);

            if (chosenDancePartner) {
                swap(x, chosenDancePartner);
                return true;
            }
        }
    }
    curSymbolArr[x].symbol = curSymbolArr[x].symbol.toUpperCase();
    curSymbolArr[x].velocity = 0;
    return false;
};

const fire = (x: number, el: element) => {
    curSymbolArr[x].symbol = el.symbol.toLowerCase();
    if (randomNumCheck(0.5)) {
        curSymbolArr[x].life = curSymbolArr[x].life - el.halfLife;
        curSymbolArr[x].symbol = el.symbol.toUpperCase();
    }

    if (curSymbolArr[x].life <= 0) {
        curSymbolArr[x] = randomNumCheck(0.55) ? { ...elements["c"] } : { ...elements["a"] };
        return true;
    }

    const possibleDirections = [northArr[x], northEastArr[x], eastArr[x], southEastArr[x], southArr[x], southWestArr[x], westArr[x], northWestArr[x]];
    const validDirections = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].flammable) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    const Water = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].symbol.toLowerCase() === "w") {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (Water.length > 0) {
        curSymbolArr[x] = { ...elements["s"] };
    }
    if (validDirections.length < 1) {
        return true;
    }

    const chosenDirection = validDirections[randomIntFromInterval(0, validDirections.length - 1)];

    if (randomNumCheck(1 / (curSymbolArr[chosenDirection].fuel / 2))) {
        let fuel = curSymbolArr[chosenDirection].fuel;
        curSymbolArr[chosenDirection] = { ...elements["f"] };
        curSymbolArr[chosenDirection].life = fuel;
    }

    return true;
};

// const decay = (x: number, el: element) => {
//     // For for when we have all elements
//     // const alphabet = 'abcdefghijklmnopqrstuvwxyz'
//     // const max = alphabet.indexOf(el.symbol.toLowerCase())
//     // const firstelement = randomIntFromInterval(0,max || alphabet.length)
//     // console.log(firstelement)
// };

const chaosMovement = (x: number, el: element) => {
    const possibleDirections = [northArr[x], northEastArr[x], eastArr[x], southEastArr[x], southArr[x], southWestArr[x], westArr[x], northWestArr[x]];
    const validDirections = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].density < el.density) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (validDirections.length < 1) {
        return false;
    }

    const chosenDirection = validDirections[randomIntFromInterval(0, validDirections.length - 1)];
    swap(x, chosenDirection);

    return true;
};

const doBugSexOrDie = (x: number, el: element) => {
    const possibleDirections = [northArr[x], northEastArr[x], eastArr[x], southEastArr[x], southArr[x], southWestArr[x], westArr[x], northWestArr[x]];

    const bugs = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].bug) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    const numOfBugs: number = bugs.length;
    // let halfLife = el.halfLife;


    if (numOfBugs > 0 && numOfBugs < 3) {
        if (randomNumCheck(0.5)) {
            const validDirections = possibleDirections.filter((index) => {
                if (typeof index === "number" && curSymbolArr[index].density === 0) {
                    return true;
                } else {
                    return false;
                }
            }) as number[];

            if (validDirections.length < 1) {
                return false;
            }

            const chosenDirection = validDirections[randomIntFromInterval(0, validDirections.length - 1)];
            curSymbolArr[chosenDirection] = { ...elements["b"] };
            return true;
        }
    } else if (numOfBugs > 4) {
        curSymbolArr[x].life = curSymbolArr[x].life - el.halfLife;
    } else if (numOfBugs == 0) {
        return false;
    }
    if (curSymbolArr[x].life < 0) {
        destroy(x);
    }

    return false;
};

const acid = (x: number) => {
    const directBelowIndex = southArr[x];
    if (directBelowIndex) {
        const directBelow = curSymbolArr[directBelowIndex];
        if (!directBelow.acidSafe) {
            destroy(x);
            destroy(directBelowIndex);
            return true;
        }
    }
    const dancePartnerWestIndex = westArr[x];
    const dancePartnerEastIndex = eastArr[x];
    const dancePartnerWestMatch = dancePartnerWestIndex && !curSymbolArr[dancePartnerWestIndex].acidSafe ? dancePartnerWestIndex : false;
    const dancePartnerEastMatch = dancePartnerEastIndex && !curSymbolArr[dancePartnerEastIndex].acidSafe ? dancePartnerEastIndex : false;
    const chosenDancePartner = randomBetweenTwo(dancePartnerWestMatch, dancePartnerEastMatch);

    if (chosenDancePartner) {
        destroy(x);
        destroy(chosenDancePartner);
        return true;
    }
    return false;
};

// const casePass = (x: number) => {
//     curSymbolArr[x].symbol = curSymbolArr[x].symbol.toUpperCase();
// };

// HELPERS
const swap = (a: number, b: number) => {
    const temp = curSymbolArr[a];
    curSymbolArr[a] = curSymbolArr[b];
    curSymbolArr[b] = temp;
    curSymbolArr[a].symbol = randomNumCheck() ? curSymbolArr[a].symbol.toUpperCase() : curSymbolArr[a].symbol.toLowerCase();
    curSymbolArr[b].symbol = randomNumCheck() ? curSymbolArr[b].symbol.toUpperCase() : curSymbolArr[b].symbol.toLowerCase();
    invertCase(a);
    invertCase(b);
};

const destroy = (x: number) => {
    curSymbolArr[x] = { ...elements["·"] };
};

const getNorth = (i: number) => {
    let result = i - dimensions.columns;
    if (result < 0) {
        return false;
    }
    return result;
};

const getNorthEast = (i: number) => {
    let result = i - dimensions.columns + 1;
    if ((i % dimensions.columns) + 1 >= dimensions.columns || result < 0) {
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

const getSouthEast = (i: number) => {
    let result = i + dimensions.columns + 1;
    if ((i % dimensions.columns) + 1 >= dimensions.columns || result >= dimensions.total) {
        return false;
    }
    return result;
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

const getWest = (i: number) => {
    let result = i - 1;
    if ((i % dimensions.columns) - 1 < 0 || result < 0) {
        return false;
    }
    return result;
};

const getNorthWest = (i: number) => {
    let result = i - dimensions.columns - 1;
    if ((i % dimensions.columns) - 1 < 0 || result < 0) {
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

const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const invertCase = (x: number) => {
    curSymbolArr[x].symbol =
        curSymbolArr[x].symbol === curSymbolArr[x].symbol.toUpperCase() ? curSymbolArr[x].symbol.toLowerCase() : curSymbolArr[x].symbol.toUpperCase();
};

//DEBUG

const debugCell = (x: number) => {
    console.log("INDEX:", x, "\n", "ELEMENT:", curSymbolArr[x]);

    console.log(
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
        getWest(x),
        "\n NW:",
        getNorthWest(x),
        "\n N:",
        getNorth(x),
        "\n NE: ",
        getNorthEast(x)
    );
};
