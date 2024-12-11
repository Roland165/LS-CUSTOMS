import Vue from 'vue';
import Router from 'vue-router';
import Home from "@/components/Home.vue";
import CheckoutModule from '@/components/CheckoutModule';
import PurchaseModule from '@/components/PurchaseModule';
import OrdersModule from '@/components/OrdersModule';
import AddCarModule from "../components/AddCarModule.vue";
import DeleteModule from '@/components/DeleteCarModule.vue'
import AddBrandModule from '@/components/AddBrandModule'
import AdminModule from '@/components/AdminModule.vue'
import DeleteBrandModule from '@/components/DeleteBrandModule.vue'
import DeleteFeatureModule from '@/components/DeleteFeatureModule.vue'
import AddFeatureModule from '@/components/AddFeatureModule.vue'
import AuthModule from '@/components/AuthModule'
import EditCarModule from '@/components/EditCarModule.vue'
import EditBrandModule from '@/components/EditBrandModule';
import AuthDemoModule from '@/components/AuthDemoModule';
import UserInfoModule from '@/components/UserInfoModule';
Vue.use(Router);

export default new Router({
  routes: [


    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
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
    {
      path: '/add-car',
      name: 'AddCar',
      component: AddCarModule,
    },
    {
      path: '/delete-car',
      name: 'DeleteCar',
      component: DeleteModule
    },
    {
      path: '/add-brand',
      name: 'AddBrand',
      component: AddBrandModule
    },
    {
      path: '/delete-brand',
      name: 'DeleteBrand',
      component: DeleteBrandModule
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminModule,
    },
    {
      path: '/delete-feature',
      name: 'DeleteFeature',
      component: DeleteFeatureModule,
    },
    {
      path: '/add-feature',
      name: 'AddFeature',
      component: AddFeatureModule,
    },
    {
      path: '/auth',
      name: 'Auth',
      component: AuthModule
    },
    {
      path: '/edit-car/:id?',
      name: 'EditCar',
      component: EditCarModule,
      props: true
    },
    {
      path: '/edit-brand',
      name: 'EditBrand',
      component: EditBrandModule
    },
    {
      path: '/edit-brand/:id',
      name: 'EditBrandDetail',
      component: EditBrandModule,
      props: true
    },
    {
      path: '/auth-demo',
      name: 'AuthenticationDemo',
      component: AuthDemoModule
    },
    {
      path: '/user-info',
      name: 'UserInfo',
      component: UserInfoModule
    },
  ],
});

