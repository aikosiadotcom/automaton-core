
<h1 align="center">AUTOMATON CORE<br/><div><h6><i>A Library For Developer To Build Bot</i></h6></div></h1>

<div align="center">
    
[![npm-publish](https://github.com/aikosiadotcom/automaton-core/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/aikosiadotcom/automaton-core/actions/workflows/npm-publish.yml)
![Branches](https://raw.githubusercontent.com/aikosiadotcom/automaton-core/main/badges/coverage-branches.svg?raw=true)
![Functions](https://raw.githubusercontent.com/aikosiadotcom/automaton-core/main/badges/coverage-functions.svg?raw=true)
![Lines](https://raw.githubusercontent.com/aikosiadotcom/automaton-core/main/badges/coverage-lines.svg?raw=true)
![Statements](https://raw.githubusercontent.com/aikosiadotcom/automaton-core/main/badges/coverage-statements.svg?raw=true)
![Jest coverage](https://raw.githubusercontent.com/aikosiadotcom/automaton-core/main/badges/coverage-jest%20coverage.svg?raw=true)

</div>

## HOW AUTOMATON LOAD YOUR BOT?

Automaton will load your bot based on:

1. **automaton** field on **package.json** 

2. load and instantiate your class based on **main** field in **package.json**

package.json
```
{
    "main": "index.js",
    "automaton":{
        "version": "1.0.0",
        "profile": "default",
        "cronjob": false,
        "runParameter": "page"
    },
    "type":"module"
}
```

3. your package.json must have field "type" = "module"

## Automaton Key Field

you can access this key field inside your class using following syntax:

```
this._manifest["profile"];//default
```

Below are some of the important automaton key field

### __version__ <Required>

Will be used when there is a major update in the future for compability.

### profile <Required>

this field will always **default** when in development mode based on process.env.NODE_ENV.

### cronjob <Required>

this field will always **false** when in development mode based on process.env.NODE_ENV.

if the cronjob is false (boolean value), then automaton will keep your bot alive until it's die.

if your bot run at spesific time, you can write using linux cronjob syntax or you can found out more on [node-cron](https://www.npmjs.com/package/node-cron)

### runParameter <Required>

automaton will pass a variable to method **run** based on this field

## FOR DEVELOPER

### HOW TO PUBLISH YOUR BOT

Please using:

```
npm run release
```

### NOTE

1. Dont't forget to **export** your class using **default** as following:

file: index.js
```
import Automaton from '@aikosia/automaton';

class YourBot extends Automaton{
    async run(context){
        const page = await context.newPage();
        await page.goto("https://google.com");
        await page.close();
    }
}

export default YourBot;
```

2. we add so many extension on **Page** class inside namespace automaton.

```
page.automaton.waitForResponse({goto:"https://google.com", waitUrl:"bla/bla", responseType: "json"});
```
