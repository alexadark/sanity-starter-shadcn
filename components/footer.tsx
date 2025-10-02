import Logo from '@/components/logo';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { fetchSanitySettings } from '@/sanity/lib/fetch';
import { getSocialIcon } from '@/lib/social-icons';
import { stegaClean } from 'next-sanity';

export default async function Footer() {
  const settings = await fetchSanitySettings();

  return (
    <footer>
      <div className="dark:bg-background py-8 dark:text-gray-300">
        <div className="container mx-auto px-4">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Logo - Left */}
            <div className="flex justify-center md:justify-start">
              <Link href="/" aria-label="Home page">
                <Logo settings={settings} />
              </Link>
            </div>

            {/* Footer Links - Center */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {settings?.footerLinks?.map((link) => (
                <Link
                  key={link._key}
                  href={link.href || '#'}
                  target={link.target ? '_blank' : undefined}
                  rel={link.target ? 'noopener noreferrer' : undefined}
                  className={cn(
                    buttonVariants({
                      variant: link.buttonVariant || 'link',
                    }),
                    'transition-colors hover:text-foreground/80 text-foreground/60 text-sm p-0 h-auto hover:bg-transparent'
                  )}
                >
                  {link.title}
                </Link>
              ))}
            </div>

            {/* Social Media - Right */}
            <div className="flex items-center justify-center md:justify-end gap-4">
              {settings?.socialLinks?.map((social) => {
                if (!social?.platform || !social?.url) return null;
                const platform = stegaClean(social.platform);
                const Icon = getSocialIcon(platform);
                return (
                  <Link
                    key={social._key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Copyright - Bottom */}
          <div className="mt-8 pt-8 border-t text-center text-xs text-foreground/60">
            <div className="flex items-center justify-center gap-2">
              <span>&copy; {new Date().getFullYear()}</span>
              {settings?.copyright && (
                <span className="[&>p]:!m-0">
                  <PortableTextRenderer value={settings.copyright} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
