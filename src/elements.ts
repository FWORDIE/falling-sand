export let elements: { [key: string]: element } = {};

export type element = {
    symbol: string;
    name: string;
    density: number;
    graved: boolean;
    acc: number;
    max: number;
    friction: number;
    velocity: number;
    liquidy: boolean;
    nonslide: boolean;
    horizontalVelocity: number;
    halfLife: number;
    fuel:number;
    acidSafe: boolean;
    acidic: boolean;
    chaotic: boolean;
    bug: boolean;
    life: number;
    antiGraved:boolean;
    burn:boolean;
    flammable:boolean;
    static:boolean
};

const DEFAULTS: Partial<element> = {
    graved: true,
    liquidy: false,
    nonslide: false,
    acidSafe: false,
    acidic: false,
    chaotic: false,
    bug: false,
    antiGraved:false,
    burn:false,
    flammable:false,
    static:false,
    life: 1,
    halfLife: 0.1,
    horizontalVelocity: 0,
    velocity: 0,
    acc: 0.3,
    max: 8,
    density: 50,
    friction: 0.5,
    fuel:1
};

export const addElement = (key: string, elementConfig: Partial<element>) => {
    const configWithDefaults: element = {
        ...DEFAULTS,
        ...elementConfig,
    } as element;

    elements[key] = configWithDefaults;
};

addElement("·", {
    symbol: "·",
    name: "Air",
    graved: false,
    density: 10,
    acc: 0,
    friction: 0.1,
    acidSafe: true,
    liquidy: true
});

addElement('a',{
    symbol: "a",
    name: "Acid",
    liquidy: true,
    density: 15,
    friction: 0.1,
    acidSafe: true,
    acidic:true
})

addElement('b',{
    symbol: "b",
    name:'bug',
    graved:false,
    chaotic:true,
    bug:true,
    density: 20,
    halfLife:0.1,
    life: 1,
    flammable:true
})

addElement('c',{
    symbol: "c",
    name: "cloud",
    acc: -0.3,
    max: -2,
    density: 5,
    friction: 0.1,
    antiGraved:true,
    graved:false,
    liquidy:true
})

addElement('f',{
    symbol:'f',
    name:'Fire',
    density:3,
    friction:0.5,
    graved:false,
    life:1,
    halfLife:0.05,
    burn:true
})

addElement('g',{
    symbol:'g',
    name:'Gravium',
    density:99,
    friction:0.5,
    graved:false,
    life:1,
    halfLife:0.05,
    static:true
})

addElement('m',{
    symbol: "m",
    name: "methane",
    acc: -0.5,
    max: -3,
    density: 5,
    friction: 0.1,
    fuel:1,
    antiGraved:true,
    graved:false,
    liquidy:true,
    flammable:true,
})

addElement('r',{
    symbol: "r",
    name: "Rock",
    density: 90,
    acc: 0.5,
    max:10,
    friction: 0.99
})

addElement('l',{
    symbol: "l",
    name: "Logs",
    density: 70,
    acc: 0.4,
    max:8,
    friction: 0.99,
    fuel:10,
    flammable:true,
    nonslide:true,
})

addElement('s',{
    symbol: "s",
    name: "Sand",
    acc: 0.3,
    max: 8,
    density: 80,
    friction: 0.5,
})



addElement('u',{
    symbol: "u",
    name: "uranium",
    density: 99,
    acc: 1,
    max:10,
    friction: 0.1
})

addElement('w',{
    symbol: "w",
    name: "Water",
    liquidy:true,
    density: 20,
    acc: 0.3,
    max:8,
    friction: 0.1
})
