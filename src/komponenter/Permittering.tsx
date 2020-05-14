import React, { useEffect, useState } from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import Oversikt from './oversikt/Oversikt';
import Infoseksjon from './infoseksjon/Infoseksjon';
import PermittereAnsatte from './info-ark/infoark-permittere-ansatte/PermittereAnsatte';
import Ipermitteringsperioden from './info-ark/infoark-ipermitteringsperioden/Ipermitteringsperioden';
import VanligeSporsmal from './info-ark/infoark-vanlige-sporsmaal/VanligeSporsmal';
import './permittering.less';
import SistOppdatertInfo from './SistOppdatertInfo';
import NarSkalJegUtbetaleLonn from './info-ark/infoark-utbetale-lonn/NarSkalJegUtbetaleLonn';
import { fetchsanityJSON } from '../utils/fetch-utils';
import { skrivTilMalingBesokerSide } from '../utils/amplitudeUtils';
import SanityBlocktype from '../sanity-blocks/SanityBlocktype';
import { SanityBlockTypes } from '../sanity-blocks/sanityTypes';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '../sanity-blocks/serializer';

export const permitteringClassName = 'permittering';
const permittering = BEMHelper('permittering');

const Permittering = () => {
    const [sanityInnhold, setSanityInnhold] = useState<
        null | SanityBlockTypes[]
    >(null);

    useEffect(() => {
        const url =
            process.env.NODE_ENV === 'production'
                ? ''
                : 'http://127.0.0.1:3001';
        fetchsanityJSON(url)
            .then((res) => {
                setSanityInnhold(res);
                console.log(res);
            })
            .catch((err) => console.warn(err));

        skrivTilMalingBesokerSide();
    }, []);

    return (
        <div className={permittering.className}>
            <Banner classname="banner" />
            {console.log(sanityInnhold ? sanityInnhold[0].content : 'null')}

            <div className={permittering.element('container')}>
                <div className={permittering.element('wrapper')}>
                    <Oversikt className={permittering.className} />

                    <div className={permittering.element('info-container')}>
                        <SistOppdatertInfo className={permitteringClassName} />
                        <Infoseksjon
                            className={permittering.className}
                            overskrift="Hvordan permittere ansatte?"
                            id="hvordanPermittere"
                        >
                            {sanityInnhold ? (
                                <BlockContent
                                    blocks={sanityInnhold[4].content}
                                    serializers={serializers}
                                />
                            ) : null}
                            <PermittereAnsatte
                                className={permittering.className}
                            />
                        </Infoseksjon>
                        <Infoseksjon
                            className={permittering.className}
                            overskrift="Når skal jeg utbetale lønn?"
                            id="narSkalJegUtbetaleLonn"
                        >
                            <NarSkalJegUtbetaleLonn
                                className={permittering.className}
                            />
                        </Infoseksjon>
                        <Infoseksjon
                            className={permittering.className}
                            overskrift="I permitteringsperioden"
                            id="permitteringsperioden"
                        >
                            <Ipermitteringsperioden
                                className={permittering.className}
                            />
                        </Infoseksjon>
                        <Infoseksjon
                            className={permittering.className}
                            overskrift="Vanlige spørsmål"
                            id="vanligSpr"
                        >
                            <VanligeSporsmal
                                className={permittering.className}
                            />
                        </Infoseksjon>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permittering;
