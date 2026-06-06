pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        NODE_VERSION    = '20'
        BASE_URL        = credentials('PLAYWRIGHT_BASE_URL')
        API_BASE_URL    = credentials('PLAYWRIGHT_API_BASE_URL')
        STANDARD_USER   = credentials('PLAYWRIGHT_STANDARD_USER')
        TEST_PASSWORD   = credentials('PLAYWRIGHT_TEST_PASSWORD')
        ALLURE_RESULTS  = 'true'
        CI              = 'true'
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'smoke', 'regression', 'api', 'ui'],
            description: 'Which test suite to run'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Browser for UI tests (ignored when suite is api)'
        )
    }

    stages {

        // ── 1. Checkout ──────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.BRANCH_NAME} | Build: ${env.BUILD_NUMBER}"
            }
        }

        // ── 2. Setup ─────────────────────────────────────────────────────────
        stage('Setup') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        // ── 3. Quality Gate ──────────────────────────────────────────────────
        stage('Quality Gate') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Type Check') {
                    steps {
                        sh 'npm run type-check'
                    }
                }
            }
        }

        // ── 4. API Tests ─────────────────────────────────────────────────────
        stage('API Tests') {
            when {
                anyOf {
                    expression { params.TEST_SUITE == 'all' }
                    expression { params.TEST_SUITE == 'api' }
                    expression { params.TEST_SUITE == 'smoke' }
                    expression { params.TEST_SUITE == 'regression' }
                }
            }
            steps {
                script {
                    def grepFlag = ''
                    if (params.TEST_SUITE == 'smoke')      grepFlag = '--grep @smoke'
                    if (params.TEST_SUITE == 'regression') grepFlag = '--grep @regression'

                    sh "npx playwright test tests/api/ --project=api ${grepFlag}"
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/junit-results.xml'
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'reports/playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright API Report'
                    ])
                }
            }
        }

        // ── 5. UI Tests ──────────────────────────────────────────────────────
        stage('UI Tests') {
            when {
                anyOf {
                    expression { params.TEST_SUITE == 'all' }
                    expression { params.TEST_SUITE == 'ui' }
                    expression { params.TEST_SUITE == 'smoke' }
                    expression { params.TEST_SUITE == 'regression' }
                }
            }
            steps {
                script {
                    def grepFlag = ''
                    if (params.TEST_SUITE == 'smoke')      grepFlag = '--grep @smoke'
                    if (params.TEST_SUITE == 'regression') grepFlag = '--grep @regression'

                    sh "npx playwright test tests/ui/ --project=${params.BROWSER} ${grepFlag}"
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/junit-results.xml'
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'reports/playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright UI Report'
                    ])
                }
            }
        }

        // ── 6. Allure Report ─────────────────────────────────────────────────
        stage('Allure Report') {
            steps {
                script {
                    if (fileExists('reports/allure-results')) {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            results: [[path: 'reports/allure-results']],
                            report: 'reports/allure-report'
                        ])
                    } else {
                        echo 'No Allure results found — skipping report generation.'
                    }
                }
            }
        }
    }

    // ── Post Actions ─────────────────────────────────────────────────────────
    post {
        always {
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
        failure {
            echo "Build FAILED — check the Playwright HTML report and archived artifacts."
        }
        success {
            echo "All tests passed."
        }
    }
}
