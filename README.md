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

1. `E1101` is an error stating that an object had a non-existant member.
2. `W1508` is an error relating to environment variables, and was not necessary.
3. `C0413` is a wrong import position error, and prevents us from correctly importing modules.
4. `C0103` is a variable nomenclature error, detailing that our database variable was not correctly named; however the name was part of our naming scheme across the team.

These errors were inhibiting the team from running our code and collaborating effectively.