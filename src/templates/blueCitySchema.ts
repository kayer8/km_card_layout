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
      layout: {
        mode: 'absolute',
        x: 30,
        y: 39,
        width: 140,
        height: 24,
      },
      style: {
        fontSize: 16,
        color: '#1B2B65',
        fontWeight: 350,
      },
    },

    {
      id: 'duty',
      type: 'text',
      binding: 'user.duty',
      layout: {
        mode: 'absolute',
        x: 30,
        y: 61,
        width: 180,
        height: 36,
      },
      style: {
        fontSize: 9,
        color: '#4f5e8a',
        lineHeight: 13,
      },
    },

    {
      id: 'blue-panel',
      type: 'image',
      binding: 'user.avatar',
      layout: {
        mode: 'absolute',
        x: 210,
        y: 30,
        width: 93,
        height: 120,
      },
      style: {
        borderRadius: 12,
      },
    },

    {
      id: 'phone',
      type: 'text',
      binding: 'user.phone',
      layout: {
        mode: 'absolute',
        x: 30,
        y: 110,
        width: 130,
        height: 16,
      },
      style: {
        fontSize: 9,
        color: '#1B2B65',
      },
    },

    {
      id: 'email',
      type: 'text',
      binding: 'user.email',
      layout: {
        mode: 'absolute',
        x: 30,
        y: 127,
        width: 180,
        height: 16,
      },
      style: {
        fontSize: 9,
        color: '#1B2B65',
      },
    },

    {
      id: 'company',
      type: 'text',
      binding: 'user.company',
      layout: {
        mode: 'absolute',
        x: 30,
        y: 144,
        width: 180,
        height: 16,
      },
      style: {
        fontSize: 9,
        color: '#1B2B65',
      },
    },

    {
      id: 'address',
      type: 'text',
      binding: 'user.address',
      layout: {
        mode: 'absolute',
        x: 30,
        y: 161,
        width: 180,
        height: 16,
      },
      style: {
        fontSize: 8,
        color: '#5f6d98',
      },
    },
  ],
};
export const blueCitySchemaBackgroundOptions = [
  {
    id: 'bg-1',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_01.png',
    mainFontColor: '#333333',
    fontColors: [],
  },
  {
    id: 'bg-2',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_08.png',
    mainFontColor: '#ffffff',
    fontColors: [],
  },
  {
    id: 'bg-3',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_09.png',
    mainFontColor: '#ffffff',
    fontColors: [],
  },
  {
    id: 'bg-4',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_02.png',
    mainFontColor: '#333333',
    fontColors: [],
  },
  {
    id: 'bg-5',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_05.png',
    mainFontColor: '#333333',
    fontColors: [],
  },
  {
    id: 'bg-6',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_03.png',
    mainFontColor: '#333333',
    fontColors: [],
  },
  {
    id: 'bg-7',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_04.png',
    mainFontColor: '#ffffff',
    fontColors: [],
  },
  {
    id: 'bg-8',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_06.png',
    mainFontColor: '#ffffff',
    fontColors: [],
  },
  {
    id: 'bg-9',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_07.png',
    mainFontColor: '#ffffff',
    fontColors: [],
  },
  {
    id: 'bg-10',
    image: 'https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_17.png',
    mainFontColor: '#333333',
    fontColors: [],
  },
];
