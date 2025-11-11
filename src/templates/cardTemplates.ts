import type { CardLayoutSchema } from '@km/card-schema';

export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  schema: CardLayoutSchema;
}

const cloneSchema = (schema: CardLayoutSchema): CardLayoutSchema =>
  JSON.parse(JSON.stringify(schema));

const blackGoldSchema: CardLayoutSchema = {
  id: 'kuanmai-black-gold',
  width: 686,
  height: 360,
  background: 'radial-gradient(circle at 20% 20%, #1e1a21, #080809 80%)',
  backgroundType: 'color',
  padding: 40,
  metadata: {
    template: 'black-gold',
    version: '1.0.0',
  },
  elements: [
    {
      id: 'company',
      type: 'text',
      x: 40,
      y: 32,
      width: 360,
      height: 32,
      binding: 'user.company',
      style: {
        fontSize: 18,
        color: '#E2B96F',
        letterSpacing: 1,
        fontWeight: 500,
      },
    },
    {
      id: 'name',
      type: 'text',
      x: 40,
      y: 86,
      width: 280,
      height: 60,
      binding: 'user.name',
      style: {
        fontSize: 36,
        color: '#FFFFFF',
        fontWeight: 700,
      },
    },
    {
      id: 'title',
      type: 'text',
      x: 40,
      y: 148,
      width: 220,
      height: 32,
      binding: 'user.title',
      style: {
        fontSize: 20,
        color: '#CFD5EF',
        fontWeight: 500,
      },
    },
    {
      id: 'phone-dot',
      type: 'icon',
      name: 'dot',
      x: 40,
      y: 206,
      width: 12,
      height: 12,
      style: {
        backgroundColor: '#E2B96F',
        borderRadius: '50%',
      },
    },
    {
      id: 'phone',
      type: 'text',
      x: 60,
      y: 192,
      width: 300,
      height: 32,
      binding: 'user.phone',
      style: {
        fontSize: 18,
        color: '#FFFFFF',
      },
    },
    {
      id: 'email-dot',
      type: 'icon',
      name: 'dot',
      x: 40,
      y: 244,
      width: 12,
      height: 12,
      style: {
        backgroundColor: '#E2B96F',
        borderRadius: '50%',
      },
    },
    {
      id: 'email',
      type: 'text',
      x: 60,
      y: 230,
      width: 320,
      height: 32,
      binding: 'user.email',
      style: {
        fontSize: 18,
        color: '#FFFFFF',
      },
    },
    {
      id: 'address-dot',
      type: 'icon',
      name: 'dot',
      x: 40,
      y: 282,
      width: 12,
      height: 12,
      style: {
        backgroundColor: '#E2B96F',
        borderRadius: '50%',
      },
    },
    {
      id: 'address',
      type: 'text',
      x: 60,
      y: 268,
      width: 420,
      height: 40,
      binding: 'user.address',
      style: {
        fontSize: 16,
        color: '#CFD5EF',
        lineHeight: 24,
      },
    },
    {
      id: 'avatar',
      type: 'image',
      x: 480,
      y: 80,
      width: 150,
      height: 150,
      binding: 'user.avatar',
      style: {
        borderRadius: '50%',
        border: '6px solid rgba(0, 0, 0, 0.35)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
      },
    },
  ],
};

const crimsonWaveSchema: CardLayoutSchema = {
  id: 'kuanmai-crimson-wave',
  width: 686,
  height: 360,
  background: 'linear-gradient(180deg, #fdfdfd 0%, #f7f7f7 60%, #f25340 100%)',
  backgroundType: 'image',
  padding: 40,
  metadata: {
    template: 'crimson-wave',
  },
  elements: [
    {
      id: 'name',
      type: 'text',
      x: 60,
      y: 90,
      width: 220,
      height: 48,
      binding: 'user.name',
      style: {
        fontSize: 40,
        color: '#B80017',
        fontWeight: 700,
      },
    },
    {
      id: 'title',
      type: 'text',
      x: 60,
      y: 148,
      width: 260,
      height: 32,
      binding: 'user.title',
      style: {
        fontSize: 20,
        color: '#9f9f9f',
      },
    },
    {
      id: 'phone',
      type: 'text',
      x: 360,
      y: 92,
      width: 260,
      height: 32,
      binding: 'user.phone',
      style: {
        fontSize: 20,
        color: '#666',
      },
    },
    {
      id: 'email',
      type: 'text',
      x: 360,
      y: 134,
      width: 260,
      height: 32,
      binding: 'user.email',
      style: {
        fontSize: 20,
        color: '#666',
      },
    },
    {
      id: 'company',
      type: 'text',
      x: 360,
      y: 176,
      width: 280,
      height: 32,
      binding: 'user.company',
      style: {
        fontSize: 20,
        color: '#666',
      },
    },
    {
      id: 'address',
      type: 'text',
      x: 360,
      y: 218,
      width: 280,
      height: 48,
      binding: 'user.address',
      style: {
        fontSize: 18,
        color: '#666',
        lineHeight: 26,
      },
    },
  ],
  backgroundImage:
    'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_15.png',
};

const blueCitySchema: CardLayoutSchema = {
  id: 'kuanmai-blue-city',
  width: 686,
  height: 360,
  background: 'linear-gradient(120deg, #f7f9ff 0%, #eff3ff 60%)',
  backgroundType: 'color',
  padding: 48,
  metadata: {
    template: 'blue-city',
  },
  elements: [
    {
      id: 'name',
      type: 'text',
      x: 60,
      y: 78,
      width: 280,
      height: 48,
      binding: 'user.name',
      style: {
        fontSize: 32,
        color: '#1B2B65',
        fontWeight: 700,
      },
    },
    {
      id: 'title',
      type: 'text',
      x: 60,
      y: 122,
      width: 360,
      height: 72,
      binding: 'user.title',
      style: {
        fontSize: 18,
        color: '#4f5e8a',
        lineHeight: 26,
      },
    },
    {
      id: 'blue-panel',
      type: 'image',
      x: 420,
      y: 60,
      width: 186,
      height: 240,
      style: {
        borderRadius: 24,
      },
      content:
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=60',
    },
    {
      id: 'phone',
      type: 'text',
      x: 60,
      y: 220,
      width: 260,
      height: 32,
      binding: 'user.phone',
      style: {
        fontSize: 18,
        color: '#1B2B65',
      },
    },
    {
      id: 'email',
      type: 'text',
      x: 60,
      y: 254,
      width: 360,
      height: 32,
      binding: 'user.email',
      style: {
        fontSize: 18,
        color: '#1B2B65',
      },
    },
    {
      id: 'company',
      type: 'text',
      x: 60,
      y: 288,
      width: 360,
      height: 32,
      binding: 'user.company',
      style: {
        fontSize: 18,
        color: '#1B2B65',
      },
    },
    {
      id: 'address',
      type: 'text',
      x: 60,
      y: 322,
      width: 360,
      height: 32,
      binding: 'user.address',
      style: {
        fontSize: 16,
        color: '#5f6d98',
      },
    },
  ],
};

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
];

export const getTemplateById = (id: string) =>
  builtinTemplates.find(item => item.id === id);
