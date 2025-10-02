import { stegaClean } from 'next-sanity';
import { cn } from '@/lib/utils';
import SplitCardsItem from '@/components/blocks/split/split-cards-item';
import { PAGE_QUERYResult, ColorVariant } from '@/sanity.types';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type SplitRow = Extract<Block, { _type: 'split-row' }>;
type SplitCardsList = Extract<
  NonNullable<SplitRow['splitColumns']>[number],
  { _type: 'split-cards-list' }
>;

interface SplitCardsListProps extends SplitCardsList {
  color?: ColorVariant;
  isSingleColumn?: boolean;
}

export default function SplitCardsList({
  color,
  list,
  isSingleColumn,
}: SplitCardsListProps) {
  const colorParent = stegaClean(color);

  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-12',
        isSingleColumn && 'items-center'
      )}
    >
      {list &&
        list.length > 0 &&
        list.map((item, index) => (
          <SplitCardsItem
            key={index}
            color={colorParent}
            tagLine={item.tagLine}
            title={item.title}
            body={item.body}
            isSingleColumn={isSingleColumn}
          />
        ))}
    </div>
  );
}
