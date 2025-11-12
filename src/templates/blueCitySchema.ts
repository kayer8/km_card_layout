import type { CardLayoutSchema } from 'km-card-schema';

export const blueCitySchema: CardLayoutSchema = {
  id: 'kuanmai-blue-city',
  width: 686,
  height: 420,
  background: 'linear-gradient(120deg, #f7f9ff 0%, #eff3ff 60%)',
  backgroundType: 'color',
  padding: 48,
  fontColor: '#1B2B65',
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
