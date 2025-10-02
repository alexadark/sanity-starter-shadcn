'use client';

import { PAGE_QUERYResult } from '@/sanity.types';
import { stegaClean } from 'next-sanity';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionContainer from '@/components/ui/section-container';
import { urlFor } from '@/sanity/lib/image';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type Timeline2 = Extract<Block, { _type: 'timeline-2' }>;
type Phase = NonNullable<Timeline2['phases']>[number];

interface TimelinePhaseProps {
  phase: Phase;
  index: number;
  isEven: boolean;
  color?: string | null;
}

function TimelinePhase({ phase, index, isEven, color }: TimelinePhaseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
    >
      {/* Center dot marker - hidden on mobile */}
      <motion.div
        className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-4 border-background z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isInView && {
            scale: 1,
            opacity: 1,
          }
        }
        transition={{
          duration: 0.5,
          ease: 'easeOut',
          delay: 0.2,
        }}
      />

      {/* Image */}
      <motion.div
        className={cn('relative', isEven ? 'lg:order-2 lg:pl-12' : 'lg:pr-12')}
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        animate={
          isInView && {
            opacity: 1,
            x: 0,
          }
        }
        transition={{
          duration: 0.8,
          ease: [0.21, 0.45, 0.27, 0.9],
          delay: 0.3,
        }}
      >
        {phase.image && phase.image.asset?._id ? (
          <div className="relative aspect-[16/10] bg-muted rounded-lg overflow-hidden">
            <Image
              src={urlFor(phase.image).url()}
              alt={phase.image.alt || phase.title || ''}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder={
                phase.image?.asset?.metadata?.lqip ? 'blur' : undefined
              }
              blurDataURL={phase.image?.asset?.metadata?.lqip || ''}
              quality={100}
            />
          </div>
        ) : (
          <div className="relative aspect-[16/10] bg-muted rounded-lg flex items-center justify-center">
            <span className="text-6xl text-muted-foreground">
              {phase.phaseNumber || index + 1}
            </span>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        className={cn(
          isEven
            ? 'lg:order-1 lg:pr-12 lg:text-right'
            : 'lg:pl-12 lg:text-left',
          color === 'primary' ? 'text-background' : undefined
        )}
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        animate={
          isInView && {
            opacity: 1,
            x: 0,
          }
        }
        transition={{
          duration: 0.8,
          ease: [0.21, 0.45, 0.27, 0.9],
          delay: 0.4,
        }}
      >
        <div className="space-y-4">
          {/* Phase Number and Title */}
          {(phase.phaseNumber || phase.title) && (
            <div className="space-y-2">
              {phase.phaseNumber && (
                <div
                  className={cn(
                    'flex items-center gap-2',
                    isEven && 'lg:justify-end'
                  )}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-foreground" />
                  <span className="text-base font-bold tracking-wide">
                    {phase.phaseNumber}
                  </span>
                </div>
              )}
              {phase.title && (
                <h3 className="text-2xl md:text-3xl font-bold">
                  {phase.title}
                </h3>
              )}
            </div>
          )}

          {/* Subtitle */}
          {phase.subtitle && (
            <h4 className="text-xl font-semibold">{phase.subtitle}</h4>
          )}

          {/* Description */}
          {phase.description && (
            <p className="text-muted-foreground leading-relaxed">
              {phase.description}
            </p>
          )}

          {/* Links */}
          {phase.links && phase.links.length > 0 && (
            <div
              className={cn(
                'flex flex-wrap gap-3 pt-2',
                isEven && 'lg:justify-end'
              )}
            >
              {phase.links.map(
                (link, linkIndex) =>
                  link?.href && (
                    <Button
                      key={linkIndex}
                      variant={stegaClean(link?.buttonVariant)}
                      asChild
                    >
                      <Link
                        href={link.href}
                        target={link.target ? '_blank' : undefined}
                      >
                        {link.title}
                      </Link>
                    </Button>
                  )
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Timeline2({
  padding,
  colorVariant,
  tagLine,
  title,
  description,
  headerLinks,
  phases,
}: Timeline2) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      {/* Header Section */}
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
        {description && <p className="mb-6">{description}</p>}

        {/* Header Links */}
        {headerLinks && headerLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            {headerLinks.map(
              (link, index) =>
                link?.href && (
                  <Button
                    key={index}
                    variant={stegaClean(link?.buttonVariant)}
                    asChild
                  >
                    <Link
                      href={link.href}
                      target={link.target ? '_blank' : undefined}
                    >
                      {link.title}
                    </Link>
                  </Button>
                )
            )}
          </div>
        )}
      </div>

      {/* Phases Section - Timeline with Center Line */}
      {phases && phases.length > 0 && (
        <div className="relative">
          {/* Center vertical line - hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {phases.map((phase, index) => {
              const isEven = index % 2 === 1;
              return (
                <TimelinePhase
                  key={phase._key}
                  phase={phase}
                  index={index}
                  isEven={isEven}
                  color={color}
                />
              );
            })}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
