import SplitInfoItem from '@/components/blocks/split/split-info-item';
import { PAGE_QUERYResult } from '@/sanity.types';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type SplitRow = Extract<Block, { _type: 'split-row' }>;
type SplitInfoList = Extract<
  NonNullable<SplitRow['splitColumns']>[number],
  { _type: 'split-info-list' }
>;

interface SplitInfoListProps extends SplitInfoList {
  isSingleColumn?: boolean;
}

export default function SplitInfoList({
  list,
  isSingleColumn,
}: SplitInfoListProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
        {list &&
          list.length > 0 &&
          list.map((item, index) => (
            <SplitInfoItem
              key={index}
              {...item}
              isSingleColumn={isSingleColumn}
            />
          ))}
      </div>
    </div>
  );
}
