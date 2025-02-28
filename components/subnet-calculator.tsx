"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubnetResults } from "@/components/subnet-results"
import { SubnetVisualizer } from "@/components/subnet-visualizer"
import { calculateSubnet } from "@/lib/subnet-utils"
import type { SubnetInfo } from "@/lib/types"

export function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState("")
  const [subnetMask, setSubnetMask] = useState("24")
  const [subnetInfo, setSubnetInfo] = useState<SubnetInfo | null>(null)
  const [error, setError] = useState("")

  const handleCalculate = () => {
    try {
      setError("")
      const result = calculateSubnet(ipAddress, Number.parseInt(subnetMask))
      setSubnetInfo(result)
    } catch (err) {
      setError((err as Error).message)
      setSubnetInfo(null)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Network Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ip-address">IP Address</Label>
              <Input
                id="ip-address"
                placeholder="e.g. 192.168.1.1"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subnet-mask">Subnet Mask (CIDR)</Label>
              <div className="flex items-center gap-2">
                <Select value={subnetMask} onValueChange={(value) => setSubnetMask(value)}>
                  <SelectTrigger id="subnet-mask" className="w-full">
                    <SelectValue placeholder="Select CIDR" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((cidr) => (
                      <SelectItem key={cidr} value={cidr.toString()}>
                        /{cidr} ({cidrToSubnetMask(cidr)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCalculate} className="mt-2">
              Calculate Subnet
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {subnetInfo && (
        <>
          <SubnetResults subnetInfo={subnetInfo} />
          <SubnetVisualizer subnetInfo={subnetInfo} />
        </>
      )}
    </div>
  )
}

// Helper function to convert CIDR to subnet mask
function cidrToSubnetMask(cidr: number): string {
  const mask = new Array(4).fill(0)
  const fullOctets = Math.floor(cidr / 8)
  const remainingBits = cidr % 8

  // Fill full octets with 255
  for (let i = 0; i < fullOctets; i++) {
    mask[i] = 255
  }

  // Calculate partial octet if any
  if (remainingBits > 0 && fullOctets < 4) {
    mask[fullOctets] = 256 - Math.pow(2, 8 - remainingBits)
  }

  return mask.join(".")
}

