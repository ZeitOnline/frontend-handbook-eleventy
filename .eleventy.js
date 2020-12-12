const markdownIt = require( "markdown-it" );
const markdownItAnchor = require( "markdown-it-anchor" );
const markdownItContainer = require('markdown-it-container');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItTocDoneRight = require('markdown-it-toc-done-right');

module.exports = function( eleventyConfig ) {

  let markdownItOptions = {
    html: true,
    linkify: true,
    typographer: true
  };

  let markdownLib = markdownIt(markdownItOptions)
    .use(markdownItContainer, 'warning' )
    .use(markdownItContainer, 'tip' )
    .use(markdownItAttrs, {
      leftDelimiter: '{:',
      rightDelimiter: '}',
      allowedAttributes: ['id', 'class', /^data\-.*$/],
    })
    .use(markdownItAnchor, {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '§'
    })
    .use(markdownItTocDoneRight);

  eleventyConfig.setLibrary('md', markdownLib);
}