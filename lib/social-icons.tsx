import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import {
  SiX,
  SiTiktok,
  SiDiscord,
  SiTwitch,
  SiDribbble,
  SiBehance,
  SiMedium,
  SiDevdotto,
  SiStackoverflow,
} from 'react-icons/si';

type SocialPlatform =
  | 'github'
  | 'x'
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'discord'
  | 'twitch'
  | 'dribbble'
  | 'behance'
  | 'medium'
  | 'devto'
  | 'stackoverflow';

export const getSocialIcon = (
  platform: string
): React.ComponentType<{ className?: string }> => {
  const iconMap: Record<
    SocialPlatform,
    React.ComponentType<{ className?: string }>
  > = {
    github: Github,
    x: SiX,
    linkedin: Linkedin,
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    tiktok: SiTiktok,
    discord: SiDiscord,
    twitch: SiTwitch,
    dribbble: SiDribbble,
    behance: SiBehance,
    medium: SiMedium,
    devto: SiDevdotto,
    stackoverflow: SiStackoverflow,
  };

  return iconMap[platform as SocialPlatform] || Github;
};
