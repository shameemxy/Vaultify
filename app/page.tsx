'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Lock, Cloud, Layers3 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 sticky top-0 bg-white z-20">
        <div className="flex items-center space-x-2">
          <Cloud className="h-7 w-7 text-gray-900" />
          <span className="text-xl font-bold text-gray-900">Vaultify</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link 
            href="/login" 
            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
          >
            Sign In
          </Link>
          <Link 
            href="/signup"
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-40">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-500 mb-4 tracking-wider uppercase">
            Privacy First. Cloud Simple.
          </p>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight text-balance">
            Your Private, End-to-End Encrypted Cloud Storage.
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Unlike other cloud storage providers, we never see your files. Your data stays on your device, 
            encrypted and private. Always.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-32">
            <Link 
              href="/signup"
              className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2 text-lg"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/login"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-500 hover:text-gray-900 transition-colors font-medium text-lg"
            >
              Sign In
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-left p-8 rounded-2xl bg-gray-50 border border-gray-100">
              <Shield className="h-8 w-8 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Zero Knowledge</h3>
              <p className="text-gray-600">
                We never have access to your encryption keys or file contents.
              </p>
            </div>
            
            <div className="text-left p-8 rounded-2xl bg-gray-50 border border-gray-100">
              <Lock className="h-8 w-8 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Encrypted On Device</h3>
              <p className="text-gray-600">
                Every file is secured with robust, industry-standard encryption *before* it leaves your machine.
              </p>
            </div>
            
            <div className="text-left p-8 rounded-2xl bg-gray-50 border border-gray-100">
              <Cloud className="h-8 w-8 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Decentralized Backups</h3>
              <p className="text-gray-600">
                Your data is distributed securely, preventing single points of failure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Vaultify, Inc. All rights reserved. 
          </p>
        </div>
      </footer>
    </div>
  )
}