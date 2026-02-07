'use client'

import { motion } from 'framer-motion'
import { Clock, Zap, TrendingUp, DollarSign, CheckCircle } from 'lucide-react'

export default function AnalysisResults({ data }) {
  const savingsMinutes = Math.floor((data.current_time - data.smart_time) / 60)
  const currentMinutes = Math.floor(data.current_time / 60)
  const smartMinutes = Math.floor(data.smart_time / 60)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Main Results Card */}
      <motion.div
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h3 className="text-3xl font-bold text-white mb-2">Analysis Complete!</h3>
          <p className="text-gray-400">Based on {data.commits_analyzed} recent commits in {data.repo_name}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current CI */}
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-red-400" />
              <span className="text-red-400 font-semibold">Current CI</span>
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {currentMinutes}<span className="text-2xl text-gray-400">min</span>
            </div>
            <div className="text-gray-400 text-sm">Average pipeline duration</div>
            <div className="mt-4 h-2 bg-red-500/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-red-600"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
          </motion.div>

          {/* Smart CI */}
          <motion.div
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-semibold">With SmartCI</span>
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {smartMinutes}<span className="text-2xl text-gray-400">min</span>
            </div>
            <div className="text-gray-400 text-sm">Optimized pipeline duration</div>
            <div className="mt-4 h-2 bg-green-500/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${(data.smart_time / data.current_time) * 100}%` }}
                transition={{ delay: 0.6, duration: 1 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Savings Highlight */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-white" />
            <span className="text-5xl font-bold text-white">{data.savings_percent}%</span>
          </div>
          <div className="text-white/90 text-lg">
            You could save <span className="font-bold">{savingsMinutes} minutes</span> per commit
          </div>
        </motion.div>
      </motion.div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Zap,
            label: 'Tests Selected',
            value: `${data.tests_avg_selected} / ${data.tests_total}`,
            subtext: `${Math.round((data.tests_avg_selected / data.tests_total) * 100)}% of total`,
            color: 'purple'
          },
          {
            icon: Clock,
            label: 'Time Saved Per Day',
            value: `${Math.floor((savingsMinutes * 10) / 60)}h ${(savingsMinutes * 10) % 60}m`,
            subtext: 'Based on 10 commits/day',
            color: 'blue'
          },
          {
            icon: DollarSign,
            label: 'Monthly Savings',
            value: data.monthly_savings,
            subtext: 'Developer productivity gains',
            color: 'green'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <stat.icon className={`w-8 h-8 text-${stat.color}-400 mb-3`} />
            <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-gray-500 text-xs">{stat.subtext}</div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h3 className="text-2xl font-bold text-white mb-4">Ready to save {savingsMinutes} minutes per commit?</h3>
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Install GitHub Action (Free)
        </motion.button>
        <p className="text-gray-400 text-sm mt-4">Takes 2 minutes to set up • No credit card required</p>
      </motion.div>
    </div>
  )
}

