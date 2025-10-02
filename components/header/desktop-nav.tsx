'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NAVIGATION_QUERYResult } from '@/sanity.types';
import { stegaClean } from 'next-sanity';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import * as LucideIcons from 'lucide-react';
import { useRouter } from 'next/navigation';

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]['links']>[number];
type SanitySubItem = NonNullable<SanityLink['subItems']>[number];

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
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {navigation[0]?.links?.map((navItem: SanityLink) => {
            if (
              navItem?.hasSubmenu &&
              navItem?.subItems &&
              navItem.subItems.length > 0
            ) {
              return (
                <NavigationMenuItem key={navItem._key}>
                  <DropdownTrigger navItem={navItem} />
                  <NavigationMenuContent className="bg-popover text-popover-foreground">
                    <div className="grid w-[400px] gap-3 p-4">
                      {navItem.subItems.map((subItem) => (
                        <SubMenuLink key={subItem._key} item={subItem} />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            return navItem?.href ? (
              <NavigationMenuItem key={navItem._key}>
                <NavigationMenuLink asChild>
                  <Link
                    href={navItem.href}
                    className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    target={navItem.target ? '_blank' : undefined}
                    rel={navItem.target ? 'noopener noreferrer' : undefined}
                  >
                    {navItem.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : null;
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function DropdownTrigger({ navItem }: { navItem: SanityLink }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (navItem.href) {
      e.preventDefault();
      e.stopPropagation();
      if (navItem.target) {
        window.open(navItem.href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(navItem.href);
      }
    }
  };

  return (
    <NavigationMenuTrigger className="bg-background" onClick={handleClick}>
      {navItem.title}
    </NavigationMenuTrigger>
  );
}

const SubMenuLink = ({ item }: { item: SanitySubItem }) => {
  const iconName = stegaClean(item.icon);
  const IconComponent = iconName && (LucideIcons as any)[iconName];

  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href || '#'}
        className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
        target={item.target ? '_blank' : undefined}
        rel={item.target ? 'noopener noreferrer' : undefined}
      >
        {IconComponent && (
          <div className="text-foreground">
            <IconComponent className="size-5 shrink-0" />
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm font-semibold">{item.title}</div>
          {item.description && (
            <p className="text-muted-foreground text-sm leading-snug">
              {item.description}
            </p>
          )}
        </div>
      </Link>
    </NavigationMenuLink>
  );
};
