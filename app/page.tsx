import { SubnetCalculator } from "@/components/subnet-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            IP Subnet Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Calculate network information based on IP address and subnet mask
          </p>
        </header>
        <SubnetCalculator />
      </div>
    </main>
  )
}

