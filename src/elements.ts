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
        horizontalVelocity: 0
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
    halfLife?:number;
    nonDestructable?:boolean;
    acidic?:boolean;
};
