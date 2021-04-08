import React, { FunctionComponent } from 'react';

import './MobilversjonKort.less';
import { DatoIntervall, DatoMedKategori } from '../../../typer';
import {
    formaterDatoIntervall,
    getOverlappendePeriode,
} from '../../../utils/dato-utils';
import { getPermitteringsoversikt } from '../../../utils/beregningerForAGP2';
import AttributtVisning from './AttributtVisning/AttributtVisning';

interface Props {
    tidslinje: DatoMedKategori[];
    permitteringsperioderInnenfor18mndsperiode: DatoIntervall[];
}

const MobilversjonKort: FunctionComponent<Props> = ({
    tidslinje,
    permitteringsperioderInnenfor18mndsperiode,
}) => {
    return (
        <li
            className="mobilversjon-kort"
            aria-label={'liste med informasjon om enkelt arbeidsforhold'}
        >
            {permitteringsperioderInnenfor18mndsperiode.map(
                (periode, index) => {
                    const permitteringsoversikt = getPermitteringsoversikt(
                        tidslinje,
                        periode
                    );
                    return (
                        <ul className="mobilversjon-kort__liste">
                            <AttributtVisning
                                attributt="Permitteringsperiode"
                                attributtVerdi={formaterDatoIntervall(periode)}
                            />
                            <AttributtVisning
                                attributt="Lengde permittering"
                                attributtVerdi={
                                    permitteringsoversikt.dagerPermittert +
                                    ' dager'
                                }
                            />
                            <AttributtVisning
                                attributt="Fravær"
                                attributtVerdi={
                                    permitteringsoversikt.dagerAnnetFravær +
                                    ' dager'
                                }
                            />
                            <AttributtVisning
                                attributt="Permitteringsdager u/fravær"
                                attributtVerdi={
                                    permitteringsoversikt.dagerBrukt + ' dager'
                                }
                            />
                        </ul>
                    );
                }
            )}
        </li>
    );
};

export default MobilversjonKort;
