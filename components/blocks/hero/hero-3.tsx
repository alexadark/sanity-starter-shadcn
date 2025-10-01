import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { stegaClean } from 'next-sanity';
import { PAGE_QUERYResult } from '@/sanity.types';

type Hero3Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'hero-3' }
>;

export default function Hero3({
  backgroundImage,
  title,
  description,
  links,
}: Hero3Props) {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && backgroundImage.asset?._id && (
        <Image
          src={urlFor(backgroundImage).url()}
          alt={backgroundImage.alt || ''}
          fill
          className="object-cover"
          priority
          quality={100}
          placeholder={
            backgroundImage?.asset?.metadata?.lqip ? 'blur' : undefined
          }
          blurDataURL={backgroundImage?.asset?.metadata?.lqip || ''}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {title && (
          <div className="inline-block border-4 border-white px-8 py-6 md:px-12 md:py-8 mb-6 animate-fade-up [animation-delay:100ms] opacity-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {title}
            </h1>
          </div>
        )}

        {description && (
          <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-8 animate-fade-up [animation-delay:200ms] opacity-0">
            {description}
          </p>
        )}

        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center animate-fade-up [animation-delay:300ms] opacity-0">
            {links.map((link) => (
              <Button
                key={link.title}
                variant={stegaClean(link?.buttonVariant)}
                asChild
                size="lg"
              >
                <Link
                  href={link.href || '#'}
                  target={link.target ? '_blank' : undefined}
                  rel={link.target ? 'noopener' : undefined}
                >
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
