export default interface Filter {
    path: string;
    operator: string;
    value: string | boolean | number;
    type?: string;
}

function instanceOfFilter(object:any): object is Filter {
    return 'path' in object && 'operator' in object && 'value' in object;
}

export {
    instanceOfFilter
};
