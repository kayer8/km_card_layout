const layout = {
  "id": "kuanmai-black-gold",
  "width": 686,
  "height": 420,
  "padding": 40,
  "fontColor": "#ffffff",
  "metadata": {
    "template": "black-gold",
    "version": "1.0.0"
  },
  "elements": [
    {
      "id": "company",
      "type": "text",
      "x": 36,
      "y": 32,
      "width": 360,
      "height": 41.6,
      "binding": "user.company",
      "style": {
        "fontSize": 32,
        "color": "#ffffff",
        "letterSpacing": 1,
        "fontWeight": "400"
      }
    },
    {
      "id": "name",
      "type": "text",
      "x": 36,
      "y": 95,
      "width": 280,
      "height": 52,
      "binding": "user.name",
      "style": {
        "fontSize": 40,
        "color": "#ffffff",
        "fontWeight": 700
      }
    },
    {
      "id": "duty",
      "type": "text",
      "x": 36,
      "y": 163,
      "width": 220,
      "height": 37,
      "binding": "user.duty",
      "style": {
        "fontSize": 26,
        "color": "#ffffff",
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
        "backgroundColor": "#ffffff",
        "borderRadius": "50%",
        "color": "#ffffff"
      }
    },
    {
      "id": "phone",
      "type": "text",
      "x": 74,
      "y": 263,
      "width": 300,
      "height": 37,
      "binding": "user.phone",
      "style": {
        "fontSize": 26,
        "color": "#ffffff",
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
        "backgroundColor": "#ffffff",
        "borderRadius": "50%",
        "color": "#ffffff"
      }
    },
    {
      "id": "email",
      "type": "text",
      "x": 74,
      "y": 305,
      "width": 320,
      "height": 37,
      "binding": "user.email",
      "style": {
        "fontSize": 26,
        "color": "#ffffff",
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
        "backgroundColor": "#ffffff",
        "borderRadius": "50%",
        "color": "#ffffff"
      }
    },
    {
      "id": "address",
      "type": "text",
      "x": 74,
      "y": 350,
      "width": 542,
      "height": 37,
      "binding": "user.address",
      "style": {
        "fontSize": 26,
        "color": "#ffffff",
        "lineHeight": 28,
        "fontWeight": "400"
      }
    },
    {
      "id": "avatar",
      "type": "image",
      "x": 492,
      "y": 32,
      "width": 160,
      "height": 160,
      "binding": "user.avatar",
      "style": {
        "borderRadius": "50%",
        "color": "#ffffff"
      }
    }
  ],
  "backgroundImage": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=60"
}


const cardData = {
  user: {
    company: '合肥魅客网络有限公司',
    name: '名片君',
    duty: '销售经理',
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
