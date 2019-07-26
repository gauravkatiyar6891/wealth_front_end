export interface WordPressPosts {
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
    attachments: {
        id: number,
        url: string,
        slug: string,
        title: string,
        description: string,
        caption: string,
        parent: string,
        mime_type: string,
        images: {
            full: {
                url: string,
                width: number,
                height: number
            }
        }
    }[],
    comment_count: number,
    comment_status: string,
    custom_fields: any,
    thumbnail: any,
    thumbnail_size: string,
    thumbnail_images: {
        full: {
            url: string,
            width: number,
            height: number
        }
    }
}