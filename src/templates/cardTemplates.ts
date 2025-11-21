import type { CardLayoutSchema } from 'km-card-schema';
import {
  blackGoldSchema,
  blackGoldSchemaBackgroundOptions,
} from './blackGoldSchema';
import {
  crimsonWaveSchema,
  crimsonWaveBackgroundOptions,
} from './crimsonWaveSchema';
import {
  blueCitySchema,
  blueCitySchemaBackgroundOptions,
} from './blueCitySchema';
import {
  leftAvatar,
  leftAvatarBackgroundOptions,
} from './left-imageSchema';

export interface TemplateBackgroundOption {
  id: string;
  image: string;
  mainFontColor?: string;
  fontColors?: string[];
}

export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  schema: CardLayoutSchema;
  backgroundOptions?: TemplateBackgroundOption[];
}

const cloneSchema = (schema: CardLayoutSchema): CardLayoutSchema =>
  JSON.parse(JSON.stringify(schema));

const cloneBackgroundOptions = (
  options: TemplateBackgroundOption[] = []
): TemplateBackgroundOption[] =>
  options.map(option => ({
    ...option,
    fontColors: [...(option.fontColors || [])],
  }));

export const builtinTemplates: CardTemplate[] = [
  {
    id: 'black-gold',
    name: '黑金',
    description: '深色科技风',
    schema: cloneSchema(blackGoldSchema),
    backgroundOptions: cloneBackgroundOptions(
      blackGoldSchemaBackgroundOptions
    ),
  },
  {
    id: 'crimson-wave',
    name: '红色波纹',
    description: '红白极简',
    schema: cloneSchema(crimsonWaveSchema),
    backgroundOptions: cloneBackgroundOptions(
      crimsonWaveBackgroundOptions
    ),
  },
  {
    id: 'blue-city',
    name: '蓝色城市',
    description: '蓝色都市',
    schema: cloneSchema(blueCitySchema),
    backgroundOptions: cloneBackgroundOptions(
      blueCitySchemaBackgroundOptions
    ),
  },
  {
    id: 'leftAvatar',
    name: 'leftAvatar',
    description: 'leftAvatar',
    schema: cloneSchema(leftAvatar),
    backgroundOptions: cloneBackgroundOptions(
      leftAvatarBackgroundOptions
    ),
  },
];

export const getTemplateById = (id: string) =>
  builtinTemplates.find(item => item.id === id);
