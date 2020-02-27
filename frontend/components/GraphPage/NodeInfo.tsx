import React, {FunctionComponent} from 'react';
import {useTranslation, NextI18NextPage} from '~/utils/i18n';
import {InputNode, OutputNode, OpNode} from '~/resource';

interface NodeInfoProps {
    node?: (InputNode & {type: 'input'}) | (OutputNode & {type: 'output'}) | (OpNode & {type: 'op'});
}

const NodeInfo: FunctionComponent<NodeInfoProps> = props => {
    const {t} = useTranslation(['graphs']);
    if (!props.node) {
        return <p>{t('click-node')}</p>;
    }

    const node = props.node;
    switch (node.type) {
        case 'input':
            return (
                <ul>
                    <li>
                        {t('node-type')}: {node.type}
                    </li>
                    <li>
                        {t('node-name')}: {node.name}
                    </li>
                    <li>
                        {t('node-data-shape')}: {node.shape}
                    </li>
                    <li>
                        {t('node-data-type')}: {node.data_type}
                    </li>
                </ul>
            );
        case 'output':
            return (
                <ul>
                    <li>{t('node-type')}: output</li>
                </ul>
            );
        case 'op':
            return (
                <ul>
                    <li>
                        {t('node-type')}: {node.type}
                    </li>
                    <li>
                        {t('input')}: {node.input}
                    </li>
                    <li>
                        {t('op-type')}: {node.opType}
                    </li>
                    <li>
                        {t('output')}: {node.output}
                    </li>
                </ul>
            );
        default:
            return <></>;
    }
};

export default NodeInfo;
