'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Share2, MapPin } from 'lucide-react'

interface TravelPlanProps {
  plan: string
  destination: string
  showCard?: boolean // 是否显示外层 Card
}

export default function TravelPlan({ plan, destination, showCard = true }: TravelPlanProps) {
  const handleDownload = () => {
    const blob = new Blob([plan], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${destination}-旅行计划.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${destination} 旅行计划`,
          text: plan,
        })
      } catch (err) {
        console.log('分享失败:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(plan)
      alert('旅行计划已复制到剪贴板!')
    }
  }

  // Parse the plan into sections for better display
  const formatPlan = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, index) => {
      // Check if it's a heading (starts with #, ##, or contains Day/第)
      if (line.match(/^#{1,3}\s/) || line.match(/^(Day\s\d+|第.+天)/)) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3 first:mt-0">
            {line.replace(/^#{1,3}\s/, '')}
          </h3>
        )
      }
      // Check if it's a subheading or bullet point
      else if (line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
        return (
          <p key={index} className="text-gray-700 ml-4 mb-2 leading-relaxed">
            {line}
          </p>
        )
      }
      // Regular paragraph
      else if (line.trim()) {
        return (
          <p key={index} className="text-gray-700 mb-3 leading-relaxed">
            {line}
          </p>
        )
      }
      // Empty line
      return <div key={index} className="h-2" />
    })
  }

  const content = (
    <div className="prose prose-sm max-w-none">
      {formatPlan(plan)}
    </div>
  )

  if (!showCard) {
    return (
      <div>
        <div className="mb-4 pb-3 border-b">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <MapPin className="h-5 w-5 text-blue-600" />
            {destination} 旅行计划
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI为您精心定制的专属旅行方案
          </p>
        </div>
        {content}
        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button 
            onClick={handleDownload} 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            下载
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Share2 className="mr-2 h-4 w-4" />
            分享
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <MapPin className="h-6 w-6" />
          {destination} 旅行计划
        </CardTitle>
        <CardDescription className="text-blue-50">
          AI为您精心定制的专属旅行方案
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {content}
        
        <div className="flex gap-3 mt-8 pt-6 border-t">
          <Button 
            onClick={handleDownload} 
            variant="outline" 
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            下载计划
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline"
            className="flex-1"
          >
            <Share2 className="mr-2 h-4 w-4" />
            分享
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

