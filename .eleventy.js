const markdownIt = require( "markdown-it" );
const markdownItAnchor = require( "markdown-it-anchor" );
const markdownItContainer = require( "markdown-it-container" );
const markdownItAttrs = require( "markdown-it-attrs" );
const markdownItTocDoneRight = require( "markdown-it-toc-done-right" );
const prism = require('markdown-it-prism');
const filters = require('./utils/filters.js')
const striptags = require("striptags");

module.exports = function( eleventyConfig ) {

  let markdownItOptions = {
    html: true, // use html in markdown
    linkify: false, // do not autolink urls
    typographer: true
  };

  let markdownLib = markdownIt( markdownItOptions )
    .use( markdownItContainer, "warning" )
    .use( markdownItContainer, "tip" )
    .use( markdownItAttrs, {
      leftDelimiter: "{:",
      rightDelimiter: "}",
      allowedAttributes: [ "id", "class", /^data\-.*$/ ],
    })
    .use( markdownItAnchor, {
      permalink: true, // add anchors to headings
      permalinkBefore: false, // after the heading
      permalinkSymbol: "#"
    })
    .use(prism, {
      defaultLanguageForUnknown: 'jinja2',
      defaultLanguageForUnspecified: 'js'
    })
    .use( markdownItTocDoneRight ); // ${TOC}

  eleventyConfig.addPassthroughCopy('blog/images/')
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setLibrary( "md", markdownLib );

  eleventyConfig.addCollection("customMetadata", function(collectionApi) {
    const posts = collectionApi.getAll();
    posts.forEach(post => {
      if ( post.data.title ) {
        post.customTitle = post.data.title;
      } else {
        const inputContent = post.template.inputContent;
        post.customTitle = post.template.inputContent.substring(
          inputContent.indexOf('# ') + 2,
          inputContent.indexOf('\n')
        )
      }
      const content = post.template.inputContent;
      // The start and end separators to try and match to extract the excerpt
      const separatorsList = [
        { start: '\n\n', end: '<!-- more -->' },
        { start: '\n\n', end: '\n\n' }
      ];
      separatorsList.some(separators => {
        const startPosition = content.indexOf(separators.start);
        const endPosition = content.indexOf(separators.end);
        post.excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
        return true;
      });
    });
    return posts;
  });

  /**
	 * Filters
	 * @link https://www.11ty.io/docs/filters/
	 */
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName])
	});

  return {
    templateFormats: [
      "md",
      "njk"
    ],

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: ".",
      includes: "_src",
      layouts: "_src/layouts",
      data: "_data",
      output: "_site"
    }
  };
}
