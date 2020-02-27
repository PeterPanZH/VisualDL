import {useMemo, useState} from 'react';
import {Graph} from '~/resource';
import {OpNodeStyle, OutputNodeStyle} from './style';

type NodeUID = string;
interface DagNode {
    key: string;
    label: string;
    shape: string;
    class: string;
    style: string;
}
type DagEdge = [string, string];

interface NodeRelation {
    input: NodeUID[];
    output: NodeUID[];
}
interface NodeRelationMapping {
    [k: string]: NodeRelation;
}

/* misc */
const opNode = (name: number | string): NodeUID => `opNode_${name}`;
const relationPush = (
    nodeRelationMapping: NodeRelationMapping,
    nodeName: string,
    key: keyof NodeRelation,
    value: NodeUID
) => {
    const leaf = nodeRelationMapping[nodeName] || {input: [], output: []};
    leaf[key].push(value);
    nodeRelationMapping[nodeName] = leaf;
};

const traverseRelation = (
    nodeMapping: NodeRelationMapping,
    process: (bridgeName: string, aNodeUID: NodeUID, bNodeUID: NodeUID) => void
) => {
    for (const [valueNodeName, relations] of Object.entries(nodeMapping)) {
        const {input, output} = relations;

        input.forEach(inputTo => {
            output.forEach(outputTo => {
                process(valueNodeName, inputTo, outputTo);
            });
        });
    }
};

const buildNodeRelationMapping = (nodeList: Graph['node']) => {
    console.log(nodeList);
    return nodeList.reduce<NodeRelationMapping>((memo, node, i) => {
        const uid = opNode(i);
        (node.output || []).forEach(v => relationPush(memo, v, 'input', uid));
        (node.input || []).forEach(v => relationPush(memo, v, 'output', uid));

        return memo;
    }, {});
};

const expandRelations = (nodeMapping: NodeRelationMapping) => {
    const permanent: {nodes: DagNode[]; edges: DagEdge[]} = {nodes: [], edges: []};
    // a tmp node the middle man between input & output
    const temporary: {nodes: DagNode[]; edges: DagEdge[]} = {nodes: [], edges: []};

    traverseRelation(nodeMapping, (bridge, inputTo, outputTo) => {
        temporary.nodes.push({
            key: bridge,
            label: bridge,
            shape: 'diamond',
            class: 'output',
            style: OutputNodeStyle
        });

        temporary.edges.push([inputTo, bridge]);
        temporary.edges.push([bridge, outputTo]);
        permanent.edges.push([inputTo, outputTo]);
    });

    return {
        temporary,
        permanent
    };
};

export const normalize = (graph?: Graph) => {
    const nodeList = graph ? graph.node : [];
    const nodeRelationMapping = buildNodeRelationMapping(nodeList);
    const backboneNodes = nodeList.map((n, i) => ({
        key: opNode(i),
        label: n.opType,
        shape: 'rect',
        class: 'operator',
        style: OpNodeStyle
    }));

    // if (dic[obj]['input'].length === 0 && this.graphConfig.drawInputNode === true) {
    //   let temp = obj.indexOf('@');
    //   let nodeKey = obj;
    //   if (temp > 0) {
    //     nodeKey = obj.substr(0, temp);
    //   }
    //   let index = this.graphConfig.inputMap[nodeKey];
    //   let curInputNode = graphData['input'][index];
    //   this.setGraphNode(graph, nodeKey,
    //                     this.buildInputNodeLabel(curInputNode), 'rect', 'input', this.getInputNodeStyle());
    //   for (let output in dic[obj]['output']) {
    //     if (!dic[obj]['output'].hasOwnProperty(output)) continue;
    //     graph.setEdge(nodeKey, dic[obj]['output'][output]);
    //   }
    // }

    const {permanent, temporary} = expandRelations(nodeRelationMapping);

    return {
        permanent,
        temporary,
        backboneNodes
    };
};

export const useGraph = (graph?: Graph) => {
    const [tmpFlag, setTmpFlag] = useState(false);
    const facts = useMemo(() => normalize(graph), [graph]);

    const dagInfo = useMemo(() => {
        const {permanent, temporary, backboneNodes} = facts;

        if (tmpFlag) {
            return {
                nodes: backboneNodes.concat(temporary.nodes),
                edges: temporary.edges
            };
        }

        return {
            nodes: backboneNodes.concat(permanent.nodes),
            edges: permanent.edges
        };
    }, [facts, tmpFlag]);

    return {
        dagInfo,
        tmpFlag,
        setTmpFlag
    };
};
