import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'e49ba657929b45afa17a4751499b5bd2',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: `vdor's blog`,
  domain: 'vdorchan.it',
  author: 'vdorchan',

  // open graph metadata (optional)
  description: `vdor's blog`,

  // social usernames (optional)
  // twitter: 'vdorchan',
  github: 'vdorchan.github.com',
  linkedin: '',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  // defaultPageCover: 'https://unsplash.com/photos/_MMP5j_fCqw/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTAzfHxHcmFkaWVudHxlbnwwfDB8fHwxNzAxMTUzMzE4fDA&force=true&w=2400',
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'About',
      pageId: 'f1199d37579b41cbabfc0b5174f4256a'
    },
    {
      title: 'Contact',
      pageId: '6a29ebcb935a4f0689fe661ab5f3b8d1'
    }
  ],
  showGithubShareButton: false,


  /**
   * new
   */
  NOTION_ACCESS_TOKEN: '',
  NOTION_PROPERTY_NAME: {
    password: 'password',
    type: 'type', // 文章类型，
    type_post: 'Post', // 当type文章类型与此值相同时，为博文。
    type_page: 'Page', // 当type文章类型与此值相同时，为单页。
    type_notice:
          'Notice', // 当type文章类型与此值相同时，为公告。
    type_menu: 'Menu', // 当type文章类型与此值相同时，为菜单。
    type_sub_menu:
          'SubMenu', // 当type文章类型与此值相同时，为子菜单。
    title: 'title', // 文章标题
    status: 'status',
    status_publish:
          'Published', // 当status状态值与此相同时为发布，可以为中文
    status_invisible:
          'Invisible', // 当status状态值与此相同时为隐藏发布，可以为中文 ， 除此之外其他页面状态不会显示在博客上
    summary: 'summary',
    slug: 'Slug',
    category: 'category',
    date: 'date',
    tags: 'Tags',
    icon: 'icon'
  }
})
