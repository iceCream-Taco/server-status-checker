<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated>
      <q-bar v-if="$q.platform.is.win && $q.platform.is.electron" class="q-electron-drag" >
        <q-icon name="network_check" />

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="maximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>
      <q-bar v-if="$q.platform.is.mac && $q.platform.is.electron" class="q-electron-drag" >
        <q-btn dense flat round icon="lens" size="8.5px" color="red" @click="closeApp" />
        <q-btn dense flat round icon="lens" size="8.5px" color="yellow" @click="minimize" />
        <q-btn dense flat round icon="lens" size="8.5px" color="green" @click="maximize" />
        <div class="col text-center text-weight-bold">
          My-App
        </div>
      </q-bar>
      <q-toolbar>
        <q-icon name="network_check" v-if="!$q.platform.is.win && $q.platform.is.electron" />

        <q-toolbar-title>
          {{ $q.screen.gt.xs ? 'Server Status Checker' : 'Servers' }}
        </q-toolbar-title>

        <q-space />

        <q-toggle
          v-model="darkMode"
          toggle-indeterminate
          indeterminate-value="auto"
          color="accent"
          :label="toggleText"
          left-label
        />

        <q-separator vertical inset="" class="gt-xs" />

        <div class="q-px-md gt-xs">Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data: function () {
    return {
      darkMode: 'auto'
    }
  },
  computed: {
    toggleText: function () {
      this.$q.dark.set(this.darkMode)

      const isDark = (typeof this.darkMode === 'boolean' ? (this.darkMode ? 'on' : 'off') : this.darkMode.toString())

      if (this.$q.screen.gt.xs) {
        return 'Dark mode: ' + isDark
      }
      return isDark
    }
  },
  methods: {
    minimize () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
      }
    },
    maximize () {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()

        if (win.isMaximized()) {
          win.unmaximize()
        } else {
          win.maximize()
        }
      }
    },
    closeApp () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
      }
    }
  }
}
</script>
