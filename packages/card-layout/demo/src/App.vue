<template>
  <div style="width:calc(100vw - 40px);padding:20px">
    <CardLayout :layout="layout"  :data="cardData"  />
  </div>
</template>

<script setup lang="ts">
import CardLayout from '@km/card-layout';

const layout = {
  id: 'kuanmai-black-gold',
  width: 686,
  height: 420,
  background: 'radial-gradient(circle at 20% 20%, #1e1a21, #080809 80%)',
  backgroundType: 'color',
  padding: 40,
  metadata: {
    template: 'black-gold',
    version: '1.0.0',
  },
  elements: [
    {
      id: 'company',
      type: 'text',
      x: 36,
      y: 32,
      width: 360,
      height: 37,
      binding: 'user.company',
      style: {
        fontSize: 32,
        color: '#fff',
        letterSpacing: 1,
        fontWeight: '400',
      },
    },
    {
      id: 'name',
      type: 'text',
      x: 34,
      y: 106,
      width: 280,
      height: 20,
      binding: 'user.name',
      style: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 700,
      },
    },
    {
      id: 'title',
      type: 'text',
      x: 35,
      y: 163,
      width: 220,
      height: 37,
      binding: 'user.title',
      style: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 400,
      },
    },
    {
      id: 'phone-dot',
      type: 'icon',
      name: 'dot',
      x: 36,
      y: 275,
      width: 16,
      height: 16,
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
    },
    {
      id: 'phone',
      type: 'text',
      x: 74,
      y: 263,
      width: 300,
      height: 37,
      binding: 'user.phone',
      style: {
        fontSize: 26,
        color: '#fff',
        fontWeight: '400',
      },
    },
    {
      id: 'email-dot',
      type: 'icon',
      name: 'dot',
      x: 36,
      y: 321,
      width: 16,
      height: 16,
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
    },
    {
      id: 'email',
      type: 'text',
      x: 77,
      y: 306,
      width: 320,
      height: 37,
      binding: 'user.email',
      style: {
        fontSize: 26,
        color: '#fff',
        fontWeight: '400',
      },
    },
    {
      id: 'address-dot',
      type: 'icon',
      name: 'dot',
      x: 36,
      y: 361,
      width: 16,
      height: 16,
      style: {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
    },
    {
      id: 'address',
      type: 'text',
      x: 75,
      y: 350,
      width: 542,
      height: 37,
      binding: 'user.address',
      style: {
        fontSize: 26,
        color: '#fff',
        lineHeight: 28,
        fontWeight: '400',
      },
    },
    {
      id: 'avatar',
      type: 'image',
      x: 492,
      y: 32,
      width: 160,
      height: 160,
      binding: 'user.avatar',
      style: {
        borderRadius: '50%',
        border: '6px solid rgba(0, 0, 0, 0.35)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
      },
    },
  ],
};

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
</script>
