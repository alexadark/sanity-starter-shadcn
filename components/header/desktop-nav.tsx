import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NAVIGATION_QUERYResult } from '@/sanity.types';
import { stegaClean } from 'next-sanity';

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]['links']>[number];

export default function DesktopNav({
  navigation,
  menuPosition = 'left',
}: {
  navigation: NAVIGATION_QUERYResult;
  menuPosition?: 'left' | 'center' | 'right';
}) {
  const positionClasses = {
    left: 'justify-start',
    center: 'justify-center flex-1',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'hidden xl:flex items-center gap-7 text-primary',
        positionClasses[menuPosition]
      )}
    >
      {navigation[0]?.links?.map((navItem: SanityLink) =>
        navItem?.href ? (
          <Button
            key={navItem._key}
            variant={stegaClean(navItem?.buttonVariant)}
            className={cn(
              stegaClean(navItem?.buttonVariant) === 'ghost' &&
                'transition-colors hover:text-foreground/80 text-foreground/60 text-sm p-0 h-auto hover:bg-transparent'
            )}
            asChild
          >
            <Link
              href={navItem.href}
              target={navItem.target ? '_blank' : undefined}
              rel={navItem.target ? 'noopener noreferrer' : undefined}
            >
              {navItem.title}
            </Link>
          </Button>
        ) : null
      )}
    </div>
  );
}
