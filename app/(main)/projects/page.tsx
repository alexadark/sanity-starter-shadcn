import { Suspense } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { sanityFetch } from '@/sanity/lib/live';
import { PROJECTS_PAGINATED_QUERY } from '@/sanity/queries/project';
import { SETTINGS_QUERY } from '@/sanity/queries/settings';
import { PROJECTS_PAGE_QUERY } from '@/sanity/queries/projects-page';
import { urlFor } from '@/sanity/lib/image';
import ProjectCard from '@/components/ui/project-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const { data: pageData } = await sanityFetch({
    query: PROJECTS_PAGE_QUERY,
  });

  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production';

  return {
    title: pageData?.meta_title || 'Projects',
    description:
      pageData?.meta_description ||
      'Explore our portfolio of innovative solutions and successful implementations',
    openGraph: {
      images: [
        {
          url: pageData?.ogImage
            ? urlFor(pageData.ogImage).quality(100).url()
            : `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
          width: pageData?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
          height: pageData?.ogImage?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    robots: !isProduction
      ? 'noindex, nofollow'
      : pageData?.noindex
        ? 'noindex'
        : 'index, follow',
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL + '/projects',
    },
  };
}

interface ProjectsPageProps {
  searchParams: { page?: string };
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const [{ data: settings }, { data: pageData }] = await Promise.all([
    sanityFetch({
      query: SETTINGS_QUERY,
    }),
    sanityFetch({
      query: PROJECTS_PAGE_QUERY,
    }),
  ]);

  const projectsPerPage = settings?.projectsPerPage || 10;
  const currentPage = Number(searchParams.page) || 1;
  const start = (currentPage - 1) * projectsPerPage;
  const end = start + projectsPerPage;

  const { data } = await sanityFetch({
    query: PROJECTS_PAGINATED_QUERY,
    params: { start, end },
  });

  const projects = data?.projects || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / projectsPerPage);

  const heroTitle = pageData?.title || 'Our Projects';
  const heroSubtitle =
    pageData?.subtitle ||
    'Explore our portfolio of innovative solutions and successful implementations';
  const heroImage = pageData?.heroImage;

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
        {heroImage && heroImage.asset?._id ? (
          <Image
            src={urlFor(heroImage).url()}
            alt={heroImage.alt || heroTitle}
            fill
            className="object-cover"
            priority
            placeholder={heroImage?.asset?.metadata?.lqip ? 'blur' : undefined}
            blurDataURL={heroImage?.asset?.metadata?.lqip || ''}
          />
        ) : (
          <Image
            src="/images/placeholder.svg"
            alt="Projects Hero"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center text-white">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                {heroSubtitle}
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
                      <Link href={`/projects?page=${currentPage - 1}`}>
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
                              <Link href={`/projects?page=${page}`}>
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
                      <Link href={`/projects?page=${currentPage + 1}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found.</p>
            </div>
          )}
        </Suspense>
      </div>
    </>
  );
}
