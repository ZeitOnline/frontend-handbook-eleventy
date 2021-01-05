const { DateTime } = require("luxon");

module.exports = {

  /**
   * Return customTitle from post
   * @param {object} post
   */
  getPageTitle: (post) => post.customTitle,

  getExcerpt: (post) => post.excerpt,

  generateEleventyNavigation: (posts) => {
    var pages = [];
    posts.forEach(post => {
      if (post.filePathStem.includes('/index')) {
        pages.push({
            key: post.filePathStem === '/index' ? 'a' : post.fileSlug, // index shall be first page
            url: post.url,
            title: post.filePathStem === '/index' ? 'Home' : post.customTitle, // index should have title "Home"
            children: []
        })
      }
    })
    return pages.sort((a, b) => a.key.localeCompare(b.key));
  },

  readableDate: (dateObj) => DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy"),

}
