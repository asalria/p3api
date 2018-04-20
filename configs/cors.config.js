// Configuration options: https://www.npmjs.com/package/cors#configuration-options

const originsAllowed = process.env.CORS_ORIGINS || [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://asalria.github.io/p3-web'
];

module.exports = {
    origin: function (origin, cb) {
        const allowed = originsAllowed.indexOf(origin) !== -1;
        cb(null, allowed);
    },
    credentials: true,
}