import SectionContainer from '@/components/ui/section-container';
import ProjectCard from '@/components/ui/project-card';
import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import { PAGE_QUERYResult } from '@/sanity.types';
import { Button } from '@/components/ui/button';

type FeaturedProjectsProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'featured-projects' }
>;

export default function FeaturedProjects({
  padding,
  colorVariant,
  title,
  projects,
  showViewAllButton,
  viewAllButtonText,
  viewAllButtonVariant,
}: FeaturedProjectsProps) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      {title && (
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {title}
          </h2>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
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
      {showViewAllButton && (
        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            variant={stegaClean(viewAllButtonVariant) || 'default'}
            asChild
          >
            <Link href="/projects">
              {viewAllButtonText || 'View All Projects'}
            </Link>
          </Button>
        </div>
      )}
    </SectionContainer>
  );
}
