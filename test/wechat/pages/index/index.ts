Page({
  data: {
    layout: {
      width: 686,
      height: 360,
      background: 'radial-gradient(circle at 20% 20%, #1e1a21, #080809 80%)',
      backgroundType: 'color',
      elements: [
        {
          id: 'company',
          type: 'text',
          x: 40,
          y: 32,
          width: 360,
          height: 32,
          binding: 'user.company',
          style: {
            fontSize: 18,
            color: '#E2B96F',
            letterSpacing: 1,
            fontWeight: 500
          }
        },
        {
          id: 'name',
          type: 'text',
          x: 40,
          y: 86,
          width: 280,
          height: 60,
          binding: 'user.name',
          style: {
            fontSize: 36,
            color: '#FFFFFF',
            fontWeight: 700
          }
        },
        {
          id: 'title',
          type: 'text',
          x: 40,
          y: 148,
          width: 220,
          height: 32,
          binding: 'user.title',
          style: {
            fontSize: 20,
            color: '#CFD5EF',
            fontWeight: 500
          }
        },
        {
          id: 'phone',
          type: 'text',
          x: 360,
          y: 96,
          width: 260,
          height: 32,
          binding: 'user.phone',
          style: {
            fontSize: 20,
            color: '#FFFFFF'
          }
        },
        {
          id: 'email',
          type: 'text',
          x: 360,
          y: 140,
          width: 260,
          height: 32,
          binding: 'user.email',
          style: {
            fontSize: 20,
            color: '#FFFFFF'
          }
        },
        {
          id: 'company-text',
          type: 'text',
          x: 360,
          y: 184,
          width: 280,
          height: 32,
          binding: 'user.company',
          style: {
            fontSize: 20,
            color: '#FFFFFF'
          }
        },
        {
          id: 'address',
          type: 'text',
          x: 360,
          y: 228,
          width: 280,
          height: 48,
          binding: 'user.address',
          style: {
            fontSize: 16,
            color: '#CFD5EF',
            lineHeight: 24
          }
        }
      ]
    },
    cardData: {
      user: {
        company: '合肥魅客网络有限公司',
        name: '名片君',
        title: '销售经理',
        phone: '189****4399',
        email: 'km@kuanmai.com',
        address: '上海市静安区天目西路企业中心第一座15F'
      }
    }
  }
})
