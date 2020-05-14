import React from 'react';
import BlockContent from '@sanity/block-content-to-react';
import { Locale, LocaleBlock } from './common-types';
import { serializers } from './serializer';
import { SanityBlockTypes } from './sanityTypes';

export type TextBlock = {
    node: { style: any };
    children: React.ReactElement[];
};

type Test = any[];

const SanityBlocktype = (textblock: any) => {
    //
    return <BlockContent blocks={textblock} />;
};

export default SanityBlocktype;
