import { element, elements } from "./elements";

let curSymbolArr: element[];
let newSymbolArr: element[];
let oldSymbolArr: element[];
let southArr: DirectionArray = [];
let southEastArr: DirectionArray = [];
let southWestArr: DirectionArray = [];
let eastArr: DirectionArray = [];
let westArr: DirectionArray = [];
let northArr: DirectionArray = [];
let northEastArr: DirectionArray = [];
let northWestArr: DirectionArray = [];
let randomArr: number[] = [];
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

type DirectionArray = number[] | false[];

let elementSelected: element;
let size: number = 1;
let loopID: number;
let fontSize: number = 16;

const randomArrAmount = 1000;
let randomArrNum = 0;

let zDeviceNum: null | number = null;
let yDeviceNum: null | number = null;

export let framerate = 1000 / 24;
var timer: number | undefined = undefined;

var sizeSelect = document.getElementById("size") as HTMLInputElement;
// var fontSizeSelect = document.getElementById("font") as HTMLInputElement;
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
    // if (fontSizeSelect.valueAsNumber != fontSize) {
    //     fontSize = fontSizeSelect.valueAsNumber;
    //     canvas.style.fontSize = fontSize.toString() + "px";
    //     indicatorElem.style.fontSize = fontSize.toString() + "px";
    //     clearInterval(loopID);
    //     reset();
    // }
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
        return true;
    }

    if (parseInt(e.key)) {
        setSize(parseInt(e.key));
        return true;
    }
    if (alphabet.includes(e.key)) {
        setChar(e.key);
        return true;
    }

    setChar("·");
});

const setSize = (n: number) => {
    const info = document.getElementById("size") as HTMLElement;
    info.innerText = n.toString();
    size = n;
};

