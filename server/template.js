const sanityQueryKeys = () => [
    'sist-oppdatert',
    'hvordan-permittere-ansatte',
    'nar-skal-jeg-utbetale-lonn',
    'i-permitteringsperioden',
    'informasjon-til-ansatte',
    'vanlige-sporsmal',
];

const corsWhitelist = [
    '.nav.no',
    '.sanity.io',
    'http://localhost:3000',
    'http://localhost:3001',
    'amplitude.nav.no',
    'nav.',
];

module.exports.corsWhitelist = corsWhitelist;
module.exports.sanityQueryKeys = sanityQueryKeys;
