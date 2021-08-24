import React, { useContext, useState } from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import './permittering.less';
import SistOppdatertInfo from './SistOppdatertInfo';
import { PermitteringContext } from './ContextProvider';
import { componentMap, seksjoner } from './ContextTypes';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';

export const permitteringClassName = 'permittering';
const permittering = BEMHelper('permittering');

const Permittering = () => {
    const { permitteringInnhold, sistOppdatert } =
        useContext(PermitteringContext);
    const [seksjonsId, setSeksjonsId] = useState<number>(0);

    const innholdHentet = (): boolean =>
        seksjoner.every((s) => permitteringInnhold[s.id].length != 0);

    const seksjonsKomponent = () => {
        console.log('seksjonsId', seksjonsId);
        const valgtSeksjon = seksjoner[seksjonsId];
        const Component = componentMap[valgtSeksjon.id];
        return (
            <Component
                className={permittering.className}
                content={permitteringInnhold[valgtSeksjon.id]}
                navn={valgtSeksjon.navn}
                id={valgtSeksjon.id}
                key={seksjonsId}
            />
        );
    };

    return (
        <div className={permittering.className}>
            <Banner classname="banner" center={true}>
                Veiviser for permittering
            </Banner>
            <div className={permittering.element('container')}>
                <div
                    className={permittering.element('wrapper')}
                    id={permittering.element('wrapper')}
                >
                    {permitteringInnhold.hvordanPermittere.length != 0 ? (
                        <div></div>
                    ) : (
                        <div style={{ margin: '7rem 0' }}>
                            <NavFrontendSpinner type="XXL" />
                        </div>
                    )}
                    <div className={permittering.element('info-container')}>
                        <SistOppdatertInfo
                            className={permitteringClassName}
                            content={sistOppdatert}
                        />

                        {innholdHentet() && (
                            <div>
                                <div className={'permittering__hovedmeny'}>
                                    <Lenkepanel
                                        href="#"
                                        onClick={() => setSeksjonsId(0)}
                                        tittelProps="undertittel"
                                        border
                                    >
                                        Hvordan permittere ansatte?
                                    </Lenkepanel>
                                    <Lenkepanel
                                        href="#"
                                        onClick={() => setSeksjonsId(1)}
                                        tittelProps="undertittel"
                                        border
                                    >
                                        Lønnsplikt ved permittering
                                    </Lenkepanel>
                                    <Lenkepanel
                                        href="#"
                                        onClick={() => setSeksjonsId(2)}
                                        tittelProps="undertittel"
                                        border
                                    >
                                        I permitteringsperioden
                                    </Lenkepanel>
                                    <Lenkepanel
                                        href="#"
                                        onClick={() => setSeksjonsId(3)}
                                        tittelProps="undertittel"
                                        border
                                    >
                                        Informasjon til ansatte
                                    </Lenkepanel>
                                    <Lenkepanel
                                        href="#"
                                        onClick={() => setSeksjonsId(4)}
                                        tittelProps="undertittel"
                                        border
                                    >
                                        Avslutte en permittering
                                    </Lenkepanel>
                                    <Lenkepanel
                                        href="#"
                                        onClick={() => setSeksjonsId(4)}
                                        tittelProps="undertittel"
                                        border
                                    >
                                        Kalkulator for lønnsplikt
                                    </Lenkepanel>
                                    <Lenkepanel
                                        href="#"
                                        onClick={() => setSeksjonsId(4)}
                                        tittelProps="undertittel"
                                        border
                                    >
                                        Vanlige spørsmål
                                    </Lenkepanel>
                                </div>
                                {seksjonsKomponent()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permittering;
