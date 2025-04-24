import Link from "next/link"
import { ArrowRight, Code, Database, Lock, Server, Shield, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiGithub } from "@icons-pack/react-simple-icons"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-center sticky top-0 z-40 w-full border-b border-[#1A1A1A] bg-[#0C0C0C]">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-[#00D671]" />
              <span className="inline-block font-bold text-white">SimpleVRF</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-[#00D671]"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-[#00D671]"
              >
                How It Works
              </Link>
              <Link
                href="#components"
                className="flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-[#00D671]"
              >
                Components
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="https://github.com/darthbenro008/simplevrf" target="_blank">
                <Button className="bg-[#00D671] text-[#0C0C0C] hover:bg-[#00B85F] group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,214,113,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00D671] via-[#00B85F] to-[#00D671] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[gradient_3s_linear_infinite]" />
                  <span className="relative flex items-center">
                    <SiGithub className="w-4 h-4 mr-2" /> View on GitHub
                  </span>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 relative bg-[#0C0C0C]">
        {/* Global Background Pattern */}
        <div className="fixed inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#00D671_1px,transparent_1px),linear-gradient(-45deg,#00D671_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>
        {/* Global Animated Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-[10%] top-[20%] w-[40%] h-[40%] rounded-full bg-[#00D671] blur-[128px] animate-float opacity-20" />
          <div className="absolute -right-[10%] bottom-[20%] w-[40%] h-[40%] rounded-full bg-[#00B85F] blur-[128px] animate-float-delayed opacity-20" />
          <div className="absolute left-[50%] top-[60%] w-[30%] h-[30%] rounded-full bg-[#00D671] blur-[128px] animate-float opacity-10" />
        </div>
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white sm:text-5xl xl:text-6xl/none">
                    SimpleVRF
                    <span className="text-[#00D671]">.</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    A simple and secure Verifiable Random Function (VRF) implementation for the Fuel Network.
                  </p>
                </div>
                <div className="flex flex-col gap-6 min-[400px]:flex-row">
                  <Link href="https://github.com/darthbenro008/simplevrf" target="_blank">
                    <Button className="bg-[#00D671] text-[#0C0C0C] hover:bg-[#00B85F] group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,214,113,0.3)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00D671] via-[#00B85F] to-[#00D671] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[gradient_3s_linear_infinite]" />
                      <span className="relative flex items-center">
                        Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] animate-float">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00D671] to-[#00B85F] blur-[2px] animate-pulse" />
                  <div className="absolute inset-[2px] rounded-full bg-[#0C0C0C] flex items-center justify-center">
                    <Shield className="h-24 w-24 text-[#00D671] animate-pulse" />
                    {/* Orbiting dots */}
                    <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00D671]" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00D671]" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00D671]" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00D671]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-[#0C0C0C]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#00D671]/10 px-3 py-1 text-sm text-[#00D671]">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Why Choose SimpleVRF?</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SimpleVRF provides cryptographically secure, verifiable random numbers for your decentralized applications.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="rounded-full bg-[#00D671]/10 p-3">
                  <Lock className="h-6 w-6 text-[#00D671]" />
                </div>
                <h3 className="text-xl font-bold text-white">Unpredictable</h3>
                <p className="text-center text-sm text-gray-400">
                  Random numbers that cannot be predicted in advance by any party.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="rounded-full bg-[#00D671]/10 p-3">
                  <Shield className="h-6 w-6 text-[#00D671]" />
                </div>
                <h3 className="text-xl font-bold text-white">Verifiable</h3>
                <p className="text-center text-sm text-gray-400">
                  Cryptographic proof that the random number was generated correctly.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="rounded-full bg-[#00D671]/10 p-3">
                  <Database className="h-6 w-6 text-[#00D671]" />
                </div>
                <h3 className="text-xl font-bold text-white">Decentralized</h3>
                <p className="text-center text-sm text-gray-400">
                  No single point of failure or control in the random number generation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="rounded-full bg-[#00D671]/10 p-3">
                  <Server className="h-6 w-6 text-[#00D671]" />
                </div>
                <h3 className="text-xl font-bold text-white">Byzantine Fault-Tolerant</h3>
                <p className="text-center text-sm text-gray-400">
                  System remains operational even if some nodes fail or act maliciously.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-[#0C0C0C]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#00D671]/10 px-3 py-1 text-sm text-[#00D671]">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">ECVRF + Quorum Consensus</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SimpleVRF combines Elliptic Curve Verifiable Random Function with Byzantine fault-tolerant quorum consensus.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00D671] text-[#0C0C0C] font-bold text-xl">1</div>
                <h3 className="text-xl font-bold text-white">Request</h3>
                <p className="text-center text-sm text-gray-400">Smart contract requests a random number with a unique seed.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00D671] text-[#0C0C0C] font-bold text-xl">2</div>
                <h3 className="text-xl font-bold text-white">Generate</h3>
                <p className="text-center text-sm text-gray-400">VRF nodes generate random values and cryptographic proofs.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00D671] text-[#0C0C0C] font-bold text-xl">3</div>
                <h3 className="text-xl font-bold text-white">Verify & Deliver</h3>
                <p className="text-center text-sm text-gray-400">Consensus is reached, proofs are verified, and the random number is delivered.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="components" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-[#0C0C0C]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#00D671]/10 px-3 py-1 text-sm text-[#00D671]">Components</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">System Architecture</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SimpleVRF consists of several key components working together to provide secure randomness.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col space-y-3 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-[#00D671]" />
                  <h3 className="font-bold text-white">ECVRF Package</h3>
                </div>
                <p className="text-sm text-gray-400">Core cryptographic implementation of the Elliptic Curve VRF.</p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-[#00D671]" />
                  <h3 className="font-bold text-white">SimpleVrf Contract</h3>
                </div>
                <p className="text-sm text-gray-400">Main smart contract implementation on Fuel Network.</p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-[#00D671]" />
                  <h3 className="font-bold text-white">SimpleVrf ABI</h3>
                </div>
                <p className="text-sm text-gray-400">Contract interface definitions.</p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-[#00D671]" />
                  <h3 className="font-bold text-white">Worker</h3>
                </div>
                <p className="text-sm text-gray-400">Service that processes VRF requests and generates random numbers.</p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-[#00D671]" />
                  <h3 className="font-bold text-white">CLI</h3>
                </div>
                <p className="text-sm text-gray-400">Command-line interface for interacting with SimpleVrf.</p>
              </div>
              <div className="flex flex-col space-y-3 rounded-lg border border-[#00D671]/20 bg-[#0C0C0C] p-6 transition-all duration-300 hover:scale-105 hover:border-[#00D671]/40 hover:shadow-[#00D671]/10 relative">
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-[#00D671]" />
                  <h3 className="font-bold text-white">SimpleVrf Example</h3>
                </div>
                <p className="text-sm text-gray-400">Example implementation showing how to use SimpleVrf.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="z-50 w-full flex justify-center py-12 md:py-24 lg:py-32 bg-[#0C0C0C] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Integrate SimpleVRF into your Fuel Network applications today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="https://github.com/darthbenro008/simplevrf" target="_blank">
                  <Button className="bg-[#00D671] text-[#0C0C0C] hover:bg-[#00B85F]">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full flex justify-center border-t border-[#1A1A1A] bg-[#0C0C0C] py-6 text-white relative z-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#00D671]" />
            <p className="text-sm font-medium">© 2025 SimpleVRF. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="https://github.com/darthbenro008/simplevrf" className="text-sm text-gray-400 hover:text-[#00D671]">
              GitHub
            </Link>
            <Link href="https://docs.simplevrf.xyz" className="text-sm text-gray-400 hover:text-[#00D671]">
              Documentation
            </Link>
            <Link href="https://t.me/+TS_P30bfQA05NTdl" className="text-sm text-gray-400 hover:text-[#00D671]">
              Telegram
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
