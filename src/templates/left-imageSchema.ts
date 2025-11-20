import type { CardLayoutSchema } from 'km-card-schema';

export const leftAvatar: CardLayoutSchema = {
  id: 'kuanmai-left-avatar',

  container: {
    mode: 'absolute',
  },

  width: 343,
  height: 210,
  padding: 20,
  fontColor: '#333333',
  backgroundImage:
    'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_01.png',

  children: [
    {
      id: 'company',
      type: 'text',
      binding: 'user.company',
      layout: {
        mode: 'absolute',
        x: 140,
        y: 72.5,
        width: 180,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#333',
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
        x: 140,
        y: 18.5,
        width: 140,
        height: 19.5,
      },
      style: {
        fontSize: 20,
        color: '#333',
        fontWeight: 350,
      },
    },

    {
      id: 'duty',
      type: 'text',
      binding: 'user.duty',
      layout: {
        mode: 'absolute',
        x: 140,
        y: 49,
        width: 110,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#333',
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
        backgroundColor: '#333',
        borderRadius: '50%',
      },
    },

    {
      id: 'phone',
      type: 'text',
      binding: 'user.phone',
      layout: {
        mode: 'absolute',
        x: 36.5,
        y: 131.5,
        width: 150,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#333',
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
        backgroundColor: '#333',
        borderRadius: '50%',
      },
    },

    {
      id: 'email',
      type: 'text',
      binding: 'user.email',
      layout: {
        mode: 'absolute',
        x: 38.5,
        y: 154,
        width: 160,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#333',
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
        backgroundColor: '#333',
        borderRadius: '50%',
      },
    },

    {
      id: 'address',
      type: 'text',
      binding: 'user.address',
      layout: {
        mode: 'absolute',
        x: 35.5,
        y: 174.5,
        width: 271,
        height: 18.5,
      },
      style: {
        fontSize: 13,
        color: '#333',
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
        x: 25,
        y: 20.5,
        width: 80,
        height: 80,
      },
      style: {
        borderRadius: '50%',
      },
    },
  ],
};
