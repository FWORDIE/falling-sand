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
    fuel: number;
    acidSafe: boolean;
    acidic: boolean;
    chaotic: boolean;
    bug: boolean;
    life: number;
    antiGraved: boolean;
    burn: boolean;
    flammable: boolean;
    static: boolean;
    null: boolean;
    grow: boolean;
    growth: number;
    growGiver: boolean;
    growing: boolean;
    desc: string;
    egg: boolean;
    explode: boolean;
    exploding: boolean;
    quartz: boolean;
    jam: boolean;
    kypto:boolean;
    x:boolean;
    z:boolean;
    y:boolean;
    insect:boolean;
    plant:boolean;
    water:Boolean;
    decay:boolean;

};

const DEFAULTS: Partial<element> = {
    graved: true,
    liquidy: false,
    nonslide: false,
    acidSafe: false,
    acidic: false,
    chaotic: false,
    bug: false,
    antiGraved: false,
    burn: false,
    flammable: false,
    static: false,
    life: 1,
    halfLife: 0.1,
    horizontalVelocity: 0,
    velocity: 0,
    acc: 0.3,
    max: 8,
    density: 50,
    friction: 0.5,
    fuel: 1,
    null: false,
    horizontalMax: 2,
    grow: false,
    growth: 0,
    growGiver: false,
    growing: false,
    desc: "its nothing yet",
    egg: false,
    explode: false,
    exploding: false,
    quartz: false,
    jam: false,
    kypto:false,
    x:false,
    z:false,
    y:false,
    insect:false,
    plant:false,
    water:false,
    decay:false
};

export const addElement = (key: string, elementConfig: Partial<element>) => {
    const configWithDefaults: element = {
        ...DEFAULTS,
        ...elementConfig,
    } as element;

    elements[key] = configWithDefaults;
};

addElement("s", {
    symbol: "s",
    name: "Sand",
    acc: 0.3,
    max: 8,
    density: 80,
    friction: 0.2,
    growGiver: true,
    horizontalMax: 2,
    desc: "it falls n' heaps",
});

addElement("e", {
    symbol: "e",
    name: "Egg",
    acc: 0.2,
    max: 8,
    density: 80,
    friction: 0.2,
    growGiver: true,
    horizontalMax: 0,
    egg: true,
    desc: "smashes into bug",
});

addElement("·", {
    symbol: "·",
    name: "Eraser",
    graved: false,
    density: 10,
    acc: 0,
    friction: 0.1,
    acidSafe: true,
    liquidy: true,
    null: true,
    desc: "Creates the void",
    quartz: true,
});

addElement("a", {
    symbol: "a",
    name: "Ash",
    acc: 0.1,
    max: 2,
    density: 40,
    friction: 0.1,
    horizontalMax: 3,
    growGiver: true,
    desc: "it falls, heaps n' nurturers",
});

addElement("b", {
    symbol: "b",
    name: "Bug",
    graved: false,
    chaotic: true,
    bug: true,
    density: 20,
    halfLife: 0.5,
    life: 1,
    flammable: true,
    desc: "has bug sex or dies",
});


addElement("i", {
    symbol: "i",
    name: "Insecticide",
    graved: false,
    chaotic: true,
    insect: true,
    density: 20,
    halfLife: 0.1,
    life: 1,
    desc: "kills bugs and plants",
});


addElement("d", {
    symbol: "d",
    name: "dead Bug",
    acc: 0.1,
    max: 1,
    density: 45,
    friction: 0.3,
    horizontalMax: 2,
    growGiver: true,
    flammable: true,
    desc: "dead",
});

addElement("c", {
    symbol: "c",
    name: "Cloud",
    acc: -0.3,
    max: -2,
    horizontalMax: 2,
    density: 5,
    friction: 0,
    antiGraved: true,
    graved: false,
    liquidy: true,
    desc: "abstract gas",
});

addElement("n", {
    symbol: "n",
    name: "Nitrogen-Oxide",
    acc: -0.3,
    max: -2,
    horizontalMax: 2,
    density: 5,
    friction: 0,
    acidic: true,
    acidSafe: true,
    antiGraved: true,
    graved: false,
    liquidy: true,
    desc: "acid gas",
});

addElement("f", {
    symbol: "f",
    name: "Fire",
    density: 99,
    friction: 0.5,
    graved: false,
    life: 1,
    halfLife: 0.05,
    burn: true,
    desc: "hot",
});

