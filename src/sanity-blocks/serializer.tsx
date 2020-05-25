import {
    Element,
    Ingress,
    Innholdstittel,
    Normaltekst,
    Sidetittel,
    Systemtittel,
    Undertittel,
} from 'nav-frontend-typografi';
import React from 'react';

export enum TypoStyle {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6',
    Normal = 'normal',
}

export type TextBlock = {
    node: {
        markDefs: [];
        _key: string;
        _type: string;
        style: TypoStyle;
    };
    children: React.ReactElement[] | string[];
};

const typoComponents = {
    [TypoStyle.H1]: Sidetittel,
    [TypoStyle.H2]: Innholdstittel,
    [TypoStyle.H3]: Systemtittel,
    [TypoStyle.H4]: Undertittel,
    [TypoStyle.H5]: Ingress,
    [TypoStyle.H6]: Element,
    [TypoStyle.Normal]: Normaltekst,
};

interface T {
    props: TextBlock;
}

const Whitespace = (innhold: T): React.ReactElement => {
    return (
        <>
            {blockSerializer(innhold.props)}
            <br />
        </>
    );
};

const blockSerializer = (block: TextBlock) => {
    const TypoComponent =
        typoComponents[block.node.style] || typoComponents[TypoStyle.Normal];
    return <TypoComponent>{block.children}</TypoComponent>;
};

const serializeCheck = (block: TextBlock) => {
    return block.children[block.children.length - 1] !== '' ? (
        blockSerializer(block)
    ) : (
        <Whitespace props={block} />
    );
};

export const serializers = {
    types: {
        block: serializeCheck,
    },
};
