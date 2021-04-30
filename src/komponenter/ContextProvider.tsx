import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import * as Sentry from '@sentry/react';
import { SanityBlockTypes, SistOppdatert } from '../sanity-blocks/sanityTypes';
import { fetchsanityJSON } from '../utils/fetch-utils';
import { skrivTilMalingBesokerSide } from '../utils/amplitudeUtils';
import { scrollIntoView } from '../utils/scrollIntoView';
import { setEnv } from '../sanity-blocks/serializer';
import {
    PermitteringInnhold,
    SetCMSLasteStatus,
    setPermitteringInnholdFraNokkelVerdi,
    SettPermitteringInnhold,
    SettSideSistOppdatert,
} from './ContextTypes';

interface Props {
    children: React.ReactNode;
}

export enum Status {
    INNHOLD_KLART = 'INNHOLD_KLART',
    INNHOLD_LASTER = 'INNHOLD_LASTER',
}

export type DocumentTypes = SanityBlockTypes;

export interface Context {
    permitteringInnhold: PermitteringInnhold;
    sistOppdatert: SistOppdatert | null;
    settPermitteringInnhold: SettPermitteringInnhold;
    setSideSistOppdatert: SettSideSistOppdatert;
    cmsInnholdStatus: Status;
    setCMSLasteStatus: SetCMSLasteStatus;
    dagensDato: Dayjs;
    innføringsdatoAGP2: Dayjs;
}

export const PermitteringContext = React.createContext({} as Context);

const ContextProvider = (props: Props) => {
    const [innhold, setInnhold] = useState({
        hvordanPermittere: [],
        narSkalJegUtbetale: [],
        iPermitteringsperioden: [],
        informasjonTilAnsatte: [],
        vanligeSpr: [],
    });

    const [innholdStatus, setInnholdStatus] = useState<Status>(
        Status.INNHOLD_LASTER
    );

    const [sistOppdatert, setSistOppdatert] = useState<SistOppdatert | null>(
        null
    );

    const [dagensDato] = useState<Dayjs>(dayjs().startOf('date'));

    const settPermitteringInnhold = <
        K extends keyof NonNullable<PermitteringInnhold>,
        T extends SanityBlockTypes
    >(
        type: K,
        value: T
    ): void => {
        return setInnhold((prevState) => ({
            ...prevState,
            [type]: [...prevState[type], value],
        }));
    };

    const setSideSistOppdatert = <T extends SistOppdatert>(value: T): void => {
        setSistOppdatert(value);
    };

    const setCMSLasteStatus = <T extends Status>(status: T): void => {
        setInnholdStatus(status);
    };

    const contextData: Context = {
        permitteringInnhold: innhold,
        sistOppdatert,
        settPermitteringInnhold,
        setSideSistOppdatert,
        setCMSLasteStatus,
        cmsInnholdStatus: innholdStatus,
        dagensDato: dagensDato,
        innføringsdatoAGP2: dayjs('2021-06-01'),
    };

    useEffect(() => {
        fetchsanityJSON()
            .then((res) => {
                setEnv(res.env);
                res.data.forEach((item) => {
                    setPermitteringInnholdFraNokkelVerdi(
                        item._type,
                        item,
                        setSideSistOppdatert,
                        settPermitteringInnhold
                    );
                });
            })
            .catch((err) => {
                Sentry.captureException(err);
                console.warn(err);
            });
        skrivTilMalingBesokerSide();
        scrollIntoView();
    }, []);

    return (
        <PermitteringContext.Provider value={contextData}>
            {props.children}
        </PermitteringContext.Provider>
    );
};

export default ContextProvider;
