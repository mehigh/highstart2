# HighStart2
### Front-end Mobile-First Barebone start: Gulp 4 + CSS Linting + Normalize

### System requirements
* Node v.6+

If you're using NVM, you can use deeper shell integration in order to auto-switch to the supported node version, see:
[.nvmrc](https://github.com/creationix/nvm#nvmrc)

### Installation

Clone the repository, and run the following command to set things up:
`npm install`

To enable automatic compiling of the SASS/JS files run:
`npm run watch`

To compile the assets for production, which includes linting (autohealing of formatting with stylefmt, stylelint for a thorough reporting) and minification (clean-css), run:
`npm run build`

### Sass Architecture

The SASS folders structure mostly follows [The 7-1 Pattern](http://sass-guidelin.es/#the-7-1-pattern), with a couple of adjustments:
* The abstracts folder is renamed to helpers
* There is no themes folder added by default, since it would be less often needed
* The unique forms are considered a component, not a layout element
* The standard form elements styling is to be added under base/_forms.

