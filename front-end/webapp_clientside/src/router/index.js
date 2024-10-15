import Vue from 'vue';
import Router from 'vue-router';
import CheckoutModule from '@/components/CheckoutModule';
import PurchaseModule from '@/components/PurchaseModule';
import OrdersModule from '@/components/OrdersModule';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PurchaseModule',
      component: PurchaseModule,
      redirect: '/purchase/list/all',
    },
    {
      path: '/purchase',
      redirect: '/purchase/list/all',
    },
    {
      path: '/purchase/:action/:id',
      name: 'purchase',
      component: PurchaseModule,
      props: true,
    },


    {
      path: '/checkout',
      name: 'Checkout',
      component: CheckoutModule,
      props: true,
    },
    {
      path: '/checkout/all',
      name: 'CheckoutAll',
      component: CheckoutModule,
      props: true,
    },

    {
      path: '/orders',
      redirect: '/orders/list/all',
    },
    {
    path: '/orders/:action/:id',
    name: 'orders',
    component: OrdersModule,
    props: true,
    },


  ],
});

