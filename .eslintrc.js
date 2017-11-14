module.exports = {
    "env": {
        "node": true
    },
    "extends": [
        "eslint:recommended",
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
        },
        "sourceType": "module"
    },
    "plugins": [
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "warn",
        "array-bracket-spacing": "error",
        "block-spacing": [
            "error",
            "always"
        ],
        "brace-style": "error",
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "camelcase": [
            "error",
            { "properties": "always" }
        ],
        "comma-spacing": "error",
        "no-mixed-spaces-and-tabs": "error",
        "eol-last": "error"
    }
};