import type { SubnetInfo } from "./types"

export function calculateSubnet(ipAddress: string, cidr: number): SubnetInfo {
  // Validate IP address format
  if (!isValidIpAddress(ipAddress)) {
    throw new Error("Invalid IP address format. Please use format: xxx.xxx.xxx.xxx")
  }

  // Validate CIDR range
  if (cidr < 1 || cidr > 30) {
    throw new Error("CIDR must be between 1 and 30")
  }

  // Convert IP to binary
  const ipOctets = ipAddress.split(".").map(Number)
  const ipBinary = ipOctets.map((octet) => octet.toString(2).padStart(8, "0")).join("")

  // Calculate subnet mask in binary and decimal
  const subnetMaskBinary = "1".repeat(cidr) + "0".repeat(32 - cidr)
  const subnetMaskOctets = []
  for (let i = 0; i < 32; i += 8) {
    subnetMaskOctets.push(Number.parseInt(subnetMaskBinary.substring(i, i + 8), 2))
  }
  const subnetMask = subnetMaskOctets.join(".")

  // Calculate network address
  const networkBinary = ipBinary.substring(0, cidr) + "0".repeat(32 - cidr)
  const networkOctets = []
  for (let i = 0; i < 32; i += 8) {
    networkOctets.push(Number.parseInt(networkBinary.substring(i, i + 8), 2))
  }
  const networkAddress = networkOctets.join(".")

  // Calculate broadcast address
  const broadcastBinary = ipBinary.substring(0, cidr) + "1".repeat(32 - cidr)
  const broadcastOctets = []
  for (let i = 0; i < 32; i += 8) {
    broadcastOctets.push(Number.parseInt(broadcastBinary.substring(i, i + 8), 2))
  }
  const broadcastAddress = broadcastOctets.join(".")

  // Calculate first and last usable IP addresses
  const firstUsableIpOctets = [...networkOctets]
  const lastUsableIpOctets = [...broadcastOctets]

  // For /31 and /32, there are special cases
  if (cidr < 31) {
    // Adjust first usable IP (network address + 1)
    firstUsableIpOctets[3] += 1

    // Adjust last usable IP (broadcast address - 1)
    lastUsableIpOctets[3] -= 1
  }

  const firstUsableIp = firstUsableIpOctets.join(".")
  const lastUsableIp = lastUsableIpOctets.join(".")

  // Calculate total hosts and usable hosts
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = cidr < 31 ? totalHosts - 2 : totalHosts

  return {
    networkAddress,
    broadcastAddress,
    subnetMask,
    cidr,
    firstUsableIp,
    lastUsableIp,
    totalHosts,
    usableHosts,
  }
}

// Helper function to validate IP address format
function isValidIpAddress(ip: string): boolean {
  const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const match = ip.match(ipPattern)

  if (!match) return false

  // Check each octet is between 0 and 255
  for (let i = 1; i <= 4; i++) {
    const octet = Number.parseInt(match[i])
    if (octet < 0 || octet > 255) return false
  }

  return true
}

