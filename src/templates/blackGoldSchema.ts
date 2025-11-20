import type { CardLayoutSchema } from 'km-card-schema';

export const blackGoldSchema: CardLayoutSchema = {
  id: 'kuanmai-black-gold',

  container: {
    mode: 'absolute',
  },

  width: 343,
  height: 210,
  fontColor: '#ffffff',
  padding: 20,

  children: [
    {
      id: 'company',
      type: 'text',
      binding: 'user.company',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 16,
        width: 180,
        height: 18.5,
      },
      style: {
        fontSize: 16,
        color: '#fff',
        letterSpacing: 0.5,
        fontWeight: 400,
      },
    },

    {
      id: 'name',
      type: 'text',
      binding: 'user.name',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 47.5,
        width: 140,
        height: 19.5,
      },
      style: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 350,
      },
    },

    {
      id: 'duty',
      type: 'text',
      binding: 'user.duty',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 81.5,
        width: 110,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 200,
      },
    },

    {
      id: 'phone-dot',
      type: 'icon',
      name: 'dot',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 137.5,
        width: 8,
        height: 8,
      },
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
    },

    {
      id: 'phone',
      type: 'text',
      binding: 'user.phone',
      layout: {
        mode: 'absolute',
        x: 37,
        y: 131.5,
        width: 150,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 400,
      },
    },

    {
      id: 'email-dot',
      type: 'icon',
      name: 'dot',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 160.5,
        width: 8,
        height: 8,
      },
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
    },

    {
      id: 'email',
      type: 'text',
      binding: 'user.email',
      layout: {
        mode: 'absolute',
        x: 37,
        y: 152.5,
        width: 160,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 400,
      },
    },

    {
      id: 'address-dot',
      type: 'icon',
      name: 'dot',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 180.5,
        width: 8,
        height: 8,
      },
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
    },

    {
      id: 'address',
      type: 'text',
      binding: 'user.address',
      layout: {
        mode: 'absolute',
        x: 37,
        y: 175,
        width: 271,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#fff',
        lineHeight: 14,
        fontWeight: 400,
      },
    },

    {
      id: 'avatar',
      type: 'image',
      binding: 'user.avatar',
      layout: {
        mode: 'absolute',
        x: 246,
        y: 16,
        width: 80,
        height: 80,
      },
      style: {
        borderRadius: '50%',
      },
    },
  ],
};

