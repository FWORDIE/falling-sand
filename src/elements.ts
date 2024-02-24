export let elements: { [key: string]: element } = {
    s: {
        name: "Sand",
        graved: true,
        acc: 0.3,
        max: 8,
        density: 99,
    },
    w: {
        name: "Water",
        graved: true,
        liquidy: true,
        density: 10,
        acc: 0.3,
        max: 8,
    },
    r: {
        name: "Rock",
        graved: false,
        density: 99,
        acc: 0,
        max: 0,
    },
    "·": {
        name: "Air",
        graved: false,
        density: 0,
        acc: 0,
        max: 8,
    },
};

export type element = {
    name: string;
    density: number;
    graved: boolean;
    liquidy?: boolean;
    acc: number;
    max: number;
};
