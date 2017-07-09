const inspect = x => JSON.stringify(x, null, 2);
const htmlTag = require("html-tag");

const toHtml = tags =>
  tags
    .map(({ tagName, attributes, content }) =>
      htmlTag(tagName, attributes, content)
    )
    .join("");

// dato.config.js
module.exports = (dato, root, i18n) => {
  const { aboutPage, midwives } = dato;
  console.log(Object.keys(dato.collectionsByType));

  // CONFIG
  // root.createPost(`content/about.md`, 'yaml', {
  //   frontmatter: {
  //     title: dato.aboutPage.title,
  //     type: 'about',
  //     seoMetaTags: toHtml(dato.aboutPage.seoMetaTags),
  //   },
  //   content: dato.aboutPage.content
  // });

  // inside a "post" directory...
  root.directory("content", dir => {
    // PAGES
    dir.createPost("/about.md", "yaml", {
      frontmatter: {
        title: aboutPage.title,
        subTitle: aboutPage.subtitle,
        type: "page",
        date: aboutPage.updatedAt,
        photo: aboutPage.photo.url(),
        seoMetaTags: toHtml(aboutPage.seoMetaTags)
      },
      content: aboutPage.bio
    });

    //////////  MIDWIFES /////////////////
    midwives.forEach(entry => {
      console.log("midwife", entry);
      dir.createPost(`/midwife/${entry.name}.md`, "json", {
        frontmatter: {
          title: entry.name,
          position: entry.position,
          type: "midwife",
          photo: entry.photo.url(),
          email: entry.email,
          phone: entry.phone,
          websiteUrl: entry.websiteUrl,
          seoMetaTags: toHtml(entry.seoMetaTags)
        },
        content: entry.description
      });
    });
  });
};
