import type { CardLayoutSchema } from 'km-card-schema';
import { blackGoldSchema } from './blackGoldSchema';
import { crimsonWaveSchema } from './crimsonWaveSchema';
import { blueCitySchema } from './blueCitySchema';
import { leftAvatar } from './left-imageSchema';

export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  schema: CardLayoutSchema;
}

const cloneSchema = (schema: CardLayoutSchema): CardLayoutSchema =>
  JSON.parse(JSON.stringify(schema));

export const builtinTemplates: CardTemplate[] = [
  {
    id: 'black-gold',
    name: '黑金',
    description: '深色科技风',
    schema: cloneSchema(blackGoldSchema),
  },
  {
    id: 'crimson-wave',
    name: '红色波纹',
    description: '红白极简',
    schema: cloneSchema(crimsonWaveSchema),
  },
  {
    id: 'blue-city',
    name: '蓝色城市',
    description: '蓝色都市',
    schema: cloneSchema(blueCitySchema),
  },
  {
    id: 'leftAvatar',
    name: 'leftAvatar',
    description: 'leftAvatar',
    schema: cloneSchema(leftAvatar),
  },
];

export const getTemplateById = (id: string) =>
  builtinTemplates.find(item => item.id === id);
