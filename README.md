# koa-render-view
  Koa2 template render middleware

## Installation
```
  $ npm install --save koa-render-view
```  
## Examples

### Basic usage
```javascript
const views = require('koa-render-view');
const path = require('path');

app.use(views(path.join(__dirname, '/views')));
app.use(async function ({render}, next) {
  await render('index', {
    message: "Hello world"
  });
});

```

### React server side rendering example
```
  $ npm install --save react react-dom babel-preset-react
``` 

test.jsx
```js
const React = require('react');

class Test extends React.Component {
    render() {
        return (
            <p>
                {this.props.message}
            </p>
        );
    }
}

module.exports = Test;
```

```js
app.use(views(path.join(__dirname, '/views')));
app.use(async function ({render}, next) {
  await render('test.jsx', {
    message: "Hello world"
  });
});

```

### Parameters usage
```javascript
app.use(views(path.join(__dirname, '/views'), {
      recursive: true,
      map: {
        html: "ejs"
      }
}));
app.use(async function ({render}, next) {
  await render('index', {
    message: "Hello world"
  });
});

```

#### Aliases usage

```javascript
const views = require('koa-render-view');
const data = {
    message: "Hello world"
};

app.use(views(path.join(__dirname, '/views'), {
  aliases: [{
      alias: "@alias", //alias it is any string, but alias cann`t contain symbols from path \/. 
      path: path.join(__dirname, "viewXXX")
  }]
}));
app.use(async function ({render}, next) {
  await render('index', data); //render index.html from views 
});

app.use(async function ({render}, next) {
  await render('@alias/index', data);//render index.html from alias path ( "viewXXX" )
});
```
### Multiple view folders
If folders "views" and "views1" contain the same file, will be conflict and render any from the same file. 
For example:
```javascript
const views = require('koa-render-view');
const path = require('path');

/*
  views
    -index.html
    
  views1
    -index.html
*/

app.use(views([
  path.join(__dirname, '/views'),
  path.join(__dirname, '/views1')
  ]));
app.use(async function ({render}, next) {
  await render('index', data);
});
```
In this case midleware renders first index.html in its file list. To decide this you need to write part of path
```javascript
  await render('views/index', data);// render index.html from views
  await render('views1/index', data);// render index.html from views1
```

## API 

#### `views( {(string|string[])}, parameters )`

#### [parameters.engine=[consolidate](https://github.com/tj/consolidate.js)]
Template engine. 
Custom engine example: 
```js
  const engine = {
    html: (filePath, data) => {
      return "...";
   }
  app.use(views(path.join(__dirname, '/views'), {engine}))
```

#### [parameters.cache=true] 
If cache true builds list of files when you create view middleware
```js
  fs.writeFileSync("views/x.html", MESSAGE);
  app.use(views(path.join(__dirname, '/views')))
  app.use(async function ({render}, next) {
    await render('x.html', data); //thats work
  });
```
**But in this case, it doesn\`t work, you need to set cache: false**
```js
  app.use(views(path.join(__dirname, '/views')))
  app.use(async function ({render}, next) {
    fs.writeFileSync("views/x.html", MESSAGE);
    await render('x.html', data); //error
  });
```
#### [parameters.extension="html"]
Default file extension, if extension === "html",then render("index") equals render("index.html")

#### [parameters.recursive=false]
Recursive read directory

#### [parameters.map={}]
It is map extenstion to render engine
```js
  app.use(views(path.join(__dirname, '/views'), {
    xejs: "ejs" // render file with extension .xejs by ejs engine
  }))
```
#### [parameters.aliases=[]]
You can create alias for path to your views
- alias - must be a **string starts from @,#,!,$,_ symbols and doesn\`t contain symbols /\\.**
- path - **absolute** path to directory
```js
app.use(views(path.join(__dirname, '/views'), {
  aliases: [{
      alias: "@alias",
      path: path.join(__dirname, "viewXXX")
  }]
}));

await render('index', data); //render views/index.html
await render('@alias/index', data); //render viewXXX/index.html
await render('@alias/deep/index', data); //render viewXXX/deep/index.html
```

#### [parameters.options={}] 
Render options field, these options will pass to render engine as parameters


## License

MIT License

Copyright (c) 2017 Artem Shtepenko

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
