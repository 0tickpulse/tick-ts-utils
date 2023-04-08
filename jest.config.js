/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
    transform: {
        "\\.[jt]sx?$": ["ts-jest", {
            useESM: true,
        }],
    },
    moduleNameMapper: {
        "(.+)\\.js": "$1",
    },
    extensionsToTreatAsEsm: [".ts"],
};
