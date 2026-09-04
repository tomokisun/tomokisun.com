import type { ComponentType } from 'react'
import type { BlogArticleProps } from './parts'
import WabloArticle from './wablo'

// slug → 記事本文。data/blog-posts.ts のメタ情報とこの表で1記事が成立する。
export const blogArticles: Record<string, ComponentType<BlogArticleProps>> = {
  wablo: WabloArticle,
}

export type { BlogArticleProps, BlogVariant } from './parts'
