
//returner antall dager fom startdato tom sluttdato
import {
    AllePermitteringerOgFraværesPerioder,
    ARBEIDSGIVERPERIODE2DATO,
    DatoIntervall,
    PermitteringsperiodeInfo,
} from './kalkulator';
import { skrivOmDato } from '../Datovelger/datofunksjoner';
import { start } from 'repl';

export const antalldagerGått = (fra: Date, til?: Date) => {
    if (til) {
        const tilDato = til ? til : new Date()
        const msGatt = tilDato.getTime() - fra.getTime();
        const dagerGått = msGatt/(1000*60*60*24)
        return Math.ceil(dagerGått+1)
    }
    return 0;
}

export const antallUkerRundetOpp = (antallDager: number) => {
    return Math.ceil(antallDager/7);
}

export const datoErFørMars = (dato: Date) => {
    const førsteMars = new Date('2021-03-01')
    return dato.getTime()<førsteMars.getTime()
}

export const regnUtTotalAntallDager = (listeMedPermitteringsInfo: PermitteringsperiodeInfo[]): number => {
    let antallDagerBruktSummert = 0;
        listeMedPermitteringsInfo.forEach(informasjon => {
            if (informasjon.permitteringsIntervall.datoFra && informasjon) {
                const sumDager = antalldagerGått(informasjon.permitteringsIntervall.datoFra, informasjon.permitteringsIntervall.datoTil)
                - summerAlleFraværeperioder(informasjon)
                antallDagerBruktSummert += sumDager
            }
    })
    return antallDagerBruktSummert
}

export const regnUtDatoAGP2 = (dagerBrukt: number) => {
    const dagerIgjen = 210 - dagerBrukt;
    const dagenDato = new Date();
    const beregnetAGP2 = new Date(dagenDato);
    beregnetAGP2.setDate(beregnetAGP2.getDate() + dagerIgjen)
    if (dagerIgjen>0) {
        return beregnetAGP2
    }
    return ARBEIDSGIVERPERIODE2DATO
}

export const summerAlleFraværeperioder = (permitteringsinfo: PermitteringsperiodeInfo) => {
    let antall = 0;
    permitteringsinfo.andreFraværsIntervall.forEach(fraværsIntervall => {
        if (fraværsIntervall.datoFra) {
            antall += antalldagerGått(fraværsIntervall.datoFra, fraværsIntervall.datoTil)
        }
    })
    return antall
}

export const inngårIPermitteringsperiode = (permitteringsintervall: DatoIntervall, fraværsintervall: DatoIntervall) => {
    if (permitteringsintervall.datoFra && permitteringsintervall.datoTil && fraværsintervall.datoFra && fraværsintervall.datoTil) {
        const helefraVærsperiodenInngår = (fraværsintervall.datoFra!!.getTime() >= permitteringsintervall.datoFra!!.getTime())
            && (fraværsintervall.datoTil!!.getTime() <= permitteringsintervall.datoTil!!.getTime())

        const fraværIHelePerioden = (fraværsintervall.datoFra!!.getTime()<permitteringsintervall.datoFra!!.getTime()) &&
            fraværsintervall.datoTil!!.getTime()>permitteringsintervall.datoTil!!.getTime();

        const sisteDelInngår = (fraværsintervall.datoFra!!.getTime() > permitteringsintervall.datoFra!!.getTime()) &&
            fraværsintervall.datoFra!!.getTime() < permitteringsintervall.datoTil!!.getTime()

        const førsteDelInngår = (fraværsintervall.datoFra!!.getTime() < permitteringsintervall.datoFra!!.getTime()) &&
            fraværsintervall.datoTil!!.getTime() > permitteringsintervall.datoFra!!.getTime();

        switch(true) {
            case helefraVærsperiodenInngår:
                return antalldagerGått(fraværsintervall.datoFra!!, fraværsintervall.datoTil)
            case fraværIHelePerioden:
                return antalldagerGått(permitteringsintervall.datoFra!!, permitteringsintervall.datoTil)
            case sisteDelInngår:
                return antalldagerGått(fraværsintervall.datoFra!!, permitteringsintervall.datoTil)
            case førsteDelInngår:
                return antalldagerGått(permitteringsintervall.datoFra!!, fraværsintervall.datoTil)
            default:
                return 0
        }
    }
    return 0;
}

