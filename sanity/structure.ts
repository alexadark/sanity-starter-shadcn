import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import {
  Files,
  FolderKanban,
  BookA,
  User,
  ListCollapse,
  Quote,
  Menu,
  Settings,
  FileText,
} from 'lucide-react';

export const structure = (S: any, context: any) =>
  S.list()
    .title('Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'page',
        title: 'Pages',
        icon: Files,
        S,
        context,
      }),
      S.listItem()
        .title('Posts')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Post')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]) // Default ordering
        ),
      S.listItem()
        .title('Projects')
        .schemaType('project')
        .icon(FolderKanban)
        .child(
          S.documentTypeList('project')
            .title('Project')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      orderableDocumentListDeskItem({
        type: 'category',
        title: 'Categories',
        icon: BookA,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'author',
        title: 'Authors',
        icon: User,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'faq',
        title: 'FAQs',
        icon: ListCollapse,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'testimonial',
        title: 'Testimonials',
        icon: Quote,
        S,
        context,
      }),
      S.divider({ title: 'Global' }),
      S.listItem()
        .title('Projects Page')
        .icon(FolderKanban)
        .child(
          S.editor()
            .id('projects-page')
            .schemaType('projects-page')
            .documentId('projects-page')
        ),
      S.listItem()
        .title('Blog Page')
        .icon(FileText)
        .child(
          S.editor()
            .id('blog-page')
            .schemaType('blog-page')
            .documentId('blog-page')
        ),
      S.listItem()
        .title('Navigation')
        .icon(Menu)
        .child(
          S.editor()
            .id('navigation')
            .schemaType('navigation')
            .documentId('navigation')
        ),
      S.listItem()
        .title('Settings')
        .icon(Settings)
        .child(
          S.editor()
            .id('settings')
            .schemaType('settings')
            .documentId('settings')
        ),
    ]);
