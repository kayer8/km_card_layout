import type { CardLayoutSchema } from 'km-card-schema';

export const blueCitySchema: CardLayoutSchema = {
  id: 'kuanmai-blue-city',
  container: {
    mode: 'absolute',
  },
  width: 343,
  height: 210,
  padding: 24,
  fontColor: '#1B2B65',
  children: [
    {
      id: 'name',
      type: 'text',
      binding: 'user.name',
      style: {
        fontSize: 16,
        color: '#1B2B65',
        fontWeight: 350,
      },
      layout: {
        mode: 'absolute',
        x: 30,
        y: 39,
        width: 140,
        height: 24,
      },
    },
    {
      id: 'duty',
      type: 'text',
      binding: 'user.duty',
      style: {
        fontSize: 9,
        color: '#4f5e8a',
        lineHeight: 13,
      },
      layout: {
        mode: 'absolute',
        x: 30,
        y: 61,
        width: 180,
        height: 36,
      },
    },
    {
      id: 'blue-panel',
      type: 'image',
      binding: 'user.avatar',
      style: {
        borderRadius: 12,
      },
      layout: {
        mode: 'absolute',
        x: 210,
        y: 30,
        width: 93,
        height: 120,
      },
    },
    {
      id: 'mobile',
      type: 'text',
      binding: 'user.mobile',
      style: {
        fontSize: 9,
        color: '#1B2B65',
      },
      layout: {
        mode: 'absolute',
        x: 30,
        y: 110,
        width: 130,
        height: 16,
      },
    },
    {
      id: 'email',
      type: 'text',
      binding: 'user.email',
      style: {
        fontSize: 9,
        color: '#1B2B65',
      },
      layout: {
        mode: 'absolute',
        x: 30,
        y: 127,
        width: 180,
        height: 16,
      },
    },
    {
      id: 'company',
      type: 'text',
      binding: 'user.company',
      style: {
        fontSize: 9,
        color: '#1B2B65',
      },
      layout: {
        mode: 'absolute',
        x: 30,
        y: 144,
        width: 180,
        height: 16,
      },
    },
    {
      id: 'address',
      type: 'text',
      binding: 'user.address',
      style: {
        fontSize: 8,
        color: '#5f6d98',
      },
      layout: {
        mode: 'absolute',
        x: 30,
        y: 161,
        width: 180,
        height: 16,
      },
    },
  ],
};