export const summerFraværsdagerIPermitteringsperiode = (permitteringsperiode: DatoIntervall, fraværsperioder: DatoIntervall[]) => {
    let antallFraværsdagerIPeriode = 0;
    fraværsperioder.forEach(periode => antallFraværsdagerIPeriode+=inngårIPermitteringsperiode(permitteringsperiode,periode))
    return antallFraværsdagerIPeriode
}

export const finnUtOmDefinnesOverlappendePerioder = (perioder: DatoIntervall[]) => {
    let finnesOverLapp = false;
    perioder.forEach(periode => {
        perioder.forEach(periode2 => {
            if (periode.datoFra && periode2.datoFra && (periode !== periode2)) {
                if (inngårIPermitteringsperiode(periode, periode2) > 0) {
                    finnesOverLapp = true;
                }
            }
        })
    })
    return finnesOverLapp
}

export const kuttAvDatoIntervallFørGittDato = (gittDato: Date, tidsIntervall: DatoIntervall) =>  {
    const nyttDatoIntervall: DatoIntervall = {
        datoFra: tidsIntervall.datoFra,
        datoTil: tidsIntervall.datoTil
    }
    if (datoIntervallErDefinert(tidsIntervall) && tidsIntervall.datoFra!!.getTime() <gittDato.getTime()) {
        console.log('linje 114')
        if (tidsIntervall.datoTil!!.getTime() >= gittDato.getTime()) {
            console.log('linje 115')
            nyttDatoIntervall.datoFra = gittDato;
        }
        else {
            nyttDatoIntervall.datoFra = undefined;
            nyttDatoIntervall.datoTil = undefined;
            }
        }
    skrivut(nyttDatoIntervall)
    return nyttDatoIntervall;
}

export const kuttAvDatoIntervallEtterGittDato = (gittDato: Date, tidsIntervall: DatoIntervall) =>  {
    const nyttDatoIntervall: DatoIntervall = {
        datoFra: tidsIntervall.datoFra,
        datoTil: tidsIntervall.datoTil
    }
    if (tidsIntervall.datoTil!!.getTime() > gittDato.getTime()) {
        if (tidsIntervall.datoFra!!.getTime() >= gittDato.getTime()) {
            nyttDatoIntervall.datoFra = undefined;
            nyttDatoIntervall.datoTil = undefined;
        }
        else {
            nyttDatoIntervall.datoTil = gittDato
        }
    }
    skrivut(nyttDatoIntervall)
    return nyttDatoIntervall;
}

const skrivut = (intervall: DatoIntervall) => {
    console.log(skrivOmDato(intervall.datoFra), skrivOmDato(intervall.datoTil))
}

const kuttAvDatoIntervallInnefor18mnd = (datoIntevall: DatoIntervall, startdato: Date, sluttDato: Date) => {
    const datoIntervallEtterStartperiode = kuttAvDatoIntervallFørGittDato(startdato, datoIntevall)
    const datoIntervallFørSluttperiode = kuttAvDatoIntervallEtterGittDato(sluttDato, datoIntervallEtterStartperiode)
    return datoIntervallFørSluttperiode
}

export const finnDato18MndSiden = (dato: Date) => {
    const dager18mnd = 30.5*18;
    const dato18mndsiden = new Date(dato);
    dato18mndsiden.setDate(dato18mndsiden.getDate() - dager18mnd);
    return dato18mndsiden;
}

export const finnDato18MndFram = (dato: Date) => {
    const dager18mnd = 30.5*18;
    const dato18mndFram = new Date(dato);
    dato18mndFram.setDate(dato18mndFram.getDate() + dager18mnd);
    return dato18mndFram;
}

export const finnTidligstePermitteringsdato = (datointervall: DatoIntervall[]) => {
    const tidligsteDato = new Date()
    let datoSatt = false
    datointervall.forEach( datoIntervall => {
        if (datoIntervall.datoFra && datoIntervall.datoFra< tidligsteDato) {
            tidligsteDato.setDate(datoIntervall.datoFra.getDate())
            datoSatt = true
        }
    }
    )
    if (datoSatt) {
        return tidligsteDato
    }
}

