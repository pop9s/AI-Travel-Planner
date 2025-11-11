/**
 * 地理编码 API 路由
 * 使用高德地图 Web 服务 API 将地址转换为经纬度
 */

import { NextRequest, NextResponse } from 'next/server'

// 标记为动态路由，避免静态生成
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { success: false, message: '缺少地址参数' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_AMAP_KEY

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: '高德地图 API Key 未配置' },
        { status: 500 }
      )
    }

    // 调用高德地图地理编码 API
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      const geocode = data.geocodes[0]
      const [lng, lat] = geocode.location.split(',').map(Number)

      return NextResponse.json({
        success: true,
        location: {
          lng,
          lat,
          formattedAddress: geocode.formatted_address,
          province: geocode.province,
          city: geocode.city,
          district: geocode.district,
        },
      })
    } else {
      return NextResponse.json(
        { success: false, message: '未找到该地址' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('地理编码错误:', error)
    return NextResponse.json(
      { success: false, message: '地理编码失败' },
      { status: 500 }
    )
  }
}

