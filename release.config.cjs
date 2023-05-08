module.exports = {
    "branches": [
      "main",
      {
        "name": "alpha",
        "prerelease": true
      },
      {
        "name": "beta",
        "prerelease": true
      }
    ],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      [
        "@semantic-release/github",
        {
          "assets": [
            {path:"package.json"}, 
            {path:"CHANGELOG.md"},
            {path:"README.md"},
            [
              "src/**/*.js",
              "src/**/*.d.ts",
              "!src/**/*.test.js",
              "!src/mocks/**/*"
            ]
          ],
          "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
        }
      ]
    ]
  }