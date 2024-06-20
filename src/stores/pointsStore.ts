// src/stores/pointsStore.ts
import { defineStore } from 'pinia';
import Point from '@/models/Point';

const generatePoints = (num: number): Point[] => {
  const points: Point[] = [];
  for (let i = 0; i < num; i++) {
    points.push(new Point(i, Math.random() * 180 - 90, Math.random() * 360 - 180, `Point ${i}`));
  }
  return points;
};

export interface PointsState {
  points: Point[];
  selectedPoints: number[];
  activePoint: number | null;
}

export const usePointsStore = defineStore('points', {
  state: (): PointsState => ({
    points: generatePoints(10000),
    selectedPoints: [],
    activePoint: null,
  }),
  getters: {
    findPoint: (state) => (id: number): Point | undefined => {
      return state.points.find(point => point.id === id);
    },
    isActivePoint: (state) => (id: number): boolean => {
      return state.activePoint === id;
    },
  },
  actions: {
    selectPoint(id: number) {
      if (!this.selectedPoints.includes(id)) {
        this.selectedPoints.push(id);
      }
    },
    deselectPoint(id: number) {
      this.selectedPoints = this.selectedPoints.filter(pointId => pointId !== id);
      if (this.activePoint === id) {
        this.activePoint = null;
      }
    },
    setActivePoint(id: number) {
      this.activePoint = id;
    },
  },
});
