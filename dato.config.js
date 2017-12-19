const inspect = x => JSON.stringify(x, null, 2);
const htmlTag = require('html-tag');

const toHtml = tags =>
  tags
    .map(({ tagName, attributes, content }) =>
      htmlTag(tagName, attributes, content)
    )
    .join('');

const toSlug = str => str.trim().replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();

// dato.config.js
module.exports = (dato, root, i18n) => {
  const { home, midwives, tabs } = dato;

  console.log('Collections:', Object.keys(dato.collectionsByType));

  root.directory('content', content => {
    content.createPost(`/_index.md`, 'yaml', {
      frontmatter: {
        title: '',
        seoMetaTags: toHtml(home.seoMetaTags)
      },
      content: home.content
    });

    // ---------- lising type (midwife) ----------
    tabs.map(tab => {
      // make a new folder for each tab
      content.directory(tab.slug, dir => {

        dir.createPost(`/_index.md`, 'yaml', {
          frontmatter: {
            title: tab.title,
            blurb: tab.blurb,
            position: tab.position,
            image: tab.image.url({ fit: 'crop', crop: 'focalpoint', w: 800, h: 600, fm: 'jpg' }),
            tab: 'tab'
          },
          content: tab.description || ""
        })
        // ---------- listing (Karla) ----------
        tab.listings.map((listing, i) => {
          dir.createPost(`/${toSlug(listing.name)}.md`, 'yaml', {
            frontmatter: {
              title: listing.name,
              position: listing.position,
              photo:
                listing.picture &&
                  listing.picture.url({
                    auto: 'compress',
                    w: 300,
                    fm: 'jpg'
                  }),
              type: 'tab',
              category: tab.title,
              categorySlug: tab.slug,
              email: listing.email,
              phone: listing.phone,
              websiteUrl: listing.website,
              seoMetaTags: toHtml(listing.seoMetaTags),
              weight: i
            },
            content: listing.description
          });
        });
      });

      console.log(JSON.stringify(tab.toMap(), null, 4));
    });
  });
};
