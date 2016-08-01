# HighStart2
### Front-end Mobile-First Starter Kit

Powered by:

* [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0)
* [Bower](https://bower.io/)
* [PostCSS](http://postcss.org/)
* [AutoPrefixer](https://github.com/postcss/autoprefixer)
* [MqPacker](https://github.com/hail2u/node-css-mqpacker)
* [StyleFmt](https://github.com/morishitter/stylefmt)
* [CleanCSS](http://www.cleancss.com/)
* [SassDoc](http://sassdoc.com/)
* [Normalize](https://necolas.github.io/normalize.css/)
* [SCSS-MediaQuery](https://github.com/nicolasmn/scss-mediaquery)
* [ImageMin](https://github.com/imagemin/imagemin)

### System requirements
* Node v.6+

Although this starter kit can run on node v4 without a problem, the performance improvements alone worth upgrading, hence the recomendation to run the latest node version available.

If you're using NVM and don't want to set the default node to version 6, you can use deeper shell integration in order to auto-switch to the supported node version:
[.nvmrc](https://github.com/creationix/nvm#nvmrc)

### Installation

Clone the repository, and run the following command to set things up:
`npm install`

To enable automatic compiling of the SASS/JS files run:
`npm run watch`

To compile the assets for production, which includes minification, if turned on in the config, run:
`npm run build`

### Sass Architecture

The SASS folders structure mostly follows [The 7-1 Pattern](http://sass-guidelin.es/#the-7-1-pattern), with a couple of adjustments:

* The abstracts folder is renamed to helpers.
* There is no themes folder added by default, since it would be less often needed.
* The unique forms are to be placed under components folder, not layout.
* The standard form elements styling is to be added under base/_forms.
