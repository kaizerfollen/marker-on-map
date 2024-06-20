<template>
  <div>
    <input v-model="search" placeholder="Search points" />
    <div class="point-list" ref="pointListRef">
      <div
        v-for="item in filteredPoints"
        :key="item.id"
        :data-id="item.id"
        :class="['point-item', { 'selected': isSelected(item.id), 'active': isActivePoint(item.id) }]"
        @click="setActivePoint(item.id)"
      >
        <input
          type="checkbox"
          :checked="isSelected(item.id)"
          @change="toggleSelect(item.id)"
        />
        {{ item.name }}
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { usePointsStore } from '@/stores/pointsStore';

export default defineComponent({
  name: 'PointList',
  setup() {
    const pointsStore = usePointsStore();
    const search = ref('');
    const activePointId = ref<number | null>(null);
    const pointListRef = ref<HTMLDivElement | null>(null);

    const points = computed(() => pointsStore.points);
    const selectedPoints = computed(() => pointsStore.selectedPoints);

    const filteredPoints = computed(() => {
      if (!search.value) return points.value;
      return points.value.filter(point => point.name.toLowerCase().includes(search.value.toLowerCase()));
    });

    const toggleSelect = (id: number) => {
      if (selectedPoints.value.includes(id)) {
        pointsStore.deselectPoint(id);
      } else {
        pointsStore.selectPoint(id);
      }
    };

    const isSelected = (id: number) => {
      return selectedPoints.value.includes(id);
    };

    const setActivePoint = (id: number) => {
      activePointId.value = id;
      pointsStore.setActivePoint(id);

      if (pointListRef.value && pointListRef.value.scrollTop !== 0) {
        const selectedItem = pointListRef.value.querySelector(`.point-item[data-id="${id}"]`);
        if (selectedItem) {
          selectedItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    const isActivePoint = (id: number) => {
      return activePointId.value === id;
    };

    onMounted(() => {
      if (pointsStore.activePoint !== null) {
        setActivePoint(pointsStore.activePoint);
      }
    });

    return {
      search,
      filteredPoints,
      selectedPoints,
      toggleSelect,
      isSelected,
      setActivePoint,
      isActivePoint,
      pointListRef,
    };
  },
});
</script>

<style scoped>
.point-list {
  max-height: 100vh;
  overflow-y: auto;
}

.point-item {
  cursor: pointer;
  padding: 8px;
}

.selected {
  background-color: purple;
  color: white;
}

.active {
  background-color: green;
  color: white;
}
</style>
