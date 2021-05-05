import React, { useContext } from 'react';
import BEMHelper from '../utils/bem';
import Banner from './banner/Banner';
import Meny from './meny/Meny';
import './permittering.less';
import SistOppdatertInfo from './SistOppdatertInfo';
import { PermitteringContext } from './ContextProvider';
import { componentMap, Seksjon, seksjoner } from './ContextTypes';
import NavFrontendSpinner from 'nav-frontend-spinner';
export const permitteringClassName = 'permittering';
const permittering = BEMHelper('permittering');

const Permittering = () => {
    const { permitteringInnhold, sistOppdatert } = useContext(
        PermitteringContext
    );

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
                        <Meny />
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
                        {seksjoner.map((seksjon: Seksjon, index: number) => {
                            const Component = componentMap[seksjon.id];

                            return permitteringInnhold[seksjon.id].length !=
                                0 ? (
                                <Component
                                    className={permittering.className}
                                    content={permitteringInnhold[seksjon.id]}
                                    navn={seksjon.navn}
                                    id={seksjon.id}
                                    key={index}
                                />
                            ) : null;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permittering;
