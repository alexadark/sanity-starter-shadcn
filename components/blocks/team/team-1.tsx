import { PAGE_QUERYResult } from '@/sanity.types';
import { stegaClean } from 'next-sanity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SectionContainer from '@/components/ui/section-container';
import { urlFor } from '@/sanity/lib/image';
import { getSocialIcon } from '@/lib/social-icons';

type Block = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number];
type Team1 = Extract<Block, { _type: 'team-1' }>;

export default function Team1({
  padding,
  colorVariant,
  heading,
  description,
  members,
}: Team1) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight lg:text-5xl">
            {heading}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members &&
            members.length > 0 &&
            members.map((member) => (
              <div key={member._key} className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <Avatar className="size-20 lg:size-24">
                      {member.avatar && member.avatar.asset?._id && (
                        <AvatarImage
                          src={urlFor(member.avatar).url()}
                          alt={member.avatar.alt || member.name || ''}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="text-lg font-semibold">
                        {member.name}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="mb-6">
                    <h3 className="mb-1 text-lg font-semibold">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-primary text-sm font-medium">
                        {member.role}
                      </p>
                    )}
                  </div>

                  {member.socialLinks && member.socialLinks.length > 0 && (
                    <div className="flex gap-3">
                      {member.socialLinks.map((link) => {
                        if (!link?.platform || !link?.url) return null;
                        const platform = stegaClean(link.platform);
                        const Icon = getSocialIcon(platform);
                        return (
                          <a
                            key={link._key}
                            href={link.url}
                            className="bg-muted/50 rounded-lg p-2 hover:bg-muted transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={platform}
                          >
                            <Icon className="text-muted-foreground size-4" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </SectionContainer>
  );
}
