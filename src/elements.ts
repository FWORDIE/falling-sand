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
    horizontalMax: number;
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
    static:boolean;
    null:boolean
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
    fuel:1,
    null:false,
    horizontalMax: 2
};

export const addElement = (key: string, elementConfig: Partial<element>) => {
    const configWithDefaults: element = {
        ...DEFAULTS,
        ...elementConfig,
    } as element;

    elements[key] = configWithDefaults;
};

addElement('s',{
    symbol: "s",
    name: "Sand",
    acc: 0.3,
    max: 8,
    density: 80,
    friction: 0.1,
})

addElement("·", {
    symbol: "·",
    name: "null",
    graved: false,
    density: 10,
    acc: 0,
    friction: 0.1,
    acidSafe: true,
    liquidy: true,
    null:true
});

addElement('a',{
    symbol: "a",
    name: "Ash",
    acc: 0.1,
    max: 4,
    density: 40,
    friction: 0.01,
})


addElement('b',{
    symbol: "b",
    name:'Bug',
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
    name: "Cloud",
    acc: -0.3,
    max: -2,
    horizontalMax: 2,
    density: 5,
    friction: 0,
    antiGraved:true,
    graved:false,
    liquidy:true
})

addElement('f',{
    symbol:'f',
    name:'Fire',
    density:99,
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

addElement('h',{
    symbol: "h",
    name: "Hydrochloric",
    liquidy: true,
    density: 15,
    friction: 0.1,
    acidSafe: true,
    acidic:true
})

addElement('m',{
    symbol: "m",
    name: "Methane",
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

addElement('o',{
    symbol: "o",
    name: "Oil",
    liquidy:true,
    density: 15,
    acc: 0.2,
    max:8,
    friction: 0,
    fuel:1,
    horizontalMax:2,

    flammable:true
})

addElement('r',{
    symbol: "r",
    name: "Rock",
    density: 90,
    acc: 0.5,
    max:10,
    friction: 0.99
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
    friction: 0,
    horizontalMax:4
})
