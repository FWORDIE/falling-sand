let randomArr: number[];
const randomArrAmount = 10000;
const testIterations = 500;

const swap = (a: number, b: number, arr: string[]) => {
    const temp = arr[a];
    arr[a] = Math.random() > 0.5 ? arr[b].toLowerCase() : arr[b].toUpperCase();
    arr[b] = Math.random() > 0.5 ? temp.toLowerCase() : temp.toUpperCase();
};

const createChanceArray = () => {
    return new Array(randomArrAmount).fill(0).map(() => Math.round(Math.random() * 10) / 10);
};

const createLetterArray = () => {
    return new Array(randomArrAmount).fill(0).map(() => generateRandomLetter());
};

function generateRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

export const testArrays = () => {
    console.log("Starting Test");
    let numArr1 = createChanceArray();
    let numArr2 = createChanceArray();
    let numArr3 = createChanceArray();
    let letterArr = createLetterArray();
    let elements = alphabetObjects;
    let elementsArr = new Array(randomArrAmount).fill({}).map((currElement, index) => {
        return alphabetObjects[letterArr[index]];
    });

    console.log(elementsArr[60])
    
    //write to string
    for (let x = 0; x < randomArrAmount; x++) {
        let letter = letterArr[x];
        let element = elements[letter];
        if(element.graved){
            let next = letterArr[x+1];
            if(!next){
                return
            }

        }
    }
};

// Function to generate a random Boolean
function getRandomBoolean(): boolean {
    return Math.random() < 0.5;
}

// Function to generate a random number within a range [min, max]
function getRandomNumber(min: number, max: number, isFloat: boolean = false): number {
    let randomNum = Math.random() * (max - min) + min;
    return isFloat ? randomNum : Math.floor(randomNum);
}

interface AlphabetObject {
    letter:string;
    name: string;
    graved: boolean;
    acc: number;
    max: number;
    density: number;
    friction: number;
}

// Alphabet array
const alphabet: string[] = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

// Generating the object of AlphabetObjects
const alphabetObjects: { [key: string]: AlphabetObject } = alphabet.reduce<{ [key: string]: AlphabetObject }>((obj, letter) => {
    // Add each letter as a key to the obj, setting its value to a new AlphabetObject
    obj[letter.toLowerCase()] = {
        letter: letter.toLowerCase(),
        name: `Name-${letter}`,
        graved: getRandomBoolean(),
        acc: getRandomNumber(0, 1, true),
        max: getRandomNumber(0, 10),
        density: getRandomNumber(0, 100),
        friction: getRandomNumber(0, 1, true),
    };
    return obj;
}, {}); // Start with an empty object
