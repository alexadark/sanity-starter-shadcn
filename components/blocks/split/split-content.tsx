import { cn } from '@/lib/utils';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TagLine from '@/components/ui/tag-line';
import { createElement } from 'react';
import { stegaClean } from 'next-sanity';
import { PAGE_QUERYResult } from '@/sanity.types';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type SplitRow = Extract<Block, { _type: 'split-row' }>;
type SplitContent = Extract<
  NonNullable<SplitRow['splitColumns']>[number],
  { _type: 'split-content' }
>;

interface SplitContentProps extends SplitContent {
  noGap?: boolean;
  isSingleColumn?: boolean;
}

export default function SplitContent({
  sticky,
  padding,
  noGap,
  isSingleColumn,
  tagLine,
  title,
  body,
  link,
}: SplitContentProps) {
  return (
    <div
      className={cn(
        !sticky ? 'flex flex-col justify-center' : undefined,
        padding?.top ? 'pt-16 xl:pt-20' : undefined,
        padding?.bottom ? 'pb-16 xl:pb-20' : undefined
      )}
    >
      <div
        className={cn(
          'flex flex-col items-start',
          sticky ? 'lg:sticky lg:top-56' : undefined,
          noGap ? 'px-10' : undefined,
          isSingleColumn && 'items-center'
        )}
      >
        <div
          className={cn(
            'flex flex-col',
            isSingleColumn && 'items-center text-center'
          )}
        >
          {tagLine && <TagLine title={tagLine} element="h2" />}
          {title &&
            createElement(
              tagLine ? 'h3' : 'h2',
              {
                className: cn('my-4 font-semibold leading-[1.2]'),
              },
              title
            )}
        </div>
        {body && (
          <div className={cn(isSingleColumn && 'max-w-2xl')}>
            <PortableTextRenderer value={body} />
          </div>
        )}
        {link?.href && (
          <div className="flex flex-col">
            <Button
              className="mt-2"
              variant={stegaClean(link?.buttonVariant)}
              size="lg"
              asChild
            >
              <Link
                href={link.href}
                target={link.target ? '_blank' : undefined}
              >
                {link.title}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
