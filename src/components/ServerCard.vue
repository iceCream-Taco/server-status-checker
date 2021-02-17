<template>
  <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-xs">
    <q-card bordered>
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">
              {{ server.name }}
              <q-popup-edit v-model="server.name" >
                <q-input v-model="server.name" dense autofocus counter />
              </q-popup-edit>
              <q-chip dense v-show="!server.loading" :color="lookup[server.online].color" text-color="white">
                {{ lookup[server.online].text }}
              </q-chip>
            </div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" size="sm" round flat icon="refresh" @click="$emit('refresh', server)" />
            <q-btn color="grey-7" size="sm" round flat icon="close" @click="$emit('delete', server.id)" />
          </div>
        </div>
        <div class="text-subtitle2">
          {{ server.ip }}
          <q-popup-edit v-model="server.ip" @save="$emit('changed', server.id)" >
            <q-input v-model="server.ip" dense autofocus />
          </q-popup-edit>
        </div>
      </q-card-section>

      <q-inner-loading :showing="server.loading">
        <q-circular-progress
          indeterminate
          size="40px"
          :color="$q.dark.isActive ? 'white' : 'grey'"
          class="q-ma-md"
        />
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'ServerCard',
  props: [
    'server'
  ],
  data: function () {
    return {
      lookup: {
        0: {
          color: 'grey',
          text: 'Offline'
        },
        1: {
          color: 'green',
          text: 'Online'
        },
        2: {
          color: 'red',
          text: 'Error'
        }
      }
    }
  }
}
</script>
