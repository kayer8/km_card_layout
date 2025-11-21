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
        height: 20.8,
      },
      style: {
        fontSize: 16,
        color: '#ffffff',
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
        y: 45,
        width: 140,
        height: 26,
      },
      style: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
      },
    },
    {
      id: 'duty',
      type: 'text',
      binding: 'user.duty',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 81,
        width: 110,
        height: 20,
      },
      style: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: 'normal',
      },
    },
    {
      id: 'phone-dot',
      type: 'custom',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 135,
        width: 10,
        height: 10,
      },
      style: {
        backgroundColor: 'currentColor',
        borderRadius: '50%',
        color: '#ffffff',
      },
    },
    {
      id: 'phone',
      type: 'text',
      binding: 'user.phone',
      layout: {
        mode: 'absolute',
        x: 40,
        y: 131,
        width: 150,
        height: 20,
      },
      style: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: 400,
      },
    },
    {
      id: 'email-dot',
      type: 'custom',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 156,
        width: 10,
        height: 10,
      },
      style: {
        backgroundColor: 'currentColor',
        borderRadius: '50%',
        color: '#ffffff',
      },
    },
    {
      id: 'email',
      type: 'text',
      binding: 'user.email',
      layout: {
        mode: 'absolute',
        x: 40,
        y: 152,
        width: 160,
        height: 20,
      },
      style: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: 400,
      },
    },
    {
      id: 'address-dot',
      type: 'custom',
      layout: {
        mode: 'absolute',
        x: 18,
        y: 178,
        width: 10,
        height: 10,
      },
      style: {
        backgroundColor: 'currentColor',
        borderRadius: '50%',
        color: '#ffffff',
      },
    },
    {
      id: 'address',
      type: 'text',
      binding: 'user.address',
      layout: {
        mode: 'absolute',
        x: 40,
        y: 175,
        width: 271,
        height: 20,
      },
      style: {
        fontSize: 13,
        color: '#ffffff',
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
        color: '#ffffff',
      },
    },
  ],
  backgroundImage:
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=60',
};

export const blackGoldSchemaBackgroundOptions = [
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
