import React, {useState, useEffect, useMemo} from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import RawButton from '~/components/Button';
import RawRangeSlider from '~/components/RangeSlider';
import Content from '~/components/Content';
import Title from '~/components/Title';
import Field from '~/components/Field';
import {useTranslation, NextI18NextPage} from '~/utils/i18n';
import {rem} from '~/utils/style';
import {fetcher} from '~/utils/fetch';
import NodeInfo from '~/components/GraphPage/NodeInfo';
import {Graph, Node, OpNode} from '~/resource';
import {useGraph} from '~/hooks/graphs';

const SubSection = styled.div`
    margin-bottom: ${rem(30)};
`;
const Button = styled(RawButton)`
    width: 100%;
    text-transform: uppercase;

    & + & {
        margin-top: ${rem(20)};
    }
`;

const RangeSlider = styled(RawRangeSlider)`
    width: 100%;
`;

interface GraphsProps {}

const useDag = (graph: Graph | undefined) => {
    const [currentNode, setCurrentNode] = useState<undefined | Node>(undefined);
    const {dagInfo, tmpFlag, setTmpFlag} = useGraph(graph);

    useEffect(() => {
        Promise.all([import('d3'), import('dagre-d3')] as const).then(([d3, {default: dagre}]) => {
            if (!dagInfo) {
                return;
            }

            const g = new dagre.graphlib.Graph();
            g.setGraph({}).setDefaultEdgeLabel(() => ({}));

            dagInfo.nodes.forEach(n => g.setNode(n.key, n));
            dagInfo.edges.forEach(e => g.setEdge(e[0], e[1]));

            const render = new dagre.render();
            const svg = d3.select('svg');
            const svgGroup = svg.append('g');
            render(d3.select('svg g'), g);

            let graphWidth = g.graph().width;
            let graphHeight = g.graph().height;

            svg.attr('viewBox', '0 0 ' + graphWidth + ' ' + graphHeight);
            // Center the graph
            var xCenterOffset = (+svg.attr('width') - g.graph().width) / 2;

            svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
            svg.attr('height', g.graph().height + 40);
        });
    }, [dagInfo]);

    return {currentNode, setCurrentNode, tmpFlag, setTmpFlag};
};

const Graphs: NextI18NextPage<GraphsProps> = () => {
    const {t} = useTranslation(['graphs', 'common']);
    const [scale, setScale] = useState(0.5);
    const {data: graph} = useSWR<{data: Graph}>('/graphs/graph', fetcher);
    const {currentNode} = useDag(graph ? graph.data : undefined);

    const aside = (
        <section>
            <SubSection>
                <Button icon="download">{t('common:download-image')}</Button>
                <Button icon="download">{t('common:restore-image')}</Button>
            </SubSection>

            <input value={scale} onChange={e => setScale(+e.target.value)}></input>

            <SubSection>
                <Field label={`${t('common:scale')}:`}>
                    <RangeSlider min={0} max={1} step={0.1} value={scale} onChange={setScale} />
                </Field>
            </SubSection>

            <SubSection>
                <Field label={`${t('common:node-info')}:`}></Field>
                {/* <NodeInfo node={currentNode}></NodeInfo> */}
            </SubSection>
        </section>
    );

    return (
        <>
            <Title>{t('common:graphs')}</Title>

            <Content aside={aside}>
                <svg style={{width: '100%', height: '500px'}}></svg>
            </Content>
        </>
    );
};

Graphs.getInitialProps = () => {
    return {
        namespacesRequired: ['graphs', 'common']
    };
};

export default Graphs;
