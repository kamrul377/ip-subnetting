export interface SubnetInfo {
  networkAddress: string
  broadcastAddress: string
  subnetMask: string
  cidr: number
  firstUsableIp: string
  lastUsableIp: string
  totalHosts: number
  usableHosts: number
}

