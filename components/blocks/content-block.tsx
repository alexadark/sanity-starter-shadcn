import { cn } from '@/lib/utils';
import SectionContainer from '@/components/ui/section-container';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { stegaClean } from 'next-sanity';
import { PAGE_QUERYResult } from '@/sanity.types';

type ContentBlockProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'content-block' }
>;

export default function ContentBlock({
  padding,
  colorVariant,
  sectionWidth = 'narrow',
  stackAlign = 'left',
  tagLine,
  title,
  content,
}: ContentBlockProps) {
  const isNarrow = stegaClean(sectionWidth) === 'narrow';
  const align = stegaClean(stackAlign);
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      <div
        className={cn(
          'prose prose-lg dark:prose-invert max-w-none',
          align === 'center' ? 'text-center mx-auto' : undefined,
          isNarrow ? 'max-w-[48rem] mx-auto' : undefined,
          color === 'primary' ? 'prose-invert' : undefined
        )}
      >
        {(tagLine || title) && (
          <div className="mb-8">
            {tagLine && (
              <div className="leading-[0] mb-4">
                <span className="text-base font-semibold">{tagLine}</span>
              </div>
            )}
            {title && <h2 className="text-3xl md:text-5xl mb-0">{title}</h2>}
          </div>
        )}
        {content && <PortableTextRenderer value={content} />}
      </div>
    </SectionContainer>
  );
}
