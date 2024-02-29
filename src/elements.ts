export let elements: { [key: string]: element } = {
    s: {
        name: "Sand",
        graved: true,
        acc: 0.3,
        max: 8,
        density: 99,
        friction: 0.5
    },
    w: {
        name: "Water",
        graved: true,
        liquidy: true,
        density: 10,
        acc: 0.3,
        max: 8,
        friction: 0.1
    },
    r: {
        name: "Rock",
        graved: false,
        density: 99,
        acc: 0,
        max: 0,
        friction: 0.1
    },
    "·": {
        name: "Air",
        graved: false,
        density: 0,
        acc: 0,
        max: 8,
        friction: 0.1
    },
};

export type element = {
    name: string;
    density: number;
    graved: boolean;
    liquidy?: boolean;
    acc: number;
    max: number;
    friction:number;
};
