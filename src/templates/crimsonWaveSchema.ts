import type { CardLayoutSchema } from 'km-card-schema';

export const crimsonWaveSchema: CardLayoutSchema = {
  "id": "kuanmai-crimson-wave",
  "width": 686,
  "height": 420,
  "padding": 40,
  "fontColor": "#2b2b2b",
  "metadata": {
    "template": "crimson-wave"
  },
  "elements": [
    {
      "id": "name",
      "type": "text",
      "x": 20,
      "y": 129,
      "width": 167,
      "height": 41.6,
      "binding": "user.name",
      "style": {
        "fontSize": 32,
        "color": "#A67D27",
        "fontWeight": 700,
        "textAlign": "right"
      }
    },
    {
      "id": "phone-dot",
      "type": "icon",
      "name": "mobile ",
      "x": 290,
      "y": 100,
      "width": 16,
      "height": 16,
      "fontSize": 20,
      "color": "#A67D27",
      "style": {
        "color": "#A67D27"
      }
    },
    {
      "id": "email-dot",
      "type": "icon",
      "name": "email",
      "x": 290,
      "y": 142,
      "width": 16,
      "height": 16,
      "style": {
        "backgroundColor": "#fff",
        "borderRadius": "50%",
        "color": "#A67D27"
      },
      "color": "#A67D27"
    },
    {
      "id": "address-dot",
      "type": "icon",
      "name": "address",
      "x": 290,
      "y": 233,
      "width": 16,
      "height": 16,
      "fontSize": 20,
      "style": {
        "color": "#A67D27"
      },
      "color": "#A67D27"
    },
    {
      "id": "company-dot",
      "type": "icon",
      "name": "company",
      "x": 290,
      "y": 190,
      "width": 16,
      "height": 16,
      "fontSize": 20,
      "color": "#A67D27",
      "style": {
        "color": "#A67D27"
      }
    },
    {
      "id": "duty",
      "type": "text",
      "x": 17,
      "y": 182,
      "width": 170,
      "height": 65,
      "binding": "user.duty",
      "style": {
        "fontSize": 22,
        "color": "#858585",
        "textAlign": "right",
        "fontWeight": "normal"
      }
    },
    {
      "id": "phone",
      "type": "text",
      "x": 323,
      "y": 92,
      "width": 326,
      "height": 32,
      "binding": "user.phone",
      "style": {
        "fontSize": 22,
        "color": "#858585",
        "fontWeight": "normal"
      }
    },
    {
      "id": "email",
      "type": "text",
      "x": 325,
      "y": 134,
      "width": 308,
      "height": 32,
      "binding": "user.email",
      "style": {
        "fontSize": 22,
        "color": "#858585",
        "fontWeight": "normal"
      }
    },
    {
      "id": "company",
      "type": "text",
      "x": 323,
      "y": 182,
      "width": 328,
      "height": 32,
      "binding": "user.company",
      "style": {
        "fontSize": 22,
        "color": "#858585",
        "fontWeight": "normal"
      }
    },
    {
      "id": "address",
      "type": "text",
      "x": 322,
      "y": 226,
      "width": 340,
      "height": 61,
      "binding": "user.address",
      "style": {
        "fontSize": 22,
        "color": "#858585",
        "lineHeight": 26,
        "fontWeight": "normal"
      }
    }
  ],
  "backgroundImage": "https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_15.png"
}
