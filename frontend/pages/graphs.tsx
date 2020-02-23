import React, {useState} from 'react';
import styled from 'styled-components';
import RawButton from '~/components/Button';
import RawRangeSlider from '~/components/RangeSlider';
import Content from '~/components/Content';
import Title from '~/components/Title';
import Field from '~/components/Field';
import {useTranslation, NextI18NextPage} from '~/utils/i18n';
import {rem} from '~/utils/style';
import NodeInfo from '~/components/GraphPage/NodeInfo';

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

const Graphs: NextI18NextPage<GraphsProps> = () => {
    const {t} = useTranslation(['graphs', 'common']);
    const [scale, setScale] = useState(0.5);

    const aside = (
        <section>
            <SubSection>
                <Button icon="download">{t('common:download-image')}</Button>
                <Button icon="download">{t('common:restore-image')}</Button>
            </SubSection>

            <SubSection>
                <Field label={`${t('common:scale')}:`}>
                    <RangeSlider min={0} max={1} step={0.1} value={scale} onChange={setScale} />
                </Field>
            </SubSection>

            <SubSection>
                <Field label={`${t('common:node-info')}:`}></Field>
                <NodeInfo></NodeInfo>
            </SubSection>
        </section>
    );

    return (
        <>
            <Title>{t('common:graphs')}</Title>
            <Content aside={aside}></Content>
        </>
    );
};

Graphs.getInitialProps = () => {
    return {
        namespacesRequired: ['graphs', 'common']
    };
};

export default Graphs;