addElement("g", {
    symbol: "g",
    name: "Gravium",
    acc: -1,
    max: -8,
    density: 0,
    friction: 0.2,
    horizontalMax: 2,
    antiGraved: true,
    graved: false,
    life: 1,
    halfLife: 0.05,
    desc: "sand but funky",
});

addElement("h", {
    symbol: "h",
    name: "Hydrochloric",
    liquidy: true,
    density: 20,
    acc: 0.3,
    max: 8,
    friction: 0,
    horizontalMax: 4,
    acidSafe: true,
    acidic: true,
    desc: "acid but 'a' was taken",
});

addElement("v", {
    symbol: "v",
    name: "Vine",
    acc: 0.3,
    max: 8,
    velocity: 0.1,
    density: 20,
    friction: 1,
    horizontalMax: 0,
    grow: true,
    growth: 0,
    growGiver: true,
    flammable: true,
    growing: true,
    plant:true,
    desc: "grows when it can",
});

addElement("p", {
    symbol: "p",
    name: "Petal",
    acc: 0.3,
    max: 8,
    velocity: 0.1,
    density: 20,
    friction: 1,
    horizontalMax: 0,
    growth: 0,
    static: true,
    graved: false,
    flammable: true,
    plant:true,
    desc: "parts of a flower",
});

addElement("m", {
    symbol: "m",
    name: "Methane",
    acc: -0.5,
    max: -3,
    density: 5,
    friction: 0,
    fuel: 1,
    antiGraved: true,
    graved: false,
    liquidy: true,
    flammable: true,
    desc: "flammable gas",
});

addElement("l", {
    symbol: "l",
    name: "Logs",
    density: 70,
    acc: 0.4,
    max: 8,
    friction: 0.99,
    fuel: 10,
    flammable: true,
    nonslide: true,
    static: true,
    graved: false,
    desc: "anti-gravity fire wood",
});

addElement("t", {
    symbol: "t",
    name: "TNT",
    density: 70,
    acc: 0.4,
    max: 8,
    static: true,
    graved: false,
    explode: true,
    desc: "goes bomb",
});

addElement("o", {
    symbol: "o",
    name: "Oil",
    liquidy: true,
    density: 15,
    acc: 0.2,
    max: 8,
    friction: 0,
    fuel: 1,
    horizontalMax: 2,
    flammable: true,
    desc: "flammable water",
});

addElement("r", {
    symbol: "r",
    name: "Rock",
    density: 90,
    acc: 0.5,
    max: 10,
    friction: 0.99,
    static: true,
    graved: false,
    desc: "boring materail",
});

addElement("q", {
    symbol: "q",
    name: "Quartz",
    density: 90,
    acc: 0.5,
    max: 10,
    friction: 0.99,
    static: true,
    graved: false,
    quartz: true,
    desc: "nothing effects this rock",
    acidSafe: true,
});

addElement("k", {
    symbol: "k",
    name: "Kryptonite",
    density: 90,
    acc: 0.5,
    max: 10,
    friction: 0.99,
    static: true,
    graved: false,
    kypto:true,
    desc: "stops everything from working",
    acidSafe: true,
});

addElement("u", {
    symbol: "u",
    name: "uranium",
    density: 99,
    acc: 1,
    max: 10,
    friction: 0.1,
    static: true,
    graved: false,
    decay:true,
    desc: "decays to others",
});

addElement("w", {
    symbol: "w",
    name: "Water",
    liquidy: true,
    density: 20,
    acc: 0.3,
    max: 8,
    friction: 0,
    horizontalMax: 4,
    growGiver: true,
    desc: "tap",
    water:true
});

addElement("j", {
    symbol: "j",
    name: "Jam",
    liquidy: true,
    density: 50,
    acc: 0.6,
    max: 8,
    friction: 0.05,
    horizontalMax: 2,
    desc: "bugs get stuck",
    jam: true,
});

addElement("x", {
    symbol: "x",
    name: "X Device",
    density: 90,
    acc: 0.5,
    max: 10,
    friction: 0.99,
    static: true,
    graved: false,
    x:true,
    desc: "I ran out of ideas",
});

addElement("z", {
    symbol: "z",
    name: "Z Device",
    density: 90,
    acc: 0.5,
    max: 10,
    friction: 0.99,
    static: true,
    graved: false,
    z:true,
    desc: "I ran out of ideas",
});

addElement("y", {
    symbol: "y",
    name: "Y Device",
    density: 90,
    acc: 0.5,
    max: 10,
    friction: 0.99,
    static: true,
    graved: false,
    y:true,
    desc: "I ran out of ideas",
});
