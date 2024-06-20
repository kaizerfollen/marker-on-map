// src/models/Point.ts
export default class Point {
  id: number;
  lat: number;
  lng: number;
  name: string;
  isActive: boolean;

  constructor(id: number, lat: number, lng: number, name: string, isActive: boolean) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.isActive = isActive;
  }
}
