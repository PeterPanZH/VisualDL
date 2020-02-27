export type InputNode = {
    data_type: string;
    name: string;
    shape: string[];
};

export type OutputNode = {
    data_type: string;
    name: string;
    shape: string[];
};

export type OpNode = {
    input: string[];
    opType: string;
    output: string[];
};

export type Node = InputNode | OutputNode | OpNode;

export type Edge = {
    source: string;
    target: string;
    label: string;
};

export interface Graph {
    input: InputNode[];
    output: OutputNode[];
    name: string;
    node: OpNode[];
    edges: Edge[];
}
