import { SanityBlockTypes, SistOppdatert } from '../sanity-blocks/sanityTypes';
import PermittereAnsatte from './seksjoner/PermittereAnsatte';
import FellesSeksjon from './seksjoner/FellesSeksjon';
import VanligeSporsmal from './seksjoner/infoark-vanlige-sporsmaal/VanligeSporsmal';
import { GrMoney } from 'react-icons/gr';
import { VscFeedback, VscQuestion, VscCalendar } from 'react-icons/vsc';
import { BiMessageDetail } from 'react-icons/bi';

export interface PermitteringInnhold {
    hvordanPermittere: [] | SanityBlockTypes[];
    narSkalJegUtbetale: [] | SanityBlockTypes[];
    iPermitteringsperioden: [] | SanityBlockTypes[];
    informasjonTilAnsatte: [] | SanityBlockTypes[];
    vanligeSpr: [] | SanityBlockTypes[];
}

export interface Seksjon {
    id: keyof PermitteringInnhold;
    navn: string;
    icon: React.ReactNode;
}

export type SettPermitteringInnhold = <
    K extends keyof NonNullable<PermitteringInnhold>,
    T extends SanityBlockTypes
>(
    felt: K,
    verdi: T
) => void;

export type SettSideSistOppdatert = <T extends SistOppdatert>(value: T) => void;

export const setPermitteringInnholdFraNokkelVerdi = (
    type: string,
    item: SanityBlockTypes,
    setSideSistOppdatert: <T extends SistOppdatert>(value: T) => void,
    settPermitteringInnhold: <
        K extends keyof NonNullable<PermitteringInnhold>,
        T extends SanityBlockTypes
    >(
        type: K,
        value: T
    ) => void
): void => {
    switch (type) {
        case 'sist-oppdatert':
            setSideSistOppdatert(item);
            break;
        case 'hvordan-permittere-ansatte':
            settPermitteringInnhold('hvordanPermittere', item);
            break;
        case 'i-permitteringsperioden':
            settPermitteringInnhold('iPermitteringsperioden', item);
            break;
        case 'nar-skal-jeg-utbetale-lonn':
            settPermitteringInnhold('narSkalJegUtbetale', item);
            break;
        case 'informasjon-til-ansatte':
            settPermitteringInnhold('informasjonTilAnsatte', item);
            break;
        case 'vanlige-sporsmal':
            settPermitteringInnhold('vanligeSpr', item);
            break;
    }
};

export const seksjoner: Seksjon[] = [
    {
        id: 'hvordanPermittere',
        navn: 'Hvordan permittere ansatte?',
        icon: VscFeedback,
    },
    {
        id: 'narSkalJegUtbetale',
        navn: 'Lønnsplikt ved permittering',
        icon: GrMoney,
    },
    {
        id: 'iPermitteringsperioden',
        navn: 'I permitteringsperioden',
        icon: VscCalendar,
    },
    {
        id: 'informasjonTilAnsatte',
        navn: 'Informasjon til ansatte',
        icon: BiMessageDetail,
    },
    {
        id: 'vanligeSpr',
        navn: 'Vanlige spørsmål',
        icon: VscQuestion,
    },
];

export const componentMap = {
    hvordanPermittere: PermittereAnsatte,
    narSkalJegUtbetale: FellesSeksjon,
    iPermitteringsperioden: FellesSeksjon,
    informasjonTilAnsatte: FellesSeksjon,
    vanligeSpr: VanligeSporsmal,
};
