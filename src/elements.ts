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
    nonDestructable: boolean;
    acidic: boolean;
    chaotic: boolean;
    bug: boolean;
    life: number;
    antiGraved:boolean;
};

const DEFAULTS: Partial<element> = {
    graved: true,
    liquidy: false,
    nonslide: false,
    nonDestructable: false,
    acidic: false,
    chaotic: false,
    bug: false,
    antiGraved:false,
    life: 1,
    halfLife: 0.1,
    horizontalVelocity: 0,
    velocity: 0,
    acc: 0.3,
    max: 8,
    density: 50,
    friction: 0.5,
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
    nonDestructable: true,
});

addElement('a',{
    symbol: "a",
    name: "Acid",
    liquidy: true,
    density: 10,
    friction: 0.1,
    nonDestructable: true,
    acidic:true
})

addElement('b',{
    symbol: "b",
    name:'bug',
    graved:false,
    chaotic:true,
    bug:true,
    density: 5,
    halfLife:0.1,
    life: 1,
})

addElement('r',{
    symbol: "r",
    name: "Rock",
    density: 90,
    acc: 0.5,
    max:10,
    friction: 0.99
})

addElement('s',{
    symbol: "s",
    name: "Sand",
    acc: 0.3,
    max: 8,
    density: 80,
    friction: 0.5,
})

addElement('c',{
    symbol: "c",
    name: "cloud",
    acc: -0.3,
    max: 8,
    density: 5,
    friction: 0.1,
    antiGraved:true,
    graved:false,
    liquidy:true
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
