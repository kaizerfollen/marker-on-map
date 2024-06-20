<!-- src/App.vue -->
<template>
  <div class="container">
    <div class="splitter">
      <div class="splitter-pane">
        <PointList />
      </div>
      <div class="splitter-pane">
        <MapView />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PointList from './components/PointList.vue';
import MapView from './components/MapView.vue';

export default defineComponent({
  name: 'App',
  components: {
    PointList,
    MapView,
  },
});
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.splitter {
  display: flex;
  width: 100%;
}

.splitter-pane {
  flex: 1;
  overflow: hidden;
}

.splitter-pane:first-child {
  max-width: 300px;
}
</style>
