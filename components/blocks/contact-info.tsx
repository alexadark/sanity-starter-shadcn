import { cn } from '@/lib/utils';
import SectionContainer from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';
import { PAGE_QUERYResult } from '@/sanity.types';
import { Mail, Phone, MapPin } from 'lucide-react';

type ContactInfoProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
  { _type: 'contact-info' }
>;

export default function ContactInfo({
  padding,
  colorVariant,
  tagLine,
  title,
  description,
  email,
  phone,
  officeAddress,
}: ContactInfoProps) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
        {/* Left side - Heading */}
        <div
          className={cn(color === 'primary' ? 'text-background' : undefined)}
        >
          {tagLine && (
            <h1 className="leading-[0] mb-4">
              <span className="text-base font-semibold">{tagLine}</span>
            </h1>
          )}
          {title && (
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Right side - Contact Details */}
        <div className="space-y-6">
          {email && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5" />
                <h3 className="font-bold text-lg">Email</h3>
              </div>
              <p
                className={cn(
                  'ml-7',
                  color === 'primary' ? 'text-background/90' : 'text-foreground'
                )}
              >
                {email}
              </p>
            </div>
          )}

          {phone && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5" />
                <h3 className="font-bold text-lg">Phone</h3>
              </div>
              <p
                className={cn(
                  'ml-7',
                  color === 'primary' ? 'text-background/90' : 'text-foreground'
                )}
              >
                {phone}
              </p>
            </div>
          )}

          {officeAddress && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5" />
                <h3 className="font-bold text-lg">Office</h3>
              </div>
              <p
                className={cn(
                  'ml-7',
                  color === 'primary' ? 'text-background/90' : 'text-foreground'
                )}
              >
                {officeAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
