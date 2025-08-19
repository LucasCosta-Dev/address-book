import { createRouter, createWebHistory } from 'vue-router'
import AddressList from '../views/address/AddressList.vue'
import AddressForm from '../views/address/AddressForm.vue'


const routes = [
  {
    path: '/addresses',
    children: [
      {
        path: '',
        name: 'address-list',
        component: AddressList,
      },
      {
        path: 'create',
        name: 'address-create',
        component: AddressForm,
      },
      {
        path: 'edit/:id',
        name: 'address-edit',
        component: AddressForm,
        props: true,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/addresses'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
