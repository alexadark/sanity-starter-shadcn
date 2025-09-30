'use client';

import { useState } from 'react';
import Image from 'next/image';
import { stegaClean } from 'next-sanity';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import SectionContainer from '@/components/ui/section-container';
import { urlFor } from '@/sanity/lib/image';
import { PAGE_QUERYResult } from '@/sanity.types';
import { cn } from '@/lib/utils';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type GalleryLightbox = Extract<Block, { _type: 'gallery-lightbox' }>;
type GalleryImage = NonNullable<NonNullable<GalleryLightbox['images']>>[number];

interface GalleryLightboxProps
  extends Omit<NonNullable<GalleryLightbox>, '_type' | '_key'> {}

export default function GalleryLightbox({
  padding,
  colorVariant,
  tagLine,
  title,
  description,
  columns,
  spacing,
  images,
}: GalleryLightboxProps) {
  const color = stegaClean(colorVariant);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Transform images for lightbox
  const lightboxSlides =
    images?.map((image) => ({
      src: image.asset?._id ? urlFor(image).url() : '',
      alt: image.alt || '',
      title: image.caption || '',
    })) || [];

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <SectionContainer color={color} padding={padding}>
        <div className="mb-8 md:mb-12 lg:mb-16 max-w-[48rem] text-center mx-auto">
          <div
            className={cn(color === 'primary' ? 'text-background' : undefined)}
          >
            {tagLine && (
              <h1 className="leading-[0] mb-4">
                <span className="text-base font-semibold">{tagLine}</span>
              </h1>
            )}
            {title && <h2 className="text-3xl md:text-5xl mb-4">{title}</h2>}
          </div>
          {description && <p>{description}</p>}
        </div>

        {images && images.length > 0 && (
          <div
            className={cn(
              'grid',
              stegaClean(columns) || 'grid-cols-3',
              stegaClean(spacing) || 'gap-4',
              'grid-cols-1 md:grid-cols-2',
              stegaClean(columns) === 'grid-cols-2' && 'lg:grid-cols-2',
              stegaClean(columns) === 'grid-cols-3' && 'lg:grid-cols-3',
              stegaClean(columns) === 'grid-cols-4' && 'lg:grid-cols-4'
            )}
          >
            {images.map((image, index) => {
              if (!image.asset?._id) return null;

              return (
                <div
                  key={image._key || index}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={urlFor(image).url()}
                    alt={image.alt || ''}
                    placeholder={
                      image.asset?.metadata?.lqip ? 'blur' : undefined
                    }
                    blurDataURL={image.asset?.metadata?.lqip || ''}
                    fill
                    sizes={`(max-width: 768px) 100vw, (max-width: 1024px) 50vw, ${
                      stegaClean(columns) === 'grid-cols-4'
                        ? '25vw'
                        : stegaClean(columns) === 'grid-cols-3'
                          ? '33vw'
                          : '50vw'
                    }`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                </div>
              );
            })}
          </div>
        )}
      </SectionContainer>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        carousel={{ finite: true }}
        render={{
          slide: ({ slide }) => (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={slide.src}
                alt={slide.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ),
        }}
      />
    </>
  );
}
