'use client';

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { stegaClean } from 'next-sanity';

import { Button } from '@/components/ui/button';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import SectionContainer from '@/components/ui/section-container';
import { urlFor } from '@/sanity/lib/image';
import { PAGE_QUERYResult } from '@/sanity.types';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type CarouselGallery = Extract<Block, { _type: 'carousel-gallery' }>;
type GalleryItem = NonNullable<NonNullable<CarouselGallery['items']>>[number];

interface CarouselGalleryProps
  extends Omit<NonNullable<CarouselGallery>, '_type' | '_key'> {}

export default function CarouselGallery({
  padding,
  colorVariant,
  heading,
  demoUrl,
  items,
}: CarouselGalleryProps) {
  const color = stegaClean(colorVariant);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on('select', updateSelection);
    return () => {
      carouselApi.off('select', updateSelection);
    };
  }, [carouselApi]);

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="container">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div>
            {heading && (
              <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
                {heading}
              </h2>
            )}
            {demoUrl && (
              <a
                href={demoUrl}
                className="group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg"
              >
                Book a demo
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </div>
          <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
          className="relative w-full max-w-full md:left-[-1rem]"
        >
          <CarouselContent className="hide-scrollbar w-full max-w-full md:-mr-4 md:ml-8 2xl:ml-[max(8rem,calc(50vw-700px+1rem))] 2xl:mr-[max(0rem,calc(50vw-700px-1rem))]">
            {items &&
              items.length > 0 &&
              items.map((item) => {
                const linkHref = item.link?.href || '#';
                const linkTarget = item.link?.target ? '_blank' : undefined;

                return (
                  <CarouselItem
                    key={item._key}
                    className="ml-8 md:max-w-[452px]"
                  >
                    <Link
                      href={linkHref}
                      target={linkTarget}
                      className="group flex flex-col justify-between"
                    >
                      <div>
                        {item.image && item.image.asset?._id && (
                          <div className="aspect-3/2 flex overflow-clip rounded-xl">
                            <div className="flex-1">
                              <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                                <Image
                                  src={urlFor(item.image).url()}
                                  alt={item.image.alt || item.title || ''}
                                  placeholder={
                                    item.image?.asset?.metadata?.lqip
                                      ? 'blur'
                                      : undefined
                                  }
                                  blurDataURL={
                                    item.image?.asset?.metadata?.lqip || ''
                                  }
                                  fill
                                  sizes="(min-width: 768px) 452px, 100vw"
                                  className="h-full w-full object-cover object-center"
                                  quality={100}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {item.title && (
                        <div className="mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl">
                          {item.title}
                        </div>
                      )}
                      {item.summary && (
                        <div className="text-muted-foreground mb-8 line-clamp-2 text-sm md:mb-12 md:text-base lg:mb-9">
                          {item.summary}
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        Read more{' '}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
          </CarouselContent>
        </Carousel>
      </div>
    </SectionContainer>
  );
}
