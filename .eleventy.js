const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require( "markdown-it" );
const markdownItAnchor = require( "markdown-it-anchor" );
const markdownItContainer = require( "markdown-it-container" );
const markdownItAttrs = require( "markdown-it-attrs" );
const markdownItTocDoneRight = require( "markdown-it-toc-done-right" );

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
    .use( markdownItTocDoneRight ); // ${TOC}

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setLibrary( "md", markdownLib );

  eleventyConfig.addCollection("customMetadata", function(collectionApi) {
    const posts = collectionApi.getAll();
    posts.forEach(post => {
      inputContent = post.template.inputContent;
      post.customTitle = post.template.inputContent.substring(
        inputContent.indexOf('# ') + 2,
        inputContent.indexOf('\n')
      )
    })
    return posts;
  });

  eleventyConfig.addFilter("getPageTitle", function(post) {
    return post.customTitle;
  });

  return {
    templateFormats: [
      "md",
      "njk"
    ],

    markdownTemplateEngine: "md",
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
