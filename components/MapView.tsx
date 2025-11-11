'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Navigation, Search, Loader2, Route as RouteIcon } from 'lucide-react'

interface Location {
  name: string
  address?: string
  lng: number
  lat: number
  type?: string
}

interface MapViewProps {
  locations?: Location[]
  center?: [number, number]
  zoom?: number
  enableSearch?: boolean
  enableNavigation?: boolean
  className?: string
}

export default function MapView({
  locations = [],
  center = [116.397428, 39.90923], // 默认北京
  zoom = 13,
  enableSearch = true,
  enableNavigation = true,
  className = '',
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<AMap.Map | null>(null)
  const markersRef = useRef<AMap.Marker[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ distance: number; time: number } | null>(null)
  const [currentPosition, setCurrentPosition] = useState<{ lng: number; lat: number } | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [navigationError, setNavigationError] = useState<string | null>(null)

  // 加载高德地图 API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_AMAP_KEY
    const securityKey = process.env.NEXT_PUBLIC_AMAP_SECURITY_KEY

    if (!apiKey) {
      console.error('❌ 高德地图 API Key 未配置')
      setIsLoading(false)
      return
    }

    // 设置安全密钥
    if (securityKey) {
      window._AMapSecurityConfig = {
        securityJsCode: securityKey,
      }
    }

    // 检查是否已加载
    if (window.AMap) {
      setIsLoaded(true)
      setIsLoading(false)
      return
    }

    // 动态加载高德地图 API
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&plugin=AMap.Geocoder,AMap.PlaceSearch,AMap.Driving,AMap.Geolocation`
    script.async = true
    script.onload = () => {
      console.log('✅ 高德地图 API 加载成功')
      setIsLoaded(true)
      setIsLoading(false)
    }
    script.onerror = () => {
      console.error('❌ 高德地图 API 加载失败')
      setIsLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // 初始化地图
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return

    try {
      // 创建地图实例
      const map = new AMap.Map(mapContainerRef.current, {
        zoom,
        center,
        viewMode: '3D',
        resizeEnable: true,
      })

      mapRef.current = map
      console.log('✅ 地图初始化成功')
    } catch (error) {
      console.error('❌ 地图初始化失败:', error)
    }
  }, [isLoaded, center, zoom])

  // 更新地图标记
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return

    // 清除旧标记
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // 添加新标记
    if (locations.length > 0) {
      const newMarkers = locations.map((location, index) => {
        const marker = new AMap.Marker({
          position: [location.lng, location.lat],
          title: location.name,
          label: {
            content: location.name,
            offset: [0, -30],
          },
        })

        marker.setMap(mapRef.current)

        // 点击标记显示信息窗口
        marker.on('click', () => {
          setSelectedLocation(location)
          const infoWindow = new AMap.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${location.name}</h3>
                ${location.address ? `<p style="color: #666; font-size: 12px;">${location.address}</p>` : ''}
                ${location.type ? `<p style="color: #999; font-size: 11px;">类型: ${location.type}</p>` : ''}
              </div>
            `,
          })
          infoWindow.open(mapRef.current!, [location.lng, location.lat])
        })

        return marker
      })

      markersRef.current = newMarkers

      // 自动适应视野
      if (locations.length > 1) {
        mapRef.current.setFitView(newMarkers)
      } else if (locations.length === 1) {
        mapRef.current.setCenter([locations[0].lng, locations[0].lat])
      }
    }
  }, [locations, isLoaded])

  // 搜索地点
  const handleSearch = () => {
    console.log('🔍 开始搜索:', searchKeyword)
    console.log('地图状态:', { isLoaded, hasMap: !!mapRef.current })
    
    // 检查 API Key 配置
    const apiKey = process.env.NEXT_PUBLIC_AMAP_KEY
    console.log('API Key 状态:', apiKey ? '已配置' : '❌ 未配置')
    if (!apiKey) {
      const errorMsg = '高德地图 API Key 未配置，请在 .env.local 文件中添加 NEXT_PUBLIC_AMAP_KEY'
      console.error('❌', errorMsg)
      setNavigationError(errorMsg)
      setTimeout(() => setNavigationError(null), 5000)
      return
    }

    // 检查地图是否加载
    if (!isLoaded) {
      const errorMsg = '地图未加载完成，请稍候再试'
      console.error('❌', errorMsg)
      setNavigationError(errorMsg)
      setTimeout(() => setNavigationError(null), 3000)
      return
    }

    // 检查地图实例
    if (!mapRef.current) {
      const errorMsg = '地图未初始化，请刷新页面重试'
      console.error('❌', errorMsg)
      setNavigationError(errorMsg)
      setTimeout(() => setNavigationError(null), 3000)
      return
    }

    // 检查搜索关键词
    if (!searchKeyword.trim()) {
      const errorMsg = '请输入搜索关键词'
      console.warn('⚠️', errorMsg)
      setNavigationError(errorMsg)
      setTimeout(() => setNavigationError(null), 2000)
      return
    }

    // 检查高德地图 API
    if (!window.AMap) {
      const errorMsg = '高德地图 API 未加载，请检查 API Key 配置和网络连接'
      console.error('❌', errorMsg)
      setNavigationError(errorMsg)
      setTimeout(() => setNavigationError(null), 3000)
      return
    }

    console.log('✅ 开始调用搜索 API')

    // 清除之前的搜索结果标记
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // 清除错误提示
    setNavigationError(null)

    // 加载搜索插件
    AMap.plugin('AMap.PlaceSearch', () => {
      console.log('✅ PlaceSearch 插件加载成功')

      try {
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          city: '全国',
          map: mapRef.current!,
          panel: undefined, // 不使用默认面板
        })

        console.log('🔍 搜索关键词:', searchKeyword)

        placeSearch.search(searchKeyword, (status: string, result: any) => {
          console.log('📊 搜索结果状态:', status)
          console.log('📊 搜索结果数据:', result)

          // 处理成功情况
          if (status === 'complete' && result.poiList && result.poiList.pois) {
            const pois = result.poiList.pois
            setSearchResults(pois)
            console.log('✅ 搜索成功，找到', pois.length, '个结果')

            // 在地图上显示搜索结果
            if (pois.length > 0) {
              const newMarkers = pois.map((poi: any) => {
                const marker = new AMap.Marker({
                  position: [poi.location.lng, poi.location.lat],
                  title: poi.name,
                  label: {
                    content: poi.name,
                    offset: [0, -30],
                  },
                })
                marker.setMap(mapRef.current)
                
                // 点击标记显示信息
                marker.on('click', () => {
                  const location: Location = {
                    name: poi.name,
                    address: poi.address,
                    lng: poi.location.lng,
                    lat: poi.location.lat,
                    type: poi.type,
                  }
                  setSelectedLocation(location)
                })

                return marker
              })

              markersRef.current = newMarkers
              mapRef.current!.setFitView(newMarkers)
              console.log('✅ 已在地图上显示', newMarkers.length, '个标记')
            } else {
              const errorMsg = '未找到相关地点，请尝试其他关键词'
              setNavigationError(errorMsg)
              console.warn('⚠️', errorMsg)
            }
          } 
          // 处理错误情况
          else {
            let errorMsg = '搜索失败，请检查网络连接或稍后重试'
            
            // 解析错误信息
            if (result) {
              // 检查是否有错误信息
              if (result.info) {
                errorMsg = result.info
                console.error('❌ 搜索错误信息:', result.info)
              } else if (result.message) {
                errorMsg = result.message
                console.error('❌ 搜索错误消息:', result.message)
              } else if (result.infoCode) {
                // 高德地图错误码
                const errorCode = result.infoCode
                console.error('❌ 搜索错误码:', errorCode)
                
                switch (errorCode) {
                  case 'INVALID_USER_KEY':
                    errorMsg = 'API Key 无效，请检查高德地图 API Key 配置'
                    break
                  case 'USERKEY_PLAT_NOMATCH':
                    errorMsg = 'API Key 平台类型不匹配！\n\n请按以下步骤修复：\n1. 登录高德开放平台控制台\n2. 进入"应用管理" > "我的应用"\n3. 找到您的 Key，点击"设置"\n4. 在"服务平台"中选择"Web 端（JS API）"\n5. 保存后等待几分钟生效'
                    break
                  case 'DAILY_QUERY_OVER_LIMIT':
                    errorMsg = 'API 调用次数已超限，请稍后再试或升级配额'
                    break
                  case 'ACCESS_TOO_FREQUENT':
                    errorMsg = '请求过于频繁，请稍后再试'
                    break
                  case 'INVALID_PARAMS':
                    errorMsg = '搜索参数错误，请检查搜索关键词'
                    break
                  case 'SERVICE_NOT_EXIST':
                    errorMsg = '搜索服务不可用，请检查 API Key 权限'
                    break
                  case 'SERVICE_RESPONSE_ERROR':
                    errorMsg = '搜索服务响应错误，请稍后重试'
                    break
                  default:
                    errorMsg = `搜索失败 (错误码: ${errorCode})，请检查配置或稍后重试`
                }
              } else if (result === 'USERKEY_PLAT_NOMATCH' || typeof result === 'string') {
                // 处理字符串类型的错误码
                if (result === 'USERKEY_PLAT_NOMATCH') {
                  errorMsg = 'API Key 平台类型不匹配！\n\n请按以下步骤修复：\n1. 登录高德开放平台控制台\n2. 进入"应用管理" > "我的应用"\n3. 找到您的 Key，点击"设置"\n4. 在"服务平台"中选择"Web 端（JS API）"\n5. 保存后等待几分钟生效'
                } else {
                  errorMsg = `搜索失败: ${result}`
                }
              }
            }
            
            // 检查状态码
            if (status === 'error') {
              console.error('❌ 搜索状态为 error')
              console.error('❌ 错误详情:', {
                status,
                result,
                resultType: typeof result,
                resultKeys: result ? Object.keys(result) : 'null',
              })
              
              // 如果没有具体的错误信息，提供更详细的诊断
              if (!errorMsg.includes('错误码') && !errorMsg.includes('API Key')) {
                // 检查是否是 API Key 问题
                if (!process.env.NEXT_PUBLIC_AMAP_KEY) {
                  errorMsg = 'API Key 未配置，请在 .env.local 文件中添加 NEXT_PUBLIC_AMAP_KEY'
                } else if (result && (result.infoCode === 'INVALID_USER_KEY' || result.info === 'INVALID_USER_KEY')) {
                  errorMsg = 'API Key 无效，请检查高德地图 API Key 是否正确'
                } else {
                  errorMsg = '搜索服务出错，可能的原因：\n1. API Key 无效或未开通搜索服务\n2. 网络连接问题\n3. API 配额已用完\n\n请检查控制台获取详细错误信息'
                }
              }
            } else if (status === 'no_data') {
              errorMsg = '未找到相关地点，请尝试其他关键词'
              console.warn('⚠️ 无搜索结果')
            }
            
            setNavigationError(errorMsg)
            console.error('❌ 搜索失败详情:', {
              status,
              result,
              searchKeyword,
              apiKey: process.env.NEXT_PUBLIC_AMAP_KEY ? '已配置' : '❌ 未配置',
              amapLoaded: !!window.AMap,
              mapInstance: !!mapRef.current,
            })
            setSearchResults([])
          }
        })
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '搜索插件初始化失败'
        console.error('❌ PlaceSearch 初始化错误:', error)
        setNavigationError(errorMsg)
        setSearchResults([])
      }
    })
  }

  // 获取当前位置
  const getCurrentLocation = (): Promise<{ lng: number; lat: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理位置服务'))
        return
      }

      setGettingLocation(true)
      setNavigationError(null)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          const location = { lng: longitude, lat: latitude }
          setCurrentPosition(location)
          setGettingLocation(false)
          resolve(location)
        },
        (error) => {
          setGettingLocation(false)
          let errorMsg = '获取位置失败'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = '用户拒绝了位置请求，请在浏览器设置中允许位置访问'
              break
            case error.POSITION_UNAVAILABLE:
              errorMsg = '位置信息不可用'
              break
            case error.TIMEOUT:
              errorMsg = '获取位置超时'
              break
          }
          setNavigationError(errorMsg)
          reject(new Error(errorMsg))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  // 使用高德地图定位服务（备用方案）
  const getCurrentLocationByAMap = (): Promise<{ lng: number; lat: number }> => {
    return new Promise((resolve, reject) => {
      if (!mapRef.current) {
        reject(new Error('地图未初始化'))
        return
      }

      AMap.plugin('AMap.Geolocation', () => {
        const geolocation = new (window as any).AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
        })

        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete') {
            const location = {
              lng: result.position.lng,
              lat: result.position.lat,
            }
            setCurrentPosition(location)
            setGettingLocation(false)
            resolve(location)
          } else {
            setGettingLocation(false)
            const errorMsg = '高德定位失败: ' + result.message
            setNavigationError(errorMsg)
            reject(new Error(errorMsg))
          }
        })
      })
    })
  }

  // 路线规划
  const handleNavigation = async (destination: Location) => {
    if (!mapRef.current) {
      setNavigationError('地图未初始化')
      return
    }

    setNavigationError(null)
    setRouteInfo(null)

    let origin: [number, number]

    try {
      // 优先使用浏览器定位
      if (currentPosition) {
        origin = [currentPosition.lng, currentPosition.lat]
        console.log('✅ 使用已保存的位置:', origin)
      } else {
        // 尝试获取当前位置
        try {
          const location = await getCurrentLocation()
          origin = [location.lng, location.lat]
          console.log('✅ 获取到当前位置:', origin)
        } catch (browserError) {
          // 浏览器定位失败，尝试高德定位
          console.log('⚠️ 浏览器定位失败，尝试高德定位')
          try {
            const location = await getCurrentLocationByAMap()
            origin = [location.lng, location.lat]
            console.log('✅ 高德定位成功:', origin)
          } catch (amapError) {
            // 都失败了，使用地图中心
            const currentCenter = mapRef.current.getCenter()
            origin = [currentCenter.getLng(), currentCenter.getLat()]
            setNavigationError('无法获取当前位置，使用地图中心作为起点')
            console.warn('⚠️ 使用地图中心作为起点:', origin)
          }
        }
      }

      const dest: [number, number] = [destination.lng, destination.lat]

      // 清除之前的路线（只清除路线，保留标记）
      // 注意：clearMap 会清除所有覆盖物，我们需要重新添加标记
      // 但为了保留原有标记，我们只清除路线相关的覆盖物
      // 这里先清除所有，然后重新添加标记
      if (mapRef.current) {
        // 保存当前标记
        const existingMarkers = markersRef.current
        
        // 清除地图上的所有覆盖物（包括之前的路线）
        mapRef.current.clearMap()
        
        // 重新添加原有的地点标记
        existingMarkers.forEach((marker) => {
          marker.setMap(mapRef.current)
        })
      }

      AMap.plugin('AMap.Driving', () => {
        const driving = new AMap.Driving({
          map: mapRef.current!,
          policy: 0, // 0: 速度优先, 1: 费用优先, 2: 距离优先, 3: 不走高速
        })

        driving.search(origin, dest, (status: string, result: any) => {
          if (status === 'complete' && result.routes && result.routes.length > 0) {
            const route = result.routes[0]
            setRouteInfo({
              distance: Math.round(route.distance / 1000), // 转换为公里
              time: Math.round(route.time / 60), // 转换为分钟
            })
            console.log('✅ 路线规划成功', {
              distance: route.distance,
              time: route.time,
            })

            // 在地图上添加起点标记
            const originMarker = new AMap.Marker({
              position: origin,
              title: '起点',
              icon: new AMap.Icon({
                size: [32, 32],
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
                imageSize: [32, 32],
              }),
            })
            originMarker.setMap(mapRef.current)

            // 添加终点标记
            const destMarker = new AMap.Marker({
              position: dest,
              title: destination.name,
              icon: new AMap.Icon({
                size: [32, 32],
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                imageSize: [32, 32],
              }),
            })
            destMarker.setMap(mapRef.current)
          } else {
            const errorMsg = result.message || '路线规划失败，请检查起点和终点是否有效'
            setNavigationError(errorMsg)
            console.error('❌ 路线规划失败:', result)
          }
        })
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '导航失败'
      setNavigationError(errorMsg)
      console.error('❌ 导航错误:', error)
    }
  }

  // 选择搜索结果
  const handleSelectSearchResult = (poi: any) => {
    const location: Location = {
      name: poi.name,
      address: poi.address,
      lng: poi.location.lng,
      lat: poi.location.lat,
      type: poi.type,
    }

    setSelectedLocation(location)

    // 在地图上定位
    if (mapRef.current) {
      mapRef.current.setCenter([location.lng, location.lat])
      mapRef.current.setZoom(15)

      const marker = new AMap.Marker({
        position: [location.lng, location.lat],
        title: location.name,
      })
      marker.setMap(mapRef.current)

      const infoWindow = new AMap.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${location.name}</h3>
            ${location.address ? `<p style="color: #666; font-size: 12px;">${location.address}</p>` : ''}
            ${location.type ? `<p style="color: #999; font-size: 11px;">类型: ${location.type}</p>` : ''}
          </div>
        `,
      })
      infoWindow.open(mapRef.current, [location.lng, location.lat])
    }

    setSearchResults([])
    setSearchKeyword('')
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-gray-600">正在加载地图...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">地图加载失败</p>
            <p className="text-sm text-gray-500">请检查高德地图 API 配置</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 如果传入了 className，说明是在四列布局中，不显示外层 Card
  const isInGridLayout = className && className.includes('h-full')
  
  const mapContent = (
    <>
      {/* 搜索栏 */}
      {enableSearch && (
        <div className="space-y-2 mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="搜索地点、景点、餐厅..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value)
                setNavigationError(null) // 清除错误提示
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              className="flex-1"
              disabled={!isLoaded}
            />
            <Button 
              onClick={(e) => {
                e.preventDefault()
                handleSearch()
              }} 
              size="icon"
              disabled={!isLoaded || !searchKeyword.trim()}
              title={!isLoaded ? '地图加载中...' : !searchKeyword.trim() ? '请输入搜索关键词' : '搜索'}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {!isLoaded && (
            <p className="text-xs text-gray-500 mt-1">
              ⏳ 地图加载中，请稍候...
            </p>
          )}
          {isLoaded && !process.env.NEXT_PUBLIC_AMAP_KEY && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium mb-1">
                ⚠️ API Key 未配置
              </p>
              <p className="text-xs text-red-600">
                请在 .env.local 文件中添加 NEXT_PUBLIC_AMAP_KEY，然后重启服务器
              </p>
            </div>
          )}

          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <div className="max-h-32 overflow-y-auto bg-white border rounded-lg shadow-lg">
              {searchResults.map((poi, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 text-sm"
                  onClick={() => handleSelectSearchResult(poi)}
                >
                  <div className="font-medium">{poi.name}</div>
                  <div className="text-xs text-gray-600">{poi.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 路线信息 */}
      {routeInfo && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-900 text-sm">
            <RouteIcon className="h-4 w-4" />
            <span className="font-medium">
              距离: {routeInfo.distance} 公里 | 预计: {routeInfo.time} 分钟
            </span>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {navigationError && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800 text-xs">
            <span>⚠️ {navigationError}</span>
          </div>
        </div>
      )}

      {/* 获取当前位置按钮 */}
      {enableNavigation && (
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await getCurrentLocation()
                alert('✅ 位置获取成功！现在可以使用导航功能了。')
              } catch (error) {
                // 错误已在 getCurrentLocation 中处理
              }
            }}
            disabled={gettingLocation}
            className="w-full text-xs"
          >
            {gettingLocation ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                获取位置中...
              </>
            ) : (
              <>
                <MapPin className="h-3 w-3 mr-2" />
                {currentPosition ? '更新位置' : '获取位置'}
              </>
            )}
          </Button>
          {currentPosition && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              ✅ 已获取位置
            </p>
          )}
        </div>
      )}

      {/* 地图容器 */}
      <div
        ref={mapContainerRef}
        className="w-full h-[400px] rounded-lg overflow-hidden border"
      />

      {/* 选中地点信息和导航按钮 */}
      {selectedLocation && enableNavigation && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-sm">{selectedLocation.name}</h3>
              {selectedLocation.address && (
                <p className="text-xs text-gray-600 mt-1">{selectedLocation.address}</p>
              )}
            </div>
            <Button
              onClick={() => handleNavigation(selectedLocation)}
              className="ml-2"
              size="sm"
              disabled={gettingLocation}
            >
              {gettingLocation ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  规划中...
                </>
              ) : (
                <>
                  <Navigation className="h-3 w-3 mr-1" />
                  导航
                </>
              )}
            </Button>
          </div>
          {!currentPosition && (
            <p className="text-xs text-yellow-600 mt-2">
              💡 点击上方&quot;获取位置&quot;按钮可获取您的实时位置
            </p>
          )}
        </div>
      )}

      {/* 地点列表 */}
      {locations.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-sm">地点列表 ({locations.length})</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {locations.map((location, index) => (
              <div
                key={index}
                className="p-2 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer text-sm"
                onClick={() => {
                  setSelectedLocation(location)
                  if (mapRef.current) {
                    mapRef.current.setCenter([location.lng, location.lat])
                    mapRef.current.setZoom(15)
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{location.name}</div>
                    {location.address && (
                      <div className="text-xs text-gray-600">{location.address}</div>
                    )}
                  </div>
                  {enableNavigation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNavigation(location)
                      }}
                      disabled={gettingLocation}
                      title="导航到此地点"
                      className="h-6 px-2"
                    >
                      {gettingLocation ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Navigation className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )

  if (isInGridLayout) {
    return <div className={className}>{mapContent}</div>
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          地图导航
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mapContent}
      </CardContent>
    </Card>
  )
}

