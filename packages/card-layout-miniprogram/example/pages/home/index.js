const layout = {
  "id": "kuanmai-left-avatar",
  "width": 686,
  "height": 420,
  "background": "radial-gradient(circle at 20% 20%, #1e1a21, #080809 80%)",
  "backgroundType": "image",
  "padding": 40,
  "fontColor": "#333333",
  "metadata": {
    "template": "black-gold",
    "version": "1.0.0"
  },
  "elements": [
    {
      "id": "company",
      "type": "text",
      "x": 280,
      "y": 145,
      "width": 360,
      "height": 37,
      "binding": "user.company",
      "style": {
        "fontSize": 26,
        "color": "#333",
        "letterSpacing": 1,
        "fontWeight": "400"
      }
    },
    {
      "id": "name",
      "type": "text",
      "x": 280,
      "y": 37,
      "width": 280,
      "height": 39,
      "binding": "user.name",
      "style": {
        "fontSize": 40,
        "color": "#333",
        "fontWeight": 700
      }
    },
    {
      "id": "title",
      "type": "text",
      "x": 280,
      "y": 98,
      "width": 220,
      "height": 37,
      "binding": "user.title",
      "style": {
        "fontSize": 26,
        "color": "#333",
        "fontWeight": 400
      }
    },
    {
      "id": "phone-dot",
      "type": "icon",
      "name": "dot",
      "x": 36,
      "y": 275,
      "width": 16,
      "height": 16,
      "style": {
        "backgroundColor": "#333",
        "borderRadius": "50%"
      }
    },
    {
      "id": "phone",
      "type": "text",
      "x": 73,
      "y": 263,
      "width": 300,
      "height": 37,
      "binding": "user.phone",
      "style": {
        "fontSize": 26,
        "color": "#333",
        "fontWeight": "400"
      }
    },
    {
      "id": "email-dot",
      "type": "icon",
      "name": "dot",
      "x": 36,
      "y": 321,
      "width": 16,
      "height": 16,
      "style": {
        "backgroundColor": "#333",
        "borderRadius": "50%"
      }
    },
    {
      "id": "email",
      "type": "text",
      "x": 77,
      "y": 308,
      "width": 320,
      "height": 37,
      "binding": "user.email",
      "style": {
        "fontSize": 26,
        "color": "#333",
        "fontWeight": "400"
      }
    },
    {
      "id": "address-dot",
      "type": "icon",
      "name": "dot",
      "x": 36,
      "y": 361,
      "width": 16,
      "height": 16,
      "style": {
        "backgroundColor": "#333",
        "borderRadius": "50%"
      }
    },
    {
      "id": "address",
      "type": "text",
      "x": 71,
      "y": 349,
      "width": 542,
      "height": 37,
      "binding": "user.address",
      "style": {
        "fontSize": 26,
        "color": "#333",
        "lineHeight": 28,
        "fontWeight": "400"
      }
    },
    {
      "id": "avatar",
      "type": "image",
      "x": 50,
      "y": 41,
      "width": 160,
      "height": 160,
      "binding": "user.avatar",
      "style": {
        "borderRadius": "50%"
      }
    }
  ],
  "backgroundImage": "https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_01.png"
}


const cardData = {
  user: {
    company: '合肥魅客网络有限公司',
    name: '名片君',
    title: '销售经理',
    phone: '189****4399',
    email: 'km@kuanmai.com',
    address: '上海市静安区天目西路企业中心第一座15F',
    avatar: 'https://picsum.photos/160/160?random=1',
  },
};

Page({
  data: {
    layout,
    cardData,
    description:
      'The demo card component ships with the starter build so you can quickly confirm the pipeline is working.',
  },
});
