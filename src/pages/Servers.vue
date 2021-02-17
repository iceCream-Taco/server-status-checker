<template>
  <q-page padding style="overflow: hidden">
    <transition-group
      appear
      name="server-list"
      tag="div"
      class="row q-ma-none q-pa-none"
      @before-leave="beforeLeave"
    >
      <ServerCard v-for="server in servers" :key="server.id" :server="server" v-on:delete="removeServer" v-on:refresh="refresh" v-on:changed="changed" class="server-list-item" />
    </transition-group>

    <q-page-sticky position="bottom-right" :offset="[32, 32]">
      <q-btn fab icon="add" color="accent" @click="getName = true" />
    </q-page-sticky>

    <q-dialog v-model="getName" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Enter server name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense clearable v-model="newName" autofocus @keyup.enter="getIP = true" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Next" @click="getIP = true" />

          <q-dialog v-model="getIP" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Enter IP address</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input dense clearable v-model="newIP" autofocus @keyup.enter="addServer" v-close-popup="2" />
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Back" v-close-popup />
                <q-btn flat label="Finish" @click="addServer" v-close-popup="2" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-left" :offset="[32, 32]">
      <q-btn fab icon="settings" color="grey" @click="setRefresh = true" />
    </q-page-sticky>

    <q-dialog v-model="setRefresh" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Enter refresh rate</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input type="number" clearable :rules="[value => value >= 30 || 'Value must be at least 30']" dense v-model="refreshTime" autofocus @keyup.enter="updateRefresh" v-close-popup />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Back" v-close-popup />
          <q-btn flat label="Finish" @click="updateRefresh" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import ServerCard from 'components/ServerCard'

const toStore = function (server) {
  return {
    name: server.name,
    ip: server.ip
  }
}

export default {
  name: 'Servers',
  components: { ServerCard },
  data: function () {
    return {
      newName: '',
      newIP: '',
      getName: false,
      getIP: false,
      setRefresh: false,
      timer: null,
      count: 0,
      refreshTime: 60,
      servers: []
    }
  },
  methods: {
    addServer: function () {
      const server = {
        id: this.count++,
        name: this.newName,
        ip: this.newIP,
        loading: false,
        online: 2
      }

      this.$q.localStorage.set(server.id.toString(), toStore(server))
      this.$q.localStorage.set('count', this.count)
      this.servers.push(server)
      this.refresh(server)
    },
    updateRefresh: function () {
      this.$q.localStorage.set('refresh', this.refreshTime)
    },
    removeServer: function (id) {
      this.servers.splice(this.servers.findIndex((elem) => elem.id === id), 1)
      this.$q.localStorage.remove(id.toString())
    },
    changed: function (id) {
      const server = this.servers.find((elem) => elem.id === id)
      this.$q.localStorage.set(id.toString(), toStore(server))
      this.refresh(server)
    },
    beforeLeave: function (el) {
      // code from a stack overflow to fix an animation problem
      const { marginLeft, marginTop, width, height } = window.getComputedStyle(el)
      el.style.left = `${el.offsetLeft - parseFloat(marginLeft, 10)}px`
      el.style.top = `${el.offsetTop - parseFloat(marginTop, 10)}px`
      el.style.width = width
      el.style.height = height
    },
    refresh: function (server) {
      server.loading = true

      this.$axios.get(server.ip)
        .then(resp => {
          const data = resp.data
          server.online = Number(data.online)
        })
        .catch(err => {
          server.online = 2
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'Loading failed',
            icon: 'report_problem',
            progress: true,
            timeout: 1000
          })
          console.log(err)
        })
        .finally(() => {
          server.loading = false
        })
    },
    refreshAll: function () {
      this.servers.forEach((server) => {
        this.refresh(server)
      })
    }
  },
  beforeMount () {
    this.count = this.$q.localStorage.getItem('count')
    this.timer = setInterval(this.refreshAll, this.refreshTime * 1000)
    this.refreshTime = this.$q.localStorage.getItem('refresh')

    if (this.refreshTime < 1) this.refreshTime = 60

    const keys = this.$q.localStorage.getAllKeys()
    let server
    keys.forEach((key) => {
      if (key === 'count' || key === 'refresh') return
      server = this.$q.localStorage.getItem(key)
      this.servers.push({
        id: Number.parseInt(key),
        name: server.name,
        ip: server.ip,
        loading: false,
        online: 2
      })
    })
  },
  mounted () {
    this.refreshAll()
  }
}
</script>

<style lang="scss" scoped>
  .server-list-leave-active {
    position: absolute;
  }
  .server-list-enter, .server-list-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  .server-list-item {
    transition: all 0.8s ease;
    display: inline-block;
  }
</style>
