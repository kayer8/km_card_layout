import type { CardLayoutSchema } from 'km-card-schema';

export const blackGoldSchema: CardLayoutSchema = {
  id: 'kuanmai-black-gold',
  container: {
    mode: 'absolute',
  },
  width: 343,
  height: 210,
  padding: 20,
  fontColor: '#ffffff',
  children: [
    {
      id: 'company',
      type: 'text',
      binding: 'user.company',
      style: {
        fontSize: 16,
        color: '#fff',
        letterSpacing: 0.5,
        fontWeight: '400',
      },
      layout: {
        mode: 'absolute',
        x: 18,
        y: 16,
        width: 180,
        height: 18.5,
      },
    },
    {
      id: 'name',
      type: 'text',
      binding: 'user.name',
      style: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 350,
      },
      layout: {
        mode: 'absolute',
        x: 18,
        y: 47.5,
        width: 140,
        height: 19.5,
      },
    },
    {
      id: 'duty',
      type: 'text',
      binding: 'user.duty',
      style: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 200,
      },
      layout: {
        mode: 'absolute',
        x: 18,
        y: 81.5,
        width: 110,
        height: 18.5,
      },
    },
    {
      id: 'mobile-dot',
      type: 'icon',
      name: 'dot',
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
      layout: {
        mode: 'absolute',
        x: 18,
        y: 137.5,
        width: 8,
        height: 8,
      },
    },
    {
      id: 'mobile',
      type: 'text',
      binding: 'user.mobile',
      style: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '400',
      },
      layout: {
        mode: 'absolute',
        x: 37,
        y: 131.5,
        width: 150,
        height: 18.5,
      },
    },
    {
      id: 'email-dot',
      type: 'icon',
      name: 'dot',
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
      layout: {
        mode: 'absolute',
        x: 18,
        y: 160.5,
        width: 8,
        height: 8,
      },
    },
    {
      id: 'email',
      type: 'text',
      binding: 'user.email',
      style: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '400',
      },
      layout: {
        mode: 'absolute',
        x: 37,
        y: 152.5,
        width: 160,
        height: 18.5,
      },
    },
    {
      id: 'address-dot',
      type: 'icon',
      name: 'dot',
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
      layout: {
        mode: 'absolute',
        x: 18,
        y: 180.5,
        width: 8,
        height: 8,
      },
    },
    {
      id: 'address',
      type: 'text',
      binding: 'user.address',
      style: {
        fontSize: 13,
        color: '#fff',
        lineHeight: 14,
        fontWeight: '400',
      },
      layout: {
        mode: 'absolute',
        x: 37,
        y: 175,
        width: 271,
        height: 18.5,
      },
    },
    {
      id: 'avatar',
      type: 'image',
      binding: 'user.avatar',
      style: {
        borderRadius: '50%',
      },
      layout: {
        mode: 'absolute',
        x: 246,
        y: 16,
        width: 80,
        height: 80,
      },
    },
  ],
};
