import * as types from './types'

export interface SiteConfig {
  rootNotionPageId: string
  rootNotionSpaceId?: string

  name: string
  domain: string
  author: string
  description?: string
  language?: string

  twitter?: string
  github?: string
  linkedin?: string
  newsletter?: string
  youtube?: string
  zhihu?: string
  mastodon?: string

  defaultPageIcon?: string | null
  defaultPageCover?: string | null
  defaultPageCoverPosition?: number | null

  isPreviewImageSupportEnabled?: boolean
  isTweetEmbedSupportEnabled?: boolean
  isRedisEnabled?: boolean
  isSearchEnabled?: boolean

  includeNotionIdInUrls?: boolean
  pageUrlOverrides?: types.PageUrlOverridesMap
  pageUrlAdditions?: types.PageUrlOverridesMap

  navigationStyle?: types.NavigationStyle
  navigationLinks?: Array<NavigationLink>

  showGithubShareButton?: boolean

  NOTION_ACCESS_TOKEN?: string
  NOTION_PROPERTY_NAME: {
    password?: string
    type?: string // 文章类型，
    type_post?: string // 当type文章类型与此值相同时，为博文。
    type_page?: string // 当type文章类型与此值相同时，为单页。
    type_notice?: string // 当type文章类型与此值相同时，为公告。
    type_menu?: string // 当type文章类型与此值相同时，为菜单。
    type_sub_menu?: string // 当type文章类型与此值相同时，为子菜单。
    title?: string // 文章标题
    status?: string
    status_publish?: string // 当status状态值与此相同时为发布，可以为中文
    status_invisible?: string // 当status状态值与此相同时为隐藏发布，可以为中文 ， 除此之外其他页面状态不会显示在博客上
    summary?: string
    slug?: string
    category?: string
    date?: string
    tags?: string
    icon?: string
  }
}

export interface NavigationLink {
  title: string
  pageId?: string
  url?: string
}

export const siteConfig = (config: SiteConfig): SiteConfig => {
  return config
}
