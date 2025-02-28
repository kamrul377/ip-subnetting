"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SubnetInfo } from "@/lib/types"

interface SubnetVisualizerProps {
  subnetInfo: SubnetInfo
}

export function SubnetVisualizer({ subnetInfo }: SubnetVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = 100
    const padding = 20
    const barHeight = 40
    const barY = (height - barHeight) / 2

    // Draw network range
    ctx.fillStyle = "#e2e8f0" // Light gray for the entire range
    ctx.fillRect(padding, barY, width - padding * 2, barHeight)

    // Calculate positions based on IP ranges
    const networkIp = ipToNumber(subnetInfo.networkAddress)
    const broadcastIp = ipToNumber(subnetInfo.broadcastAddress)
    const firstUsableIp = ipToNumber(subnetInfo.firstUsableIp)
    const lastUsableIp = ipToNumber(subnetInfo.lastUsableIp)

    const totalRange = broadcastIp - networkIp
    const barWidth = width - padding * 2

    // Draw usable IP range
    const usableStartX = padding + ((firstUsableIp - networkIp) / totalRange) * barWidth
    const usableWidth = ((lastUsableIp - firstUsableIp) / totalRange) * barWidth

    ctx.fillStyle = "#60a5fa" // Blue for usable range
    ctx.fillRect(usableStartX, barY, usableWidth, barHeight)

    // Draw network address
    ctx.fillStyle = "#f97316" // Orange for network address
    ctx.fillRect(padding, barY, 2, barHeight)

    // Draw broadcast address
    ctx.fillStyle = "#f97316" // Orange for broadcast address
    ctx.fillRect(width - padding - 2, barY, 2, barHeight)

    // Add labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // Network address label
    ctx.fillText("Network", padding, barY - 5)

    // Broadcast address label
    ctx.fillText("Broadcast", width - padding, barY - 5)

    // Usable range label
    ctx.fillText("Usable IP Range", usableStartX + usableWidth / 2, barY + barHeight / 2 + 5)

    // Add IP addresses below
    ctx.textAlign = "left"
    ctx.fillText(subnetInfo.networkAddress, padding, barY + barHeight + 15)

    ctx.textAlign = "right"
    ctx.fillText(subnetInfo.broadcastAddress, width - padding, barY + barHeight + 15)
  }, [subnetInfo])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <canvas ref={canvasRef} width={800} height={100} className="w-full" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[#f97316] rounded-full"></div>
            <span>Network/Broadcast</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[#60a5fa] rounded-full"></div>
            <span>Usable IP Range</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[#e2e8f0] rounded-full"></div>
            <span>Total Network Range</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to convert IP to number for calculations
function ipToNumber(ip: string): number {
  return ip.split(".").reduce((sum, octet, index) => {
    return sum + Number.parseInt(octet) * Math.pow(256, 3 - index)
  }, 0)
}

