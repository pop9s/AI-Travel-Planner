# 高德地图 API 配置指南

## 📍 功能说明

项目已集成高德地图 API，提供以下功能：
- 🗺️ **地图展示**：在旅行计划详情页显示目的地地图
- 🔍 **地点搜索**：搜索景点、餐厅、酒店等地点
- 🧭 **路线规划**：计算两地之间的驾车路线和导航
- 📍 **地理定位**：自动将目的地地名转换为地图坐标
- 📱 **响应式设计**：适配桌面和移动端

## 🔑 获取高德地图 API Key

### 步骤 1: 注册高德开放平台账号

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 点击右上角"注册/登录"
3. 使用手机号或邮箱注册账号

### 步骤 2: 创建应用

1. 登录后进入 [控制台](https://console.amap.com/dev/index)
2. 点击 "应用管理" > "我的应用"
3. 点击 "创建新应用"
4. 填写应用信息：
   - **应用名称**：AI Travel Planner（或自定义）
   - **应用类型**：Web 端（JavaScript API）

### 步骤 3: 添加 Key

1. 在应用详情页，点击 "添加 Key"
2. 填写 Key 信息：
   - **Key 名称**：AI-Travel-Planner-Web
   - **服务平台**：选择 "Web 端（JS API）"
   - **白名单**：开发阶段可以不填，生产环境建议配置
3. 点击 "提交"，获得 **Key**

### 步骤 4: 配置安全密钥（可选但推荐）

1. 在 Key 详情页，找到 "安全密钥"
2. 点击 "设置" 或 "生成"
3. 记录生成的 **安全密钥（securityJsCode）**

## ⚙️ 配置项目

### 1. 添加环境变量

在项目根目录的 `.env.local` 文件中添加以下配置：

```bash
# 高德地图 API 密钥
NEXT_PUBLIC_AMAP_KEY=你的高德地图Key
NEXT_PUBLIC_AMAP_SECURITY_KEY=你的安全密钥（可选）
```

**示例：**
```bash
# 高德地图 API 密钥
NEXT_PUBLIC_AMAP_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
NEXT_PUBLIC_AMAP_SECURITY_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### 2. 重启开发服务器

配置完成后，需要重启开发服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

## 📋 使用说明

### 在旅行计划详情页使用地图

1. 创建或打开一个旅行计划
2. 系统会自动在详情页显示目的地地图
3. 可以通过"显示地图/隐藏地图"按钮切换显示

### 地图功能

#### 🔍 搜索地点
- 在搜索框中输入地点名称
- 支持搜索景点、餐厅、酒店等
- 点击搜索结果定位到地图上

#### 🧭 路线规划
- 点击地点卡片上的"导航"按钮
- 系统会规划从当前位置到目标地点的路线
- 显示距离和预计时间

#### 📍 地点标记
- 地图会自动标记旅行目的地
- 点击标记显示地点详情
- 支持添加多个地点标记

## 🎨 自定义地图组件

### 基础用法

```tsx
import MapView from '@/components/MapView'

<MapView
  locations={[
    {
      name: '天安门广场',
      address: '北京市东城区',
      lng: 116.397428,
      lat: 39.90923,
      type: 'attraction',
    },
  ]}
  center={[116.397428, 39.90923]}
  zoom={13}
  enableSearch={true}
  enableNavigation={true}
/>
```

### Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `locations` | `Location[]` | `[]` | 地点列表 |
| `center` | `[number, number]` | `[116.397428, 39.90923]` | 地图中心坐标（经度, 纬度） |
| `zoom` | `number` | `13` | 缩放级别（3-20） |
| `enableSearch` | `boolean` | `true` | 是否启用搜索功能 |
| `enableNavigation` | `boolean` | `true` | 是否启用导航功能 |
| `className` | `string` | `''` | 自定义样式类 |

### Location 接口

```typescript
interface Location {
  name: string        // 地点名称
  address?: string    // 详细地址
  lng: number        // 经度
  lat: number        // 纬度
  type?: string      // 地点类型（如：attraction, hotel, restaurant）
}
```

## 🔧 API 路由

### 地理编码 API

将地址转换为经纬度坐标：

```typescript
// GET /api/geocode?address=北京市天安门
const response = await fetch('/api/geocode?address=北京市天安门')
const data = await response.json()

// 响应格式
{
  success: true,
  location: {
    lng: 116.397428,
    lat: 39.90923,
    formattedAddress: '北京市东城区天安门',
    province: '北京市',
    city: '北京市',
    district: '东城区'
  }
}
```

## 🚨 常见问题

### 1. 地图不显示

**原因：** API Key 未配置或配置错误

**解决方案：**
- 检查 `.env.local` 文件中的 `NEXT_PUBLIC_AMAP_KEY` 是否正确
- 确保重启了开发服务器
- 打开浏览器控制台，查看是否有错误信息

### 2. 提示"高德地图 API 加载失败"

**原因：** 网络问题或 API Key 无效

**解决方案：**
- 检查网络连接
- 验证 API Key 是否有效（登录高德控制台查看）
- 确认 Key 的服务平台选择了 "Web 端（JS API）"

### 3. 搜索功能无响应

**原因：** 搜索插件未加载

**解决方案：**
- 检查浏览器控制台是否有错误
- 确保 API Key 已开通地点搜索服务
- 刷新页面重试

### 4. 路线规划失败

**原因：** 起点或终点坐标无效

**解决方案：**
- 确保地点坐标正确
- 检查是否在中国大陆范围内（高德地图主要服务中国地区）

## 📚 相关资源

- [高德地图 JavaScript API 文档](https://lbs.amap.com/api/javascript-api/summary)
- [高德地图示例中心](https://lbs.amap.com/demo/list/js-api)
- [高德开放平台控制台](https://console.amap.com/)

## 🎯 下一步

- ✅ 配置高德地图 API Key
- ✅ 在旅行计划中查看地图
- 🚀 探索更多地图功能（如：周边搜索、实时路况等）
- 🎨 自定义地图样式和交互

---

如有问题，请查看 [高德地图开发者文档](https://lbs.amap.com/api/javascript-api/guide/abc/prepare) 或项目 Issues。

