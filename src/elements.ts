export let elements: { [key: string]: element } = {
    "·": {
        symbol: ".",
        name: "Air",
        graved: false,
        density: 0,
        acc: 0,
        max: 8,
        friction: 0.1,
        velocity: 0,
        nonDestructable: true,
        halfLife:1,
        life: 1,
    },
    a: {
        symbol: "a",
        name: "Acid",
        graved: true,
        liquidy: true,
        density: 10,
        acc: 0.3,
        max: 8,
        friction: 0.1,
        velocity: 0,
        horizontalVelocity: 0,
        nonDestructable: true,
        acidic:true,
        halfLife:1,
        life: 1,
    },
    b:{
        symbol: "b",
        name:'bug',
        graved:false,
        chaotic:true,
        bug:true,
        density: 0,
        acc: 0,
        max: 8,
        friction: 0.1,
        velocity: 0,
        halfLife:0.1,
        life: 1,

    },
    r: {
        symbol: "r",
        name: "Rock",
        graved: true,
        density: 99,
        acc: 0.5,
        max: 8,
        friction: 0.1,
        velocity: 0,
        nonslide:true,
        halfLife:1,
        life: 1,
    },
    s: {
        symbol: "s",
        name: "Sand",
        graved: true,
        acc: 0.3,
        max: 8,
        density: 99,
        friction: 0.5,
        velocity: 0,
        halfLife:1,
        life: 1,
    },
    u: {
        symbol: "u",
        name: "uranium",
        graved: true,
        density: 99,
        acc: 1,
        max: 10,
        friction: 0.1,
        halfLife:0.5,
        velocity: 0,
        nonslide:true,
        life: 1
    },
    w: {
        symbol: "w",
        name: "Water",
        graved: true,
        liquidy: true,
        density: 10,
        acc: 0.3,
        max: 8,
        friction: 0.1,
        velocity: 0,
        horizontalVelocity: 0,
        halfLife:1,
        life: 1
    },



};

export type element = {
    symbol: string;
    name: string;
    density: number;
    graved: boolean;
    acc: number;
    max: number;
    friction: number;
    velocity: number;
    liquidy?: boolean;
    nonslide?:boolean;
    horizontalVelocity?: number;
    halfLife:number;
    nonDestructable?:boolean;
    acidic?:boolean;
    chaotic?:boolean;
    bug?:boolean;
    life:number;
};
