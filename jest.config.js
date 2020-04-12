module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "snapshotSerializers": ["enzyme-to-json/serializer"],
    "setupFiles": ["<rootDir>/src/testSetup.ts"],
    "setupFilesAfterEnv": ["<rootDir>/src/setupEnzyme.ts"],
    "collectCoverage": true,
    "coverageReporters": ['text', 'html', 'lcov'],
    "moduleNameMapper": {
      "office-ui-fabric-react/lib/(.*)$": "office-ui-fabric-react/lib-commonjs/$1",
      "@uifabric/utilities/lib/(.*)$": "@uifabric/utilities/lib-commonjs/$1",
      "@fluentui/react/lib/(.*)$": "@fluentui/react/lib-commonjs/$1",
    },
    "transformIgnorePatterns": [
      "node_modules/(?!office-ui-fabric-react)",
      "node_modules/(?!@uifabric)",
      "node_modules/(?!@fluentui)"
    ]
}