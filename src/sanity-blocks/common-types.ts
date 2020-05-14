import React from 'react';

export type Locale = 'nb';
export const defaultLocale = 'nb' as Locale;

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
    node: { style: TypoStyle };
    children: React.ReactElement[];
};

export type LocaleBlock = { [key: string]: TextBlock };

export type LocaleString = { [key: string]: string };

export type LocaleUrl = { [key: string]: string };

export type Page = {
    content: LocaleBlock;
    title: LocaleString;
};
