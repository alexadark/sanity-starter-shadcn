import { Suspense } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { CATEGORY_PROJECTS_PAGINATED_QUERY } from '@/sanity/queries/category';
import { CATEGORIES_SLUGS_QUERY } from '@/sanity/queries/category';
import { SETTINGS_QUERY } from '@/sanity/queries/settings';
import { urlFor } from '@/sanity/lib/image';
import ProjectCard from '@/components/ui/project-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: CATEGORIES_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  });

  return data?.map((category) => ({
    slug: category?.slug?.current,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { data } = await sanityFetch({
    query: CATEGORY_PROJECTS_PAGINATED_QUERY,
    params: { slug: resolvedParams.slug, start: 0, end: 1 },
  });

  const category = data?.category;

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

  return {
    title: category?.meta_title || category?.title,
    description: category?.meta_description || category?.description,
    openGraph: {
      images: [
        {
          url: category?.ogImage
            ? urlFor(category.ogImage).quality(100).url()
            : `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
          width: category?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
          height: category?.ogImage?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    robots: !isProduction
      ? 'noindex, nofollow'
      : category?.noindex
        ? 'noindex'
        : 'index, follow',
    alternates: {
      canonical:
        process.env.NEXT_PUBLIC_SITE_URL + `/categories/${resolvedParams.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ data: settings }, resolvedParams, resolvedSearchParams] =
    await Promise.all([
      sanityFetch({
        query: SETTINGS_QUERY,
      }),
      params,
      searchParams,
    ]);

  const projectsPerPage = settings?.projectsPerPage || 10;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const start = (currentPage - 1) * projectsPerPage;
  const end = start + projectsPerPage;

  const { data } = await sanityFetch({
    query: CATEGORY_PROJECTS_PAGINATED_QUERY,
    params: { slug: resolvedParams.slug, start, end },
  });

  const category = data?.category;
  const projects = data?.projects || [];
  const total = data?.total || 0;
  const firstProjectImage = data?.firstProjectImage;

  if (!category) {
    notFound();
  }

  const totalPages = Math.ceil(total / projectsPerPage);

  // Use category image or fallback to first project image
  const heroImage = category?.image || firstProjectImage;

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
        {heroImage && heroImage.asset?._id ? (
          <Image
            src={urlFor(heroImage).url()}
            alt={heroImage.alt || category?.title || ''}
            fill
            className="object-cover"
            priority
            placeholder={heroImage?.asset?.metadata?.lqip ? 'blur' : undefined}
            blurDataURL={heroImage?.asset?.metadata?.lqip || ''}
          />
        ) : (
          <Image
            src="/images/placeholder.svg"
            alt={category?.title || 'Category'}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center text-white">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
              {category?.title}
            </h1>
            {category?.description && (
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container py-16 lg:py-24">
        <Suspense fallback={<div>Loading...</div>}>
          {projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {projects.map((project) => (
                  <Link
                    key={project?.slug?.current}
                    className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    href={`/projects/${project?.slug?.current}`}
                  >
                    <ProjectCard
                      title={project?.title ?? ''}
                      excerpt={project?.excerpt ?? ''}
                      image={project?.image ?? null}
                      categories={project?.categories ?? []}
                    />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  {currentPage > 1 && (
                    <Button variant="outline" size="icon" asChild>
                      <Link
                        href={`/categories/${resolvedParams.slug}?page=${currentPage - 1}`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={
                                page === currentPage ? 'default' : 'outline'
                              }
                              size="icon"
                              asChild
                            >
                              <Link
                                href={`/categories/${resolvedParams.slug}?page=${page}`}
                              >
                                {page}
                              </Link>
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 py-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }
                    )}
                  </div>

                  {currentPage < totalPages && (
                    <Button variant="outline" size="icon" asChild>
                      <Link
                        href={`/categories/${resolvedParams.slug}?page=${currentPage + 1}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No projects found in this category.
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </>
  );
}
