import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SubnetInfo } from "@/lib/types"

interface SubnetResultsProps {
  subnetInfo: SubnetInfo
}

export function SubnetResults({ subnetInfo }: SubnetResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subnet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultItem label="Network Address" value={subnetInfo.networkAddress} />
          <ResultItem label="Broadcast Address" value={subnetInfo.broadcastAddress} />
          <ResultItem label="Subnet Mask" value={subnetInfo.subnetMask} />
          <ResultItem label="CIDR Notation" value={`/${subnetInfo.cidr}`} />
          <ResultItem label="First Usable IP" value={subnetInfo.firstUsableIp} />
          <ResultItem label="Last Usable IP" value={subnetInfo.lastUsableIp} />
          <ResultItem label="Total Hosts" value={subnetInfo.totalHosts.toString()} />
          <ResultItem label="Usable Hosts" value={subnetInfo.usableHosts.toString()} />
        </div>
      </CardContent>
    </Card>
  )
}

interface ResultItemProps {
  label: string
  value: string
}

function ResultItem({ label, value }: ResultItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-mono text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  )
}

