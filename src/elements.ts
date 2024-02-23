export let elements:{[key: string]: any} ={

    's':{
        name:'Sand',
        movable:false,
        graved:true,
        acc:0.3,
        max:8,
        selectale: true
    },
    'r':{
        name:'Rock',
        movable:false,
        graved:false,
        acc:0,
        max:0,
        selectale: true
    },
    '·':{
        name:'Air',
        movable:true,
        graved:false,
        acc:0,
        max:8,
        selectale: true
    }
}