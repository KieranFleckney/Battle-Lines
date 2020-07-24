# Battle-Lines
Battle-Lines is a library for generating abstract images in the form of irregular rounded lines, which can be export as PNG/dataURL. With seed support to allow you to create exact same pattern when ever you need.
![](https://i.imgur.com/SMXPDnh.png)

# Content
[📦 Getting Battle-Lines](#getting-battle-lines)  
[🏎 Quickstart](#quickstart)  
[〽️ Modes](#modes)  
[🧰 API/Config](#api--configuration)  
[🛠 Custom Modes & Renderer](#custom-mode--renderer)  
[🧾 License](#license)  
[👨🏼‍💻 Contributing](#contributing)  
[💬 About](#about-the-project)  


# Getting Battle-Lines
You can grab Battle-Lines with npm/yarn:
```
npm install --save battle-lines
```
or
```
yarn add battle-lines
```

or download the bundle (minified):
 [**releases page**](https://github.com/KieranFleckney/Battle-Lines/releases).
 
# QuickStart
**Browsers**
```html
        <canvas id="canvas" width="1000" height="500"></canvas>
        <script src=".\scripts\BattleLines.min.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                let canvas = document.getElementById('canvas');
                battleline = BattleLines.New(
                    new BattleLines.Config(
                        canvas.width,
                        canvas.height,
                        20,
                        BattleLines.ClashMode,
                        {
                            BattleFieldSize: 20,
                        },
                        BattleLines.CanvasRenderer,
                        {
                            Canvas: canvas,
                            ColourOne: '#4AD4B9',
                            ColourTwo: '#9D5CF2',
                        }
                    )
                );

                battleline.Next();
            });
        </script>
```

**ES6**
```js
<script type="module">
            import * as bl from './node_modules/battle-lines/dist-esm/index.js';
            document.addEventListener('DOMContentLoaded', function () {
                let canvas = document.getElementById('canvas');
                let battleline = new bl.BattleLines(
                    new bl.Config(
                        canvas.width,
                        canvas.height,
                        20,
                        bl.ClashMode,
                        {
                            BattleFieldSize: 20,
                        },
                        bl.CanvasRenderer,
                        {
                            Canvas: canvas,
                            ColourOne: '#4AD4B9',
                            ColourTwo: '#9D5CF2',
                        }
                    )
                );
                battleline.Next();
            });
        </script>
```

**Node**
Need the node-canvas package to use this via Node.
```js
const fs = require('fs');
const bl = require('Battle-Lines');
const { createCanvas } = require('canvas');

const canvas = createCanvas(1000, 500);

let battlelines = new bl.BattleLines(
    new bl.Config(
        canvas.width,
        canvas.height,
        20,
        bl.ClashMode,
        {
            BattleFieldSize: 20,
        },
        bl.CanvasRenderer,
        {
            Canvas: canvas,
            ColourOne: '#ff0000',
            ColourTwo: '#00ff00',
        }
    )
);
battlelines.Next();
let buffer = battlelines.Export(bl.CanvasRendererExportOptions.NodeJs);
fs.writeFileSync('image.png', buffer);
```
# Modes
There are three modes/patterns which you can use by default. They have separate configs so you can adjust how they are generated. Images below show the default settings. [Docs](https://github.com/KieranFleckney/Battle-Lines/wiki)

**ClashMode**
![](https://i.imgur.com/SMXPDnh.png)
**ScatterMode**
![](https://i.imgur.com/2JabjFn.png)
**PincerMode**
![](https://i.imgur.com/5GqC7LY.png)
# API & Configuration
**Api**  
Please find the documentation for the api [here](https://github.com/KieranFleckney/Battle-Lines/wiki/API)

**Configuration**  
Please find the documentation for the different configuration options for both Modes and Renderers [here](https://github.com/KieranFleckney/Battle-Lines/wiki/Config)
# Custom Mode & Renderer
If the built in modes or renderers aren't to your liking you create your own. This is done by simply passing your own function in the config.  Please refer to the [docs](https://github.com/KieranFleckney/Battle-Lines/wiki) for information on creating your own Modes and Renderers. There is options for both Typescript and Javascript.
# License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/KieranFleckney/Battle-Lines/blob/master/LICENSE) file for details

# Contributing
Pull requests and issues are welcome! For all contributions, please:

1. Read the [Contributing](https://github.com/KieranFleckney/Battle-Lines/blob/master/CONTRIBUTING.md)
2. Search the existing [issues](https://github.com/KieranFleckney/Battle-Lines/issues) and [pull requests](https://github.com/KieranFleckney/Battle-Lines/pulls) to make sure your contribution isn't a duplicate

## Issues

If you're submitting a bug, please include the environment (browser/node) and relevant environment version(s) that you have encountered the bug in.

## Pull Requests

*Important: if you are submitting a pull request that does not address an open issue in the issue tracker, it would be a very good idea to create an issue to discuss your proposed changes/additions before working on them.*

1. Fork the repo on GitHub.
2. Install dependencies with `npm install`
3. Create a topic branch and make your changes.
4. (Optional) Run `npm run test` to test your code with jasmine
5. Run `npm run build` to make sure it complies
6. Submit a pull request to merge your topic branch into `master`.

**Developing**
You can use `npm run tsc:w` to start the typescript compiler and watch for changes. This will help to check for errors and keep unused code out of the library. I would recommend using the TextRenderer when developing a new Mode.

# About The Project
I created this project out of the lack of no library (I could find) to generate this pattern. With the only other way would be manually via image/vector editor, which I didn't like, as making one simple change would take a long time. This plus seeing trianglify.io inspired me to make this project. This is my first library and public Github project so trianglify repo helped a lot with the docs. I hope some people will find this library useful.
