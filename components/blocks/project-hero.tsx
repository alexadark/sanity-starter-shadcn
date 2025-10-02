import { PROJECT_QUERYResult } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type ProjectHeroProps = {
  title: NonNullable<PROJECT_QUERYResult>['title'];
  excerpt: NonNullable<PROJECT_QUERYResult>['excerpt'];
  image: NonNullable<PROJECT_QUERYResult>['image'];
  categories: NonNullable<PROJECT_QUERYResult>['categories'];
};

export default function ProjectHero({
  title,
  excerpt,
  image,
  categories,
}: ProjectHeroProps) {
  const imageUrl = image ? urlFor(image)?.width(1920).height(800).url() : '';

  return (
    <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden md:min-h-[500px] lg:min-h-[600px]">
      {/* Background Image */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl xl:text-7xl">
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="mb-6 text-lg text-white/90 md:text-xl lg:text-2xl">
            {excerpt}
          </p>
        )}

        {/* Category Badges */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category, index) =>
              category?.slug?.current ? (
                <Link
                  key={category.slug.current}
                  href={`/category/${category.slug.current}`}
                  className="transition-transform hover:scale-105"
                >
                  <Badge variant="secondary" className="text-sm">
                    {category.title}
                  </Badge>
                </Link>
              ) : category?.title ? (
                <Badge key={index} variant="secondary" className="text-sm">
                  {category.title}
                </Badge>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
