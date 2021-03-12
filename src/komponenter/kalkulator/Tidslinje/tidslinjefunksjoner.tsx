import { datointervallKategori, DatoMedKategori } from '../typer';
import { antallDagerGåttDayjs, finnDato18MndTilbake } from '../utregninger';
import React from 'react';
import { Undertekst } from 'nav-frontend-typografi';
import Årsmarkør from './Årsmarkør/Årsmarkør';
import dayjs, { Dayjs } from 'dayjs';
import { formaterDato } from '../../Datovelger/datofunksjoner';

interface RepresentasjonAvPeriodeMedFarge {
    antallDagerISekvens: number;
    kategori: datointervallKategori;
    grenserTilFraværHøyre?: boolean;
    grenserTilFraværVenstre?: boolean;
    key: number;
}

export const lagHTMLObjektForAlleDatoer = (
    tidslinjeObjekter: DatoMedKategori[],
    breddePerElement: number,
    dagensDato: Dayjs
) => {
    return tidslinjeObjekter.map((objekt: DatoMedKategori, indeks: number) => {
        const style: React.CSSProperties = {
            width: breddePerElement.toString() + '%',
        };
        const erIdagBoolean = objekt.dato.isSame(dagensDato, 'day');
        const erIdag = erIdagBoolean ? ' dagens-dato' : '';
        const erÅrsmarkering = erFørsteJanuar(objekt.dato)
            ? ' årsmarkering'
            : '';
        return (
            <div
                key={indeks}
                id={'kalkulator-tidslinjeobjekt-' + indeks}
                style={style}
                className={
                    'kalkulator__tidslinjeobjekt' +
                    erIdag +
                    ' ' +
                    formaterDato(dayjs(objekt.dato)) +
                    erÅrsmarkering
                }
            >
                {erIdag && (
                    <div className={'tidslinje-dagens-dato-markør'}>
                        <Undertekst
                            className={'tidslinje-dagens-dato-markør-tekst'}
                        >
                            I dag
                            <br />
                            {formaterDato(dayjs())}
                        </Undertekst>
                        <div className={'tidslinje-dagens-dato-strek'} />
                        <div className={'tidslinje-dagens-dato-sirkel'} />
                    </div>
                )}
                {erÅrsmarkering && <Årsmarkør dato={objekt.dato} />}
            </div>
        );
    });
};

export const lagHTMLObjektForPeriodeMedFarge = (
    representasjonAvPerioderMedFarge: RepresentasjonAvPeriodeMedFarge[],
    breddePerDato: number
) => {
    return representasjonAvPerioderMedFarge.map((objekt, indeks) => {
        let borderRadius = '0';
        if (objekt.kategori === 0 && indeks !== 0) {
            const grenserTilFraværVenstre =
                objekt.kategori === 0 &&
                representasjonAvPerioderMedFarge[indeks - 1].kategori === 2;
            const grenserTilFraværHøyre =
                objekt.kategori === 0 &&
                representasjonAvPerioderMedFarge[indeks + 1].kategori === 2;
            if (grenserTilFraværVenstre) {
                borderRadius = '0 4px 4px 0';
            } else if (grenserTilFraværHøyre) {
                borderRadius = '4px 0 0 4px';
            } else {
                borderRadius = '4px';
            }
        }

        const style: React.CSSProperties = {
            width:
                (breddePerDato * objekt.antallDagerISekvens).toString() + '%',
            backgroundColor: finnFarge(objekt.kategori),
            borderRadius: borderRadius,
        };
        return <div style={style} key={indeks} />;
    });
};

export const regnUtHorisontalAvstandMellomToElement = (
    id1: string,
    id2: string
) => {
    const element1 = document.getElementById(id1);
    const element2 = document.getElementById(id2);
    const posisjonBeskrivelse1 = element1?.getBoundingClientRect();
    const posisjonBeskrivelse2 = element2?.getBoundingClientRect();
    const avstand =
        posisjonBeskrivelse1?.right!! - posisjonBeskrivelse2?.right!!;
    return Math.abs(avstand);
};

export const finnBreddeAvObjekt = (id: string) => {
    const element = document.getElementById(id);
    return element?.offsetWidth;
};

export const finnIndeksForDato = (
    dato: Dayjs,
    tidslinjeobjekt: DatoMedKategori[]
) => {
    let indeksDato = 0;
    tidslinjeobjekt.forEach((objekt, indeks) => {
        if (dato.isSame(objekt.dato, 'day')) {
            indeksDato = indeks;
        }
    });
    return indeksDato;
};

export const regnUtPosisjonFraVenstreGittSluttdatoDayjs = (
    tidslinjeObjekter: DatoMedKategori[],
    breddePerElementIProsent: number,
    sluttDato: Dayjs
) => {
    return (
        (finnIndeksForDato(sluttDato, tidslinjeObjekter) +
            1 -
            antallDagerGåttDayjs(finnDato18MndTilbake(sluttDato), sluttDato)) *
        breddePerElementIProsent
    );
};

export const fraPixelTilProsent = (idContainer: string, antallBarn: number) => {
    const breddeContainer = document.getElementById(idContainer)?.offsetWidth;
    const breddePerObjekt = breddeContainer!! / antallBarn;
    return (breddePerObjekt / breddeContainer!!) * 100;
};

export const lagObjektForRepresentasjonAvPerioderMedFarge = (
    tidslinjeObjekter: DatoMedKategori[]
) => {
    const fargePerioder: RepresentasjonAvPeriodeMedFarge[] = [];
    let rekkefølgeTeller = 1;
    tidslinjeObjekter.forEach((objekt, indeks) => {
        if (indeks !== 0) {
            if (
                tidslinjeObjekter[indeks - 1].kategori ===
                tidslinjeObjekter[indeks].kategori
            ) {
                rekkefølgeTeller++;
            } else {
                const fargeElement: RepresentasjonAvPeriodeMedFarge = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeObjekter[indeks - 1].kategori,
                    key: indeks,
                };
                fargePerioder.push(fargeElement);
                rekkefølgeTeller = 1;
            }
            if (indeks === tidslinjeObjekter.length - 1) {
                const fargeElement: RepresentasjonAvPeriodeMedFarge = {
                    antallDagerISekvens: rekkefølgeTeller,
                    kategori: tidslinjeObjekter[indeks].kategori,
                    key: indeks,
                };
                fargePerioder.push(fargeElement);
            }
        }
    });
    return fargePerioder;
};

const finnFarge = (kategori: datointervallKategori) => {
    if (kategori === 0) {
        return '#5EAEC7';
    }
    if (kategori === 2) {
        return '#E3B0AB';
    }
    return 'transParent';
};

export const erFørsteJanuar = (date: Dayjs) => {
    return date.month() === 0 && date.date() === 1;
};
