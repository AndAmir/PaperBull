# Paperbull

### Paperbull is an online papertrading application designed to provide users with a cohesive stock trading experience. Users can log in with google and create their own profiles as they grow their virtual assets.

## Requirements

1. `npm install`
2. `pip install -r requirements.txt`

## Linting

### The following files were ignored:
1. app.test.js
2. index.js
3. reportWebVitals.js
4. setupTests.js
5. canvasjs.min.js
6. canvasjs.react.js

These files were not part of our main application, and therefore did not need to be linted.


### The following linting errors were ignored:
`disable=E1101,W1508,C0413,C0103`
These errors were inhibiting the team from running their code. For example, some of the above linting errors forced us to include `import models` at the top of the file, while it should be included after the db variable is initialized.