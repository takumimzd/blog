// Which mode is the environment running in? https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const { MODE } = import.meta.env;
export function single(post) {
  const slug = post.file.split('/').reverse()[0].replace('.md', '');
  return {
    ...post.frontmatter,
    Content: post.Content,
    slug: slug,
    draft: post.file.split('/').reverse()[1] === 'drafts',
    timestamp: new Date(post.frontmatter.date).valueOf(),
  };
}
export function published(posts) {
  return posts
    .filter((post) => post.frontmatter.title)
    .map((post) => single(post))
    .filter((post) => MODE === 'development' || !post.draft)
    .sort((a, b) => b.timestamp - a.timestamp);
}
export function getRSS(posts) {
  return {
    title: 'Kamio Blog RSS',
    description: 'Kamio Blog RSS Feed',
    stylesheet: true,
    customData: `<language>en-us</language>`,
    site: import.meta.env.SITE_URL,
    items: published(posts).map((post) => ({
      title: post.title,
      description: post.preview,
      link: post.slug,
      pubDate: new Date(post.date),
    })),
  };
}
