import type { CardLayoutSchema } from 'km-card-schema';

export const crimsonWaveSchema: CardLayoutSchema = {
  id: 'kuanmai-crimson-wave',
  width: 686,
  height: 420,
  background: 'linear-gradient(180deg, #fdfdfd 0%, #f7f7f7 60%, #f25340 100%)',
  backgroundType: 'image',
  padding: 40,
  fontColor: '#2b2b2b',
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
