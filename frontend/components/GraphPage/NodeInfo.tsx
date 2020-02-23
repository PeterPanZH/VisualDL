import React, {FunctionComponent} from 'react';
import {useTranslation, NextI18NextPage} from '~/utils/i18n';

type StandardNode =
    | {
          nodeType: 'input';
          nodeInfo: {
              name: string;
              shape: string;
              data_type: string;
          };
      }
    | {
          nodeType: 'output';
      }
    | {
          nodeType: 'operator';
          nodeInfo: {
              input: string[];
              opType: string;
              output: string[];
          };
      };

interface NodeInfoProps {
    node?: StandardNode;
}

const NodeInfo: FunctionComponent<NodeInfoProps> = props => {
    const {t} = useTranslation(['graphs']);
    if (!props.node) {
        return <p>{t('click-node')}</p>;
    }

    const node = props.node;
    switch (node.nodeType) {
        case 'input':
            return (
                <ul>
                    <li>
                        {t('node-type')}: {node.nodeType}
                    </li>
                    <li>
                        {t('node-name')}: {node.nodeInfo.name}
                    </li>
                    <li>
                        {t('node-data-shape')}: {node.nodeInfo.shape}
                    </li>
                    <li>
                        {t('node-data-type')}: {node.nodeInfo.data_type}
                    </li>
                </ul>
            );
        case 'output':
            return (
                <ul>
                    <li>{t('node-type')}: output</li>
                </ul>
            );
        case 'operator':
            return (
                <ul>
                    <li>
                        {t('node-type')}: {node.nodeType}
                    </li>
                    <li>
                        {t('input')}: {node.nodeInfo.input}
                    </li>
                    <li>
                        {t('op-type')}: {node.nodeInfo.opType}
                    </li>
                    <li>
                        {t('output')}: {node.nodeInfo.output}
                    </li>
                </ul>
            );
        default:
            return <></>;
    }
};

export default NodeInfo;