const setChar = (el: string) => {
    elementSelected = elements[el];
    if (elements[el]) {
        const info = document.getElementById("char") as HTMLElement;
        const desc = document.getElementById("desc") as HTMLElement;
        desc.innerText = elementSelected.desc;
        info.innerText = elementSelected.name;
    }
};

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
    const element = elementSelected || elements["s"];
    if (size > 1) {
        let radiusSq = size * size;
        for (let y1 = -size; y1 <= size; y1++) {
            for (let x1 = -size; x1 <= size; x1++) {
                if (x1 * x1 + y1 * y1 <= radiusSq && randomNumCheck()) {
                    // this.set(x + x1, y + y1, colorFn());
                    let pos = ((trueY + y1) * dimensions.columns) + (trueX + x1)
                    // this.grid[y * this.width + x] = color;
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
    // addMenuOptions();
    setSize(size);
    setChar('s');

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
    randomArr = new Array(randomArrAmount).fill(0).map(() => +((Math.random() * 10) / 10).toFixed(6));
    console.log(randomArr);
};

const addMenuOptions = () => {
    // let select = document.getElementById("char") as HTMLSelectElement;

    // for (let key in elements) {
    //     let opt = document.createElement("option");
    //     opt.value = key;
    //     opt.innerHTML = elements[key].name;
    //     select.appendChild(opt);
    // }

    const saveButton = document.createElement("button");
    saveButton.innerHTML = "save";
    saveButton.addEventListener("click", () => {
        save();
    });
    document.getElementById("loadSave")?.append(saveButton);

    const loadButton = document.createElement("button");
    loadButton.innerHTML = "load";
    loadButton.addEventListener("click", () => {
        load();
    });
    document.getElementById("loadSave")?.append(loadButton);

    let options = document.getElementById("buttons") as HTMLElement;

    for (let key in elements) {
        let opt = document.createElement("button");
        opt.value = key;
        opt.innerHTML = elements[key].name;
        opt.title = elements[key].desc;
        opt.id = elements[key].name;
        if (key == "s") {
            opt.classList.add("selected");
        }
        opt.addEventListener("click", () => {
            selectElement(key, elements[key].name);
        });
        options.appendChild(opt);
    }
};

const selectElement = (key: string, name: string) => {
    console.log(key, name);
    const options = document.getElementById("buttons") as HTMLElement;
    const buttons = options.querySelectorAll(".selected");
    const selected = document.getElementById(name) as HTMLElement;
    buttons.forEach((button) => {
        button.classList.remove("selected");
    });

    elementSelected = elements[key];

    selected.classList.add("selected");
};

const save = () => {
    console.log(JSON.stringify(curSymbolArr).length);
    localStorage.setItem("state", JSON.stringify(curSymbolArr));
};

const load = () => {
    const state = localStorage.getItem("state");
    if (state) {
        curSymbolArr = JSON.parse(state);
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
        if (pass === -1) {
            if (zDeviceNum != null) {
                zDeviceTrigger(zDeviceNum);
            }
        } else {
            if (yDeviceNum != null) {
                yDeviceTrigger(yDeviceNum);
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
        if (el.acidic && kyptoCheck(x)) acid(x);
        if (el.explode) explode(x);
        if (el.decay && kyptoCheck(x)) decay(x, el);
    } else {
        if (el.bug && kyptoCheck(x)) doBugSexOrDie(x, el);
        if (el.insect && kyptoCheck(x)) insecticide(x, el);
        if (el.burn && kyptoCheck(x)) fired = fire(x, el);
        if (el.x && kyptoCheck(x)) xDevice(x);
        if (el.z && kyptoCheck(x)) zDevice(x);
        if (el.y && kyptoCheck(x)) yDevice(x);
    }

    //Movements
    if (pass !== -1) {
        if (el.graved) moved = gravity(x, el);
    } else {
        if (el.antiGraved) moved = antiGravity(x, el);
        if (el.grow && kyptoCheck(x)) moved = grow(x, el);
        if (el.chaotic && !moved) moved = chaosMovement(x, el);
    }

    if (el.horizontalVelocity !== 0 && !moved && pass !== -1) slid = slide(x, el, direction);

    if (pass === -1) {
    }
};

const slide = (x: number, el: element, direction: boolean) => {
    let vol = curSymbolArr[x].horizontalVelocity - Math.sign(curSymbolArr[x].horizontalVelocity) * el.friction * 2;

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
                        if (el.egg && curSymbolArr[x].velocity > 3) {
                            hatch(x);
                        }
                        curSymbolArr[x].horizontalVelocity = (((100 / el.density) * curSymbolArr[x].velocity) / 2) * (randomNumCheck() ? -1 : 1);
                        if (curSymbolArr[x].horizontalVelocity < 1 && curSymbolArr[x].horizontalVelocity > -1 && el.liquidy) {
                            curSymbolArr[x].horizontalVelocity = 1;
                        }
                    }
                    //check left and right
                    const neighbourWest = westArr[x];
                    const neighbourEast = eastArr[x];
                    if (
                        neighbourWest &&
                        curSymbolArr[neighbourWest].graved &&
                        curSymbolArr[neighbourWest].velocity == 0 &&
                        randomNumCheck(1 - curSymbolArr[x].friction)
                    ) {
                        curSymbolArr[neighbourWest].velocity = 2;
                        curSymbolArr[neighbourWest].horizontalVelocity = -10;
                    }
                    if (
                        neighbourEast &&
                        curSymbolArr[neighbourEast].graved &&
                        curSymbolArr[neighbourEast].velocity == 0 &&
                        randomNumCheck(1 - curSymbolArr[x].friction)
                    ) {
                        curSymbolArr[neighbourEast].velocity = 2;
                        curSymbolArr[neighbourEast].horizontalVelocity = 10;
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
    if (!el.burn) {
        curSymbolArr[x].symbol = curSymbolArr[x].symbol.toUpperCase();
    }
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
                    }
                    //check left and right
                    const neighbourWest = westArr[x];
                    const neighbourEast = eastArr[x];
                    if (
                        neighbourWest &&
                        curSymbolArr[neighbourWest].graved &&
                        curSymbolArr[neighbourWest].velocity == 0 &&
                        randomNumCheck(1 - curSymbolArr[neighbourWest].friction)
                    ) {
                        curSymbolArr[neighbourWest].velocity = -2;
                        curSymbolArr[neighbourWest].horizontalVelocity = -10;
                    }
                    if (
                        neighbourEast &&
                        curSymbolArr[neighbourEast].graved &&
                        curSymbolArr[neighbourEast].velocity == 0 &&
                        randomNumCheck(1 - curSymbolArr[neighbourEast].friction)
                    ) {
                        curSymbolArr[neighbourEast].velocity = -2;
                        curSymbolArr[neighbourEast].horizontalVelocity = 10;
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
    if (randomNumCheck(1 / (el.fuel * 2))) {
        curSymbolArr[x].life = curSymbolArr[x].life - el.halfLife;
    }

    if (curSymbolArr[x].symbol == curSymbolArr[x].symbol.toLowerCase()) {
        curSymbolArr[x].symbol = el.symbol.toUpperCase();
    } else {
        curSymbolArr[x].symbol = el.symbol.toLowerCase();
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

    if (Water.length > 0 && randomNumCheck(1 / (el.fuel * 2))) {
        curSymbolArr[x] = { ...elements["s"] };
    }
    if (validDirections.length < 1) {
        return true;
    }

    const chosenDirection = validDirections[randomIntFromInterval(0, validDirections.length - 1)];

    if (randomNumCheck(1 / (curSymbolArr[chosenDirection].fuel * 2))) {
        let temp = { ...curSymbolArr[chosenDirection] };
        let fire = { ...elements["f"] };

        temp.symbol = fire.symbol;
        temp.desc = fire.desc;
        temp.name = fire.name;
        temp.burn = true;

        curSymbolArr[chosenDirection] = temp;
    }

    return true;
};

const grow = (x: number, el: element) => {
    const possibleDirections = [northArr[x], northEastArr[x], eastArr[x], southEastArr[x], southArr[x], southWestArr[x], westArr[x], northWestArr[x]];
    const water = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].symbol.toLowerCase() == "w") {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (water.length > 0 && !el.growing) {
        const dancePartner = water[randomIntFromInterval(0, water.length)];
        curSymbolArr[dancePartner] = { ...elements["·"] };
        curSymbolArr[x].growing = true;
    }

    if (el.velocity > 0 || !curSymbolArr[x].growing) {
        return false;
    }

    if (el.growth > 7 && randomNumCheck(0.5)) {
        bloom(x);
        return false;
    }

    const growthGiver = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].growGiver) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    const numOfGrowthGivers: number = growthGiver.length;

    if (numOfGrowthGivers < 1 || !randomNumCheck(0.5) || numOfGrowthGivers > 5) {
        return false;
    }
    const possibleGrowDirections = [northArr[x], northEastArr[x], northWestArr[x]].filter((index) => {
        if (typeof index === "number" && (curSymbolArr[index].growGiver || curSymbolArr[index].null) && (!curSymbolArr[index].grow || randomNumCheck())) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (possibleGrowDirections.length > 2) {
        const dancePartner = possibleGrowDirections[randomIntFromInterval(0, possibleGrowDirections.length)];
        curSymbolArr[dancePartner] = { ...el };
        curSymbolArr[dancePartner].growth = el.growth + 1;
        curSymbolArr[dancePartner].static = true;
        curSymbolArr[dancePartner].graved = false;
        curSymbolArr[x].growing = false;
        return true;
    }

    return false;
};

const bloom = (x: number) => {
    const possibleDirections = [northArr[x], eastArr[x], southArr[x], westArr[x]];

    const growthGiver = possibleDirections.filter((index) => {
        if (typeof index === "number" && (curSymbolArr[index].growGiver || curSymbolArr[index].null)) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    for (let i = 0; i < growthGiver.length; i++) {
        curSymbolArr[growthGiver[i]] = { ...elements["p"] };
    }
};

const explode = (index: number, overide: boolean = false) => {
    if (!kyptoCheck(index)) {
        return false;
    }
    const neighbours = getSurrounding(index);

    const fireNeighbours = neighbours.filter((i) => {
        if (typeof i === "number" && curSymbolArr[i].burn) {
            return true;
        } else {
            return false;
        }
    });

    if (overide || fireNeighbours.length > 0 || curSymbolArr[index].exploding) {
        curSymbolArr[index].exploding = true;
        curSymbolArr[index].life = curSymbolArr[index].life - 0.05;
        invertCase(index);
    }

    if (curSymbolArr[index].life < 0) {
        const size = randomIntFromInterval(1, 5);
        for (let x = -size + 1; x < size; x++) {
            for (let y = -size + 1; y < size; y++) {
                let pos = x * dimensions.columns + y + index;
                if (
                    checkInGrid(pos) &&
                    Math.floor(index / dimensions.columns) == Math.floor(pos / dimensions.columns) + -x &&
                    randomNumCheck() &&
                    Math.abs(x * y) < size - 1
                ) {
                    if (curSymbolArr[pos].explode && pos != index) {
                        explode(pos, true);
                    } else {
                        destroy(pos);
                    }
                }
            }
        }
    }
};

const xDevice = (index: number) => {
    let amountBig = dimensions.columns + 1;
    let amountSmall = dimensions.columns - 1;
    let startBig = index % amountBig;
    let startSmall = index % amountSmall;
    let destroyArray = [];
    for (let big = startBig; big <= dimensions.total; big += amountBig) {
        destroyArray.push(big);
    }
    for (let small = startSmall; small < dimensions.total; small += amountSmall) {
        destroyArray.push(small);
    }
    for (let x = 0; x < destroyArray.length; x++) {
        let pos = destroyArray[x];
        if (curSymbolArr[pos].explode) {
            explode(pos, true);
        } else {
            destroy(pos);
        }
    }
    destroy(index);
};

const zDevice = (index: number) => {
    if (zDeviceNum === null) {
        zDeviceNum = index;
    }
};

const zDeviceTrigger = (index: number) => {
    destroy(index);
    let times = index % dimensions.columns;
    console.log(times, index);
    while (times--) {
        var temp = curSymbolArr.shift() as element;
        curSymbolArr.push(temp);
    }
    zDeviceNum = null;
};

const yDevice = (index: number) => {
    if (yDeviceNum === null) {
        yDeviceNum = index;
    }
};

const yDeviceTrigger = (index: number) => {
    destroy(index);
    let times = (index % dimensions.columns) * dimensions.columns;
    console.log(times, index);
    while (times--) {
        var temp = curSymbolArr.shift() as element;
        curSymbolArr.push(temp);
    }
    yDeviceNum = null;
};

const decay = (x: number, el: element) => {
    if (el.life < 1 || randomNumCheck(0.99)) {
        return false;
    }

    const possibleDirections = getSurrounding(x);

    const notAirDirections = possibleDirections.filter((index) => {
        if (typeof index === "number" && !curSymbolArr[index].null && !curSymbolArr[index].decay) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (notAirDirections.length > 0) {
        const chosenDirection = notAirDirections[randomIntFromInterval(0, notAirDirections.length - 1)];
        // For for when we have all elements
        const alphabet = "abcdefghijklmnopqrstuvwxyz·";
        const firstelement = alphabet[randomIntFromInterval(0, alphabet.length)];
        curSymbolArr[chosenDirection] = { ...elements[firstelement] };
        curSymbolArr[x].life = -el.halfLife;
    }
};

const chaosMovement = (x: number, el: element) => {
    const possibleDirections = getSurrounding(x);
    const validDirections = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].null) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (el.bug) {
        const jamDirections = possibleDirections.filter((index) => {
            if (typeof index === "number" && curSymbolArr[index].jam) {
                return true;
            } else {
                return false;
            }
        }) as number[];

        if (jamDirections.length > 0) {
            if (randomNumCheck(0.1)) {
                curSymbolArr[x].life = curSymbolArr[x].life - 0.01;
            }
            console.log("stuck");
            return false;
        }
    }

    if (validDirections.length < 1) {
        return false;
    }

    const chosenDirection = validDirections[randomIntFromInterval(0, validDirections.length - 1)];
    swap(x, chosenDirection);

    return true;
};

const doBugSexOrDie = (x: number, el: element) => {
    const possibleDirections = getSurrounding(x);

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
        if (randomNumCheck(0.001)) {
            const validDirections = possibleDirections.filter((index) => {
                if (typeof index === "number" && curSymbolArr[index].null) {
                    return true;
                } else {
                    return false;
                }
            }) as number[];

            if (validDirections.length < 1) {
                return false;
            }

            const chosenDirection = validDirections[randomIntFromInterval(0, validDirections.length - 1)];
            curSymbolArr[chosenDirection] = { ...elements["e"] };
            return true;
        }
    } else if (numOfBugs > 3) {
        // curSymbolArr[x].life = curSymbolArr[x].life - el.halfLife;
        curSymbolArr[x] = { ...elements["d"] };
    } else if (numOfBugs == 0) {
        return false;
    }

    return false;
};

const insecticide = (x: number, el: element) => {
    if (el.life <= 0) {
        destroy(x);
        return false;
    }
    const possibleDirections = getSurrounding(x);

    //bug check

    const bugDirections = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].bug) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (bugDirections.length > 0) {
        const chosenDirection = bugDirections[randomIntFromInterval(0, bugDirections.length - 1)];
        curSymbolArr[chosenDirection] = { ...elements["d"] };
        curSymbolArr[x].life -= el.halfLife;
        return true;
    }

    //vine check

    const vineDirections = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].plant) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (vineDirections.length > 0) {
        const chosenDirection = vineDirections[randomIntFromInterval(0, vineDirections.length - 1)];
        curSymbolArr[chosenDirection] = { ...elements["a"] };
        curSymbolArr[x].life -= el.halfLife;
        return true;
    }

    //water check

    const waterDirections = possibleDirections.filter((index) => {
        if (typeof index === "number" && curSymbolArr[index].water) {
            return true;
        } else {
            return false;
        }
    }) as number[];

    if (waterDirections.length > 0) {
        const chosenDirection = waterDirections[randomIntFromInterval(0, waterDirections.length - 1)];
        curSymbolArr[chosenDirection] = { ...elements["h"] };
        curSymbolArr[x] = { ...elements["n"] };
        return true;
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

const hatch = (x: number) => {
    curSymbolArr[x] = { ...elements["b"] };
};

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
    // curSymbolArr[x].explode
    if (curSymbolArr[x].quartz) {
        return true;
    }
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

const getSurrounding = (x: number, leftToRight: boolean | null = null) => {
    if (leftToRight === null) {
        return [northArr[x], northEastArr[x], eastArr[x], southEastArr[x], southArr[x], southWestArr[x], westArr[x], northWestArr[x]];
    }

    return [];
};

const kyptoCheck = (x: number) => {
    let neighbours = getSurrounding(x);
    for (let i = 0; i < neighbours.length; i++) {
        if (neighbours[i] !== false && curSymbolArr[neighbours[i]].kypto) {
            return false;
        }
    }
    return true;
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
