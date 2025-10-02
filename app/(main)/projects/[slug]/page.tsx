import Blocks from '@/components/blocks';
import ProjectHero from '@/components/blocks/project-hero';
import {
  fetchSanityProjectBySlug,
  fetchSanityProjectsStaticParams,
} from '@/sanity/lib/fetch';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/sanity/lib/metadata';

export async function generateStaticParams() {
  const projects = await fetchSanityProjectsStaticParams();

  return projects.map((project) => ({
    slug: project.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const project = await fetchSanityProjectBySlug({ slug: params.slug });

  if (!project) {
    notFound();
  }

  return generatePageMetadata({
    page: project,
    slug: `projects/${params.slug}`,
  });
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const project = await fetchSanityProjectBySlug({ slug: params.slug });

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectHero
        title={project.title}
        excerpt={project.excerpt}
        image={project.image}
        categories={project.categories}
      />
      <Blocks blocks={project?.blocks ?? []} />
    </>
  );
}