export const finnSistePermitteringsdag = (datointervall: DatoIntervall[]) => {
    const sisteDato = new Date()
    let datoSatt = false
    datointervall.forEach( datoIntervall => {
            if (datoIntervall.datoTil && datoIntervall.datoTil>sisteDato) {
                sisteDato.setDate(datoIntervall.datoTil.getDate())
                datoSatt = true
            }
        }
    )
    if (datoSatt) {
        return sisteDato
    }
}

const datoIntervallErDefinert = (datoIntervall: DatoIntervall) => {
    return datoIntervall.datoFra !== undefined && datoIntervall.datoTil !== undefined
}

const datoIntervallErForandret = (original: DatoIntervall, oppdatert: DatoIntervall) => {
    let erForandret = false
    if (datoIntervallErDefinert(original) && datoIntervallErDefinert(oppdatert)) {
        if ((skrivOmDato(original.datoFra) !== skrivOmDato(oppdatert.datoFra)) || skrivOmDato(original.datoTil) !== skrivOmDato(oppdatert.datoTil)) {
            erForandret = true
        }
    }
   return erForandret
}

export const settDatoerInnenforRiktigIntervall = (datoIntervall: DatoIntervall[], startDato: Date): DatoIntervall[] => {
    let datoerEndret = false;
    const sluttDato = finnDato18MndFram(startDato);
    datoIntervall.forEach((intervall , indeks)=> {
        if (datoIntervallErDefinert(intervall)) {
            const datoInnenfor18mndsperioden = kuttAvDatoIntervallInnefor18mnd(intervall, startDato, sluttDato);
            if (datoIntervallErForandret(intervall, datoInnenfor18mndsperioden)) {
                datoerEndret = true
            }
            datoIntervall[indeks] = datoInnenfor18mndsperioden;
        }
    })
    if (datoerEndret) {
        console.log('HER HAR DET ENDRA SEG JA')
        return datoIntervall
    }
    const tomliste: DatoIntervall[] = []
    return tomliste
}

export enum datointervallKategori {
    PERMITTERT,
    ARBEIDER,
    ANNETFRAVÆR
}

export interface DatoMedKategori {
    dato: Date
    kategori: datointervallKategori,
}

export const sjekkOmDatoErIntervall = (dato: Date, intervall: DatoIntervall) => {
    return dato.getTime()>=intervall.datoFra!!.getTime() && dato.getTime() <= intervall.datoTil!!.getTime()
}

export const konstruerTidlinje = (allePermitteringerOgFravær: AllePermitteringerOgFraværesPerioder): DatoMedKategori[] => {
    const startDato = finnTidligstePermitteringsdato(allePermitteringerOgFravær.permitteringer);
    const sluttDato = finnSistePermitteringsdag(allePermitteringerOgFravær.permitteringer);
    if (startDato && sluttDato) {
        const antallDagerIPeriode = antalldagerGått(startDato,sluttDato)
        const listeMedTidslinjeObjekter: DatoMedKategori[] = [];
        for (let dagteller = 0; dagteller < antallDagerIPeriode-1; dagteller++) {
            const aktuellDato = new Date(startDato);
            aktuellDato.setDate(startDato.getDate() + dagteller);
            const aktuellDatoMedKategori = finneKategori(aktuellDato, allePermitteringerOgFravær);
            listeMedTidslinjeObjekter.push(aktuellDatoMedKategori)
        }
        return listeMedTidslinjeObjekter
    }
    return [];
}

const finnesIIntervaller = (dato: Date, perioder: DatoIntervall[]) => {
    perioder.forEach(periode => {
        if (sjekkOmDatoErIntervall(dato, periode)) {
            return true
        }
    })
    return false
}

const finneKategori = (dato: Date, allePermitteringerOgFraværesPerioder: AllePermitteringerOgFraværesPerioder): DatoMedKategori => {
    const erFraVærsDato = finnesIIntervaller(dato, allePermitteringerOgFraværesPerioder.andreFraværsperioder)
    if (erFraVærsDato) {
        return {
            kategori: 2,
            dato: dato
        }
    }
    const erPermittert = finnesIIntervaller(dato, allePermitteringerOgFraværesPerioder.permitteringer)
    if (erPermittert) {
        return {
            kategori: 0,
            dato: dato
        }

    }
    return {
        kategori: 1,
        dato: dato
    }
}