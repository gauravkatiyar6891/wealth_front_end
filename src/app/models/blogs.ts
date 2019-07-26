export interface Blogs {
    id: number,
    type: string,
    slug: string,
    url: string,
    status: string,
    title: string,
    title_plain: string,
    content: string,
    excerpt: string,
    date: Date,
    modified: Date,
    categories: {
        id: number,
        slug: string,
        title: string,
        description: string,
        parent: number,
        post_count: number
    }[],
    tags: {
        id: number,
        slug: string,
        title: string,
        description: string,
        post_count: number
    }[],
    author: {
        id: number,
        slug: string,
        name: string,
        first_name: string,
        last_name: string,
        nickname: string,
        url: string,
        description: string
    },
    comments: any[],
    attachments: any[],
    comment_count: number,
    comment_status: string,
    thumbnail: string,
    custom_fields: any,
    thumbnail_size: string
}