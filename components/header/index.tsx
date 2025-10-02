import Link from 'next/link';
import Logo from '@/components/logo';
import MobileNav from '@/components/header/mobile-nav';
import DesktopNav from '@/components/header/desktop-nav';
import { ModeToggle } from '@/components/menu-toggle';
import { fetchSanitySettings, fetchSanityNavigation } from '@/sanity/lib/fetch';
import { Button } from '@/components/ui/button';
import { stegaClean } from 'next-sanity';

export default async function Header() {
  const settings = await fetchSanitySettings();
  const navigation = await fetchSanityNavigation();
  const menuPosition = stegaClean(settings?.menuPosition) || 'left';
  const headerButtons = settings?.headerButtons || [];

  return (
    <header className="sticky top-0 w-full border-border/40 bg-background/95 z-50">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" aria-label="Home page">
          <Logo settings={settings} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex gap-7 items-center flex-1 justify-between ml-8">
          <DesktopNav navigation={navigation} menuPosition={menuPosition} />

          {/* Right side buttons and theme toggle */}
          <div className="flex items-center gap-4">
            {headerButtons.length > 0 && (
              <div className="flex items-center gap-3">
                {headerButtons.map((button) =>
                  button?.href ? (
                    <Button
                      key={button._key}
                      variant={stegaClean(button?.buttonVariant)}
                      asChild
                    >
                      <Link
                        href={button.href}
                        target={button.target ? '_blank' : undefined}
                        rel={button.target ? 'noopener noreferrer' : undefined}
                      >
                        {button.title}
                      </Link>
                    </Button>
                  ) : null
                )}
              </div>
            )}
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center xl:hidden">
          <ModeToggle />
          <MobileNav navigation={navigation} settings={settings} />
        </div>
      </div>
    </header>
  );
}
