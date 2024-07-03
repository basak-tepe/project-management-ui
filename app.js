const routes = [
    {path: '/home', component: home},
    {path: '/projects', component: project},
    {path: '/repositories', component: repository},
    {path: '/trackers', component: tracker},
]

const router = new VueRouter({routes});

const app = new Vue({
    router
}).$mount('#app');