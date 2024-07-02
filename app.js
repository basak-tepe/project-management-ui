const routes = [
    {path: '/home', component: home},
    {path: '/projects', component: projects},
    {path: '/repositories', component: repositories},
    {path: '/trackers', component: trackers},
]

const router = new VueRouter({routes})

const app = new Vue({
    router
}).$mount('#app')