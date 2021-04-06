import React, { FunctionComponent, useContext, useState } from 'react';
import '../../kalkulator.less';
import './Permitteringsperiode.less';

import {
    AllePermitteringerOgFraværesPerioder,
    DatoIntervall,
} from '../../typer';

import DatoIntervallInput from '../../DatointervallInput/DatointervallInput';
import { Knapp } from 'nav-frontend-knapper';
import {
    finnDato18MndTilbake,
    finnSisteTilDato,
    formaterDato,
} from '../../utils/dato-utils';
import { PermitteringContext } from '../../../ContextProvider';

interface Props {
    indeks: number;
    allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder;
    setAllePermitteringerOgFraværesPerioder: (
        allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder
    ) => void;
}

const Permitteringsperiode: FunctionComponent<Props> = (props) => {
    const { dagensDato, innføringsdatoAGP2 } = useContext(PermitteringContext);
    const [
        feilmeldingPermitteringForeldet,
        setFeilmeldingPermitteringForeldet,
    ] = useState('');

    const leggTilNyPermitteringsperiode = () => {
        const sisteUtfyltePermitteringsdag = finnSisteTilDato(
            props.allePermitteringerOgFraværesPerioder.permitteringer
        );
        const startdatoForNyPeriode = sisteUtfyltePermitteringsdag
            ? sisteUtfyltePermitteringsdag.add(1, 'day')
            : undefined;
        const nyPeriode: Partial<DatoIntervall> = {
            datoFra: startdatoForNyPeriode,
            datoTil: undefined,
        };

        const kopiAvPermitterinsperioder = {
            ...props.allePermitteringerOgFraværesPerioder,
        };
        kopiAvPermitterinsperioder.permitteringer.push(nyPeriode);
        props.setAllePermitteringerOgFraværesPerioder(
            kopiAvPermitterinsperioder
        );
    };

    const oppdaterDatoIntervall = (datoIntervall: Partial<DatoIntervall>) => {
        const grenseDato = dagensDato.isBefore(innføringsdatoAGP2)
            ? innføringsdatoAGP2
            : dagensDato;
        const datoErForGammel = datoIntervall.datoFra?.isBefore(
            finnDato18MndTilbake(grenseDato)
        );
        if (datoErForGammel) {
            setFeilmeldingPermitteringForeldet(
                'Fyll inn perioder etter ' +
                    formaterDato(finnDato18MndTilbake(grenseDato)) +
                    '.'
            );
        } else {
            setFeilmeldingPermitteringForeldet('');
        }
        const kopiAvPermitteringsperioder = [
            ...props.allePermitteringerOgFraværesPerioder.permitteringer,
        ];
        kopiAvPermitteringsperioder[props.indeks] = datoIntervall;
        props.setAllePermitteringerOgFraværesPerioder({
            ...props.allePermitteringerOgFraværesPerioder,
            permitteringer: kopiAvPermitteringsperioder,
        });
    };
    const slettPeriode = () => {
        let nyePermitteringsperioder = [
            ...props.allePermitteringerOgFraværesPerioder.permitteringer,
        ];
        if (nyePermitteringsperioder.length > 1) {
            nyePermitteringsperioder.splice(props.indeks, 1);
        } else {
            nyePermitteringsperioder = [
                { datoFra: undefined, datoTil: undefined },
            ];
        }
        props.setAllePermitteringerOgFraværesPerioder({
            ...props.allePermitteringerOgFraværesPerioder,
            permitteringer: nyePermitteringsperioder,
        });
    };

    return (
        <div className={'permitteringsperiode'}>
            <DatoIntervallInput
                datoIntervall={
                    props.allePermitteringerOgFraværesPerioder.permitteringer[
                        props.indeks
                    ]
                }
                setDatoIntervall={oppdaterDatoIntervall}
                slettPeriode={slettPeriode}
                feilmeldingPåDatoIntervall={feilmeldingPermitteringForeldet}
            />
            {props.indeks ===
                props.allePermitteringerOgFraværesPerioder.permitteringer
                    .length -
                    1 && (
                <Knapp
                    className={'permitteringsperiode__legg-til-knapp'}
                    onClick={leggTilNyPermitteringsperiode}
                >
                    + Legg til ny periode
                </Knapp>
            )}
        </div>
    );
};

export default Permitteringsperiode;
