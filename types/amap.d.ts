/**
 * 高德地图 TypeScript 类型定义
 */

declare namespace AMap {
  class Map {
    constructor(container: string | HTMLElement, opts?: MapOptions)
    setZoom(level: number): void
    setCenter(position: LngLat | [number, number]): void
    getZoom(): number
    getCenter(): LngLat
    add(overlays: any | any[]): void
    remove(overlays: any | any[]): void
    clearMap(): void
    destroy(): void
    setFitView(overlays?: any[]): void
    plugin(name: string | string[], callback: () => void): void
  }

  interface MapOptions {
    zoom?: number
    center?: LngLat | [number, number]
    viewMode?: '2D' | '3D'
    features?: string[]
    resizeEnable?: boolean
    mapStyle?: string
  }

  class LngLat {
    constructor(lng: number, lat: number)
    getLng(): number
    getLat(): number
  }

  class Marker {
    constructor(opts?: MarkerOptions)
    setMap(map: Map | null): void
    setPosition(position: LngLat | [number, number]): void
    getPosition(): LngLat
    setTitle(title: string): void
    setLabel(label: { content: string; offset?: [number, number] }): void
    on(event: string, callback: (e: any) => void): void
    off(event: string, callback: (e: any) => void): void
  }

  interface MarkerOptions {
    map?: Map
    position?: LngLat | [number, number]
    icon?: string | Icon
    title?: string
    label?: {
      content: string
      offset?: [number, number]
    }
    offset?: [number, number]
    anchor?: string
  }

  class Icon {
    constructor(opts?: IconOptions)
  }

  interface IconOptions {
    size?: [number, number]
    image?: string
    imageSize?: [number, number]
    imageOffset?: [number, number]
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions)
    setContent(content: string | HTMLElement): void
    open(map: Map, position: LngLat | [number, number]): void
    close(): void
  }

  interface InfoWindowOptions {
    content?: string | HTMLElement
    offset?: [number, number]
    position?: LngLat | [number, number]
  }

  class Driving {
    constructor(opts?: DrivingOptions)
    search(
      origin: LngLat | [number, number],
      destination: LngLat | [number, number],
      callback?: (status: string, result: DrivingResult) => void
    ): void
    searchOnAMAP(obj: {
      origin: LngLat | [number, number]
      destination: LngLat | [number, number]
    }): void
    clear(): void
  }

  interface DrivingOptions {
    map?: Map
    panel?: string | HTMLElement
    policy?: number
  }

  interface DrivingResult {
    routes: Route[]
    start: LngLat
    end: LngLat
  }

  interface Route {
    distance: number
    time: number
    policy: string
    steps: Step[]
  }

  interface Step {
    instruction: string
    distance: number
    time: number
  }

  class Geocoder {
    constructor(opts?: GeocoderOptions)
    getLocation(
      address: string,
      callback: (status: string, result: GeocodeResult) => void
    ): void
    getAddress(
      location: LngLat | [number, number],
      callback: (status: string, result: RegeocodeResult) => void
    ): void
  }

  interface GeocoderOptions {
    city?: string
    radius?: number
  }

  interface GeocodeResult {
    geocodes: Geocode[]
  }

  interface Geocode {
    location: LngLat
    formattedAddress: string
    addressComponent: {
      province: string
      city: string
      district: string
      street: string
      streetNumber: string
    }
  }

  interface RegeocodeResult {
    regeocode: {
      formattedAddress: string
      addressComponent: {
        province: string
        city: string
        district: string
        street: string
        streetNumber: string
      }
    }
  }

  class PlaceSearch {
    constructor(opts?: PlaceSearchOptions)
    search(
      keyword: string,
      callback: (status: string, result: PlaceSearchResult) => void
    ): void
    searchNearBy(
      keyword: string,
      center: LngLat | [number, number],
      radius: number,
      callback: (status: string, result: PlaceSearchResult) => void
    ): void
    clear(): void
  }

  interface PlaceSearchOptions {
    city?: string
    pageSize?: number
    pageIndex?: number
    map?: Map
    panel?: string | HTMLElement
  }

  interface PlaceSearchResult {
    poiList: {
      pois: POI[]
    }
  }

  interface POI {
    id: string
    name: string
    type: string
    location: LngLat
    address: string
    tel: string
    distance: number
  }

  function plugin(
    name: string | string[],
    callback: () => void
  ): void

  const version: string
}

interface Window {
  AMap?: typeof AMap
  _AMapSecurityConfig?: {
    securityJsCode?: string
  }
}

