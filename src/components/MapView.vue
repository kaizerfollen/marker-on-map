<template>
  <div id="map" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { usePointsStore } from '@/stores/pointsStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'MapView',
  setup() {
    const pointsStore = usePointsStore();
    const map = ref<L.Map | null>(null);
    const markers: { [key: number]: L.Marker } = {};

    onMounted(() => {
      map.value = L.map('map').setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map.value);

      if (pointsStore.points.length > 0) {
        const firstPoint = pointsStore.points[0];
        pointsStore.setActivePoint(firstPoint.id);
        pointsStore.selectPoint(firstPoint.id);
      }
    });

    watch(() => pointsStore.selectedPoints, () => {
      updateMarkers();
    });

    watch(() => pointsStore.activePoint, () => {
      updateActiveMarker();
    });

    const updateMarkers = () => {
      if (map.value) {
        Object.keys(markers).forEach((id) => {
          if (!pointsStore.selectedPoints.includes(Number(id))) {
            map.value?.removeLayer(markers[Number(id)]);
            delete markers[Number(id)];
          }
        });

        pointsStore.selectedPoints.forEach((id: number) => {
          if (!markers[id]) {
            const point = pointsStore.findPoint(id);
            if (point) {
              const marker = L.marker([point.lat, point.lng]).bindPopup(point.name);
              markers[id] = marker;
              console.log(marker, 'marker');
              marker.addTo(map.value);
            }
          }
        });
      }
    };

    const updateActiveMarker = () => {
      if (map.value && pointsStore.activePoint !== null) {
        const activePoint = pointsStore.findPoint(pointsStore.activePoint);
        console.log(activePoint, 'activePoint');
        if (activePoint) {
          const { lat, lng, name } = activePoint;
          let marker = markers[pointsStore.activePoint];
          if (!marker) {
            marker = L.marker([lat, lng]).bindPopup(name);
            console.log(marker, 'marker');
            marker.on('click', (event: L.LeafletMouseEvent) => {

            console.log(`Marker clicked`, activePoint.id);
          });
            markers[pointsStore.activePoint] = marker;
          } else {
            marker.setLatLng([lat, lng]).bindPopup(name);
          }
          if (!map.value.hasLayer(marker)) {
            marker.addTo(map.value);
          }
          if (pointsStore.activePoint === pointsStore.points[0].id) {
            marker.openPopup();
          }
        }
      }
    };

    const toggleSelect = (id: number) => {
      pointsStore.selectedPoints = [];

      pointsStore.setActivePoint(id);
      pointsStore.selectPoint(id);
    };

    return {
      pointsStore,
      toggleSelect
    };
  },
});
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
</style>
