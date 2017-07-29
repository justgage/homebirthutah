const inspect = x => JSON.stringify(x, null, 2);
const htmlTag = require("html-tag");

const toHtml = tags =>
  tags
  .map(({
      tagName,
      attributes,
      content
    }) =>
    htmlTag(tagName, attributes, content)
  )
  .join("");

const toSlug = str =>
  str.trim()
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .toLowerCase();

// dato.config.js
module.exports = (dato, root, i18n) => {
  const {
    aboutPage,
    midwives,
    tabs
  } = dato;

  console.log("Collections:", Object.keys(dato.collectionsByType));

  root.directory("content", content => {

    tabs.map(tab => {

      // make a new folder for each tab
      content.directory(tab.slug, dir => {

        // for each of the listings make a page
        tab.listings.map((listing, i) => {
          dir.createPost(`/${toSlug(listing.name)}.md`,
            "yaml", {
              frontmatter: {
                title: listing.name,
                photo: listing.picture && listing.picture
                  .url({
                    auto: "compress",
                    w: 300,
                    fm: 'jpg'
                  }),
                type: "tab",
                email: listing.email,
                phone: listing.phone,
                websiteUrl: listing.website,
                seoMetaTags: toHtml(listing.seoMetaTags),
                weight: i,
              },
              content: listing.description
            });
        })

      });

      console.log(JSON.stringify(tab.toMap(), null, 4));
    });
  });
};
