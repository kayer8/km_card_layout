import type { CardLayoutSchema } from 'km-card-schema';

export const crimsonWaveSchema: CardLayoutSchema = {
  "id": "kuanmai-crimson-wave",
  "container": {
    "mode": "absolute"
  },
  "width": 343,
  "height": 210,
  "fontColor": "#2b2b2b",
  "padding": 20,
  "children": [
    {
      "id": "name",
      "type": "text",
      "binding": "user.name",
      "layout": {
        "mode": "absolute",
        "x": 10,
        "y": 64,
        "width": 83,
        "height": 20.8
      },
      "style": {
        "fontSize": 16,
        "color": "#A67D27",
        "fontWeight": 350,
        "textAlign": "right"
      }
    },
    {
      "id": "phone-dot",
      "type": "icon",
      "name": "mobile",
      "fontSize": 10,
      "color": "#A67D27",
      "layout": {
        "mode": "absolute",
        "x": 145,
        "y": 50,
        "width": 8,
        "height": 8
      },
      "style": {
        "color": "#A67D27"
      }
    },
    {
      "id": "email-dot",
      "type": "icon",
      "name": "email",
      "color": "#A67D27",
      "layout": {
        "mode": "absolute",
        "x": 145,
        "y": 71,
        "width": 8,
        "height": 8
      },
      "style": {
        "borderRadius": "50%",
        "color": "#A67D27"
      },
      "fontSize": 10
    },
    {
      "id": "address-dot",
      "type": "icon",
      "name": "address",
      "fontSize": 10,
      "color": "#A67D27",
      "layout": {
        "mode": "absolute",
        "x": 145,
        "y": 117,
        "width": 8,
        "height": 8
      },
      "style": {
        "color": "#A67D27"
      }
    },
    {
      "id": "company-dot",
      "type": "icon",
      "name": "company",
      "fontSize": 10,
      "color": "#A67D27",
      "layout": {
        "mode": "absolute",
        "x": 145,
        "y": 95,
        "width": 8,
        "height": 8
      },
      "style": {
        "color": "#A67D27"
      }
    },
    {
      "id": "duty",
      "type": "text",
      "binding": "user.duty",
      "layout": {
        "mode": "absolute",
        "x": 8,
        "y": 91,
        "width": 85,
        "height": 32
      },
      "style": {
        "fontSize": 11,
        "color": "#858585",
        "textAlign": "right",
        "fontWeight": "normal"
      }
    },
    {
      "id": "phone",
      "type": "text",
      "binding": "user.phone",
      "layout": {
        "mode": "absolute",
        "x": 161,
        "y": 46,
        "width": 163,
        "height": 16
      },
      "style": {
        "fontSize": 11,
        "color": "#858585",
        "fontWeight": "normal"
      }
    },
    {
      "id": "email",
      "type": "text",
      "binding": "user.email",
      "layout": {
        "mode": "absolute",
        "x": 162,
        "y": 67,
        "width": 154,
        "height": 16
      },
      "style": {
        "fontSize": 11,
        "color": "#858585",
        "fontWeight": "normal"
      }
    },
    {
      "id": "company",
      "type": "text",
      "binding": "user.company",
      "layout": {
        "mode": "absolute",
        "x": 161,
        "y": 91,
        "width": 164,
        "height": 16
      },
      "style": {
        "fontSize": 11,
        "color": "#858585",
        "fontWeight": "normal"
      }
    },
    {
      "id": "address",
      "type": "text",
      "binding": "user.address",
      "layout": {
        "mode": "absolute",
        "x": 161,
        "y": 113,
        "width": 170,
        "height": 30
      },
      "style": {
        "fontSize": 11,
        "color": "#858585",
        "lineHeight": 13,
        "fontWeight": "normal"
      }
    }
  ],
  "backgroundImage": "https://km-1257079185.cos.ap-chengdu.myqcloud.com/static/cardstyleV3/bg_big_15.png"
}