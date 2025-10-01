import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PAGE_QUERYResult, ColorVariant } from '@/sanity.types';
import * as LucideIcons from 'lucide-react';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type FeaturesCards = Extract<Block, { _type: 'features-cards' }>;
type Card = NonNullable<NonNullable<FeaturesCards['cards']>>[number];
type FeaturesCard = Extract<Card, { _type: 'features-card' }>;

interface FeaturesCardProps extends Omit<FeaturesCard, '_type' | '_key'> {
  color?: ColorVariant;
}

export default function FeaturesCard({
  color,
  mediaType,
  image,
  icon,
  tagLine,
  title,
  description,
  links,
}: FeaturesCardProps) {
  // Get the icon component from lucide-icon picker
  // The plugin stores icon as a string (icon name directly)
  const cleanIcon = stegaClean(icon);

  // Convert to PascalCase if needed (lucide icons are PascalCase)
  // e.g., "zap" -> "Zap", "arrow-right" -> "ArrowRight"
  const iconName = cleanIcon
    ? cleanIcon
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
    : null;

  // Debug logging
  console.log('Icon data:', {
    rawIcon: icon,
    cleanIcon,
    iconName,
    available: iconName && iconName in LucideIcons,
  });

  const IconComponent =
    iconName && (LucideIcons as any)[iconName]
      ? (LucideIcons as any)[iconName]
      : LucideIcons.Square;

  const cleanMediaType = stegaClean(mediaType);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden transition ease-in-out border rounded-3xl p-6',
        color === 'primary' ? 'border-primary-foreground/20' : 'border-border'
      )}
    >
      {/* Media Section */}
      {cleanMediaType === 'image' && image && image.asset?._id && (
        <div className="mb-6 relative h-[15rem] rounded-2xl overflow-hidden">
          <Image
            src={urlFor(image).url()}
            alt={image.alt || ''}
            placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
            blurDataURL={image?.asset?.metadata?.lqip || ''}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            quality={100}
          />
        </div>
      )}

      {cleanMediaType === 'icon' && (
        <div className="mb-6">
          <div
            className={cn(
              'inline-flex items-center justify-center w-12 h-12 rounded-lg',
              color === 'primary' ? 'bg-primary-foreground/10' : 'bg-primary/10'
            )}
          >
            <IconComponent
              className={cn(
                'w-6 h-6',
                color === 'primary' ? 'text-primary-foreground' : 'text-primary'
              )}
            />
          </div>
        </div>
      )}

      {/* Content Section */}
      <div
        className={cn(
          'flex-1',
          color === 'primary' ? 'text-background' : undefined
        )}
      >
        {tagLine && (
          <div className="mb-2">
            <span className="text-sm font-semibold uppercase tracking-wider opacity-70">
              {tagLine}
            </span>
          </div>
        )}

        {title && <h3 className="font-bold text-2xl mb-3">{title}</h3>}

        {description && <p className="mb-6">{description}</p>}

        {/* Links/Buttons Section */}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {links.map((link, index) =>
              link?.href ? (
                <Button
                  key={index}
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
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
