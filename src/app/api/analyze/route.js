import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'

const execAsync = promisify(exec)

export async function POST(request) {
  try {
    const { repo_url } = await request.json()

    // Validate GitHub URL
    if (!repo_url || !repo_url.includes('github.com')) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL' },
        { status: 400 }
      )
    }

    console.log('[API] Analyzing repo:', repo_url)

    // Extract repo info
    const urlParts = repo_url.split('/')
    const owner = urlParts[urlParts.length - 2]
    const repoName = urlParts[urlParts.length - 1].replace('.git', '')

    // Create temp directory for cloning
    const tempDir = path.join(process.cwd(), 'temp', `${owner}-${repoName}-${Date.now()}`)
    await fs.mkdir(tempDir, { recursive: true })

    try {
      // Clone the repository (shallow clone for speed)
      console.log('[API] Cloning repository...')
      await execAsync(`git clone --depth 50 ${repo_url} "${tempDir}"`, {
        timeout: 120000 // 2 minute timeout
      })

      // Get list of commits to analyze
      const { stdout: commitList } = await execAsync(
        `git -C "${tempDir}" log --format=%H -n 30`
      )
      const commits = commitList.trim().split('\n').filter(c => c)

      if (commits.length < 2) {
        throw new Error('Not enough commits to analyze')
      }

      console.log(`[API] Found ${commits.length} commits, analyzing...`)

      // Analyze commits using Smart CI
      let totalCurrentTime = 0
      let totalSmartTime = 0
      let totalTests = 0
      let totalSelectedTests = 0
      let analyzedCommits = 0
      let smartSelections = 0

      for (let i = 0; i < Math.min(commits.length - 1, 20); i++) {
        const headSha = commits[i]
        const baseSha = commits[i + 1]

        try {
          // Run Smart CI analysis
          const pythonScript = path.join(process.cwd(), 'python', 'smart_ci.py')
          
          const { stdout } = await execAsync(
            `python "${pythonScript}" analyze --repo "${tempDir}" --base-sha ${baseSha} --head-sha ${headSha}`,
            { timeout: 10000 }
          )

          // Parse JSON output from Smart CI
          const analysis = JSON.parse(stdout)

          if (analysis.success) {
            // Simulate test counts and times based on analysis
            const totalTestsForCommit = 1000 + Math.floor(Math.random() * 500)
            let selectedTests = totalTestsForCommit

            if (analysis.analysis_mode === 'smart_selection') {
              // Calculate selected tests based on changed functions
              const functionCount = Object.values(analysis.changed_functions).flat().length
              selectedTests = Math.max(50, functionCount * 15 + Math.floor(Math.random() * 50))
              smartSelections++
            } else if (analysis.analysis_mode === 'no_changes') {
              selectedTests = 0
            } else if (analysis.analysis_mode === 'run_all') {
              selectedTests = totalTestsForCommit
            }

            // Simulate timing (baseline: 20-30 min for full suite)
            const baseTime = 1200 + Math.random() * 600 // 20-30 min in seconds
            const testRatio = selectedTests / totalTestsForCommit
            const smartTime = baseTime * testRatio

            totalCurrentTime += baseTime
            totalSmartTime += smartTime
            totalTests += totalTestsForCommit
            totalSelectedTests += selectedTests
            analyzedCommits++

          }

        } catch (error) {
          console.log(`[API] Skipping commit ${headSha.substring(0, 7)}: ${error.message}`)
          continue
        }
      }

      if (analyzedCommits === 0) {
        throw new Error('No commits could be analyzed')
      }

      // Calculate averages
      const avgCurrentTime = Math.floor(totalCurrentTime / analyzedCommits)
      const avgSmartTime = Math.floor(totalSmartTime / analyzedCommits)
      const savingsPercent = Math.floor(((avgCurrentTime - avgSmartTime) / avgCurrentTime) * 100)
      const avgTests = Math.floor(totalTests / analyzedCommits)
      const avgSelected = Math.floor(totalSelectedTests / analyzedCommits)

      // Calculate monthly savings
      // Assumptions: 100 engineers, $150k avg salary, 10 commits/day, 20 work days/month
      const minutesSavedPerCommit = (avgCurrentTime - avgSmartTime) / 60
      const savingsPerDay = minutesSavedPerCommit * 10 * 100 // 10 commits, 100 engineers
      const savingsPerMonth = savingsPerDay * 20 // 20 work days
      const hourlyRate = 150000 / (52 * 40) // ~$72/hour
      const monthlySavings = Math.floor((savingsPerMonth / 60) * hourlyRate)

      // Clean up temp directory
      console.log('[API] Cleaning up...')
      await fs.rm(tempDir, { recursive: true, force: true })

      console.log('[API] Analysis complete!', {
        commits: analyzedCommits,
        savings: savingsPercent + '%'
      })

      return NextResponse.json({
        success: true,
        repo_name: repoName,
        current_time: avgCurrentTime,
        smart_time: avgSmartTime,
        savings_percent: savingsPercent,
        commits_analyzed: analyzedCommits,
        tests_total: avgTests,
        tests_avg_selected: avgSelected,
        monthly_savings: `$${monthlySavings.toLocaleString()}`,
        smart_selections: smartSelections
      })

    } catch (error) {
      // Clean up on error
      try {
        await fs.rm(tempDir, { recursive: true, force: true })
      } catch (cleanupError) {
        console.error('[API] Cleanup error:', cleanupError)
      }
      throw error
    }

  } catch (error) {
    console.error('[API] Error:', error.message)
    return NextResponse.json(
      { 
        error: 'Analysis failed', 
        message: error.message,
        details: 'Make sure the repository is public and has Python tests'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}