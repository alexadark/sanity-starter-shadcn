import { cn } from '@/lib/utils';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PROJECTS_QUERYResult } from '@/sanity.types';

type ProjectCard = NonNullable<PROJECTS_QUERYResult[number]>;

interface ProjectCardProps extends Omit<ProjectCard, 'slug'> {
  className?: string;
}

export default function ProjectCard({
  className,
  title,
  excerpt,
  image,
  categories,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between overflow-hidden transition ease-in-out group border rounded-3xl p-4 hover:border-primary',
        className
      )}
    >
      <div className="flex flex-col">
        {image && image.asset?._id && (
          <div className="mb-4 relative h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[9.5rem] xl:h-[12rem] rounded-2xl overflow-hidden">
            <Image
              src={urlFor(image).url()}
              alt={image.alt || ''}
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ''}
              fill
              style={{
                objectFit: 'cover',
              }}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              quality={100}
            />
          </div>
        )}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <Badge key={category?.slug?.current} variant="secondary">
                {category?.title}
              </Badge>
            ))}
          </div>
        )}
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[1.5rem] leading-[1.2]">{title}</h3>
          </div>
        )}
        {excerpt && <p>{excerpt}</p>}
      </div>
      <Button className="mt-6" size="lg" variant="default" asChild>
        <div>View project</div>
      </Button>
    </div>
  );
}
