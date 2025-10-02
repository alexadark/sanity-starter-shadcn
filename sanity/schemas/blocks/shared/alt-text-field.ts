import { defineField } from 'sanity';
import { AltTextInput } from '@/sanity/components/AltTextInput';

export const altTextField = defineField({
  name: 'alt',
  type: 'string',
  title: 'Alternative Text',
  description: 'Click "Generate with AI" to create alt text automatically',
  components: {
    input: AltTextInput,
  },
});
