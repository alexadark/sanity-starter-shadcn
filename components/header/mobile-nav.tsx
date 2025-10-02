'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/components/logo';
import { useState } from 'react';
import { AlignRight } from 'lucide-react';
import { SETTINGS_QUERYResult, NAVIGATION_QUERYResult } from '@/sanity.types';
import { stegaClean } from 'next-sanity';
import * as LucideIcons from 'lucide-react';

type SanityLink = NonNullable<NAVIGATION_QUERYResult[0]['links']>[number];
type SanitySubItem = NonNullable<SanityLink['subItems']>[number];

export default function MobileNav({
  navigation,
  settings,
}: {
  navigation: NAVIGATION_QUERYResult;
  settings: SETTINGS_QUERYResult;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open Menu"
          variant="ghost"
          className="w-10 p-5 focus-visible:ring-1 focus-visible:ring-offset-1"
        >
          <AlignRight className="dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="mx-auto">
            <Logo settings={settings} />
          </div>
          <div className="sr-only">
            <SheetTitle>Main Navigation</SheetTitle>
            <SheetDescription>Navigate to the website pages</SheetDescription>
          </div>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4 pt-10">
          <Accordion
            type="single"
            collapsible
            className="flex w-full flex-col gap-4"
          >
            {navigation[0]?.links?.map((navItem: SanityLink) => {
              if (
                navItem?.hasSubmenu &&
                navItem?.subItems &&
                navItem.subItems.length > 0
              ) {
                return (
                  <AccordionItem
                    key={navItem._key}
                    value={navItem._key || navItem.title || ''}
                    className="border-b-0"
                  >
                    <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                      {navItem.title}
                    </AccordionTrigger>
                    <AccordionContent className="mt-2">
                      {navItem.subItems.map((subItem) => (
                        <SubMenuLink
                          key={subItem._key}
                          item={subItem}
                          onClose={() => setOpen(false)}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return navItem?.href ? (
                <Link
                  key={navItem._key}
                  href={navItem.href}
                  onClick={() => setOpen(false)}
                  target={navItem.target ? '_blank' : undefined}
                  rel={navItem.target ? 'noopener noreferrer' : undefined}
                  className="text-md font-semibold"
                >
                  {navItem.title}
                </Link>
              ) : null;
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const SubMenuLink = ({
  item,
  onClose,
}: {
  item: SanitySubItem;
  onClose: () => void;
}) => {
  const iconName = stegaClean(item.icon);
  const IconComponent = iconName && (LucideIcons as any)[iconName];

  return (
    <a
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.href || '#'}
      onClick={onClose}
      target={item.target ? '_blank' : undefined}
      rel={item.target ? 'noopener noreferrer' : undefined}
    >
      {IconComponent && (
        <div className="text-foreground">
          <IconComponent className="size-5 shrink-0" />
        </div>
      )}
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};
