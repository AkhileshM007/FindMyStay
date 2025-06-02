pipeline {
    agent any // This means Jenkins can use any available agent/node to run this pipeline.

    environment {
        // Define any environment variables you might need globally for the pipeline
        // DOCKER_COMPOSE_FILE = 'docker-compose.yml' // Already the default
        PROJECT_ROOT_DIR = '.' // Assuming Jenkinsfile is at the root with docker-compose.yml
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from GitHub...'
                // 'checkout scm' will automatically use the SCM configured in the Jenkins job
                checkout scm
            }
        }

        stage('Build and Deploy Docker Containers') {
            steps {
                script {
                    // Ensure we are in the correct directory where docker-compose.yml exists
                    // Jenkins usually sets the workspace root correctly after 'checkout scm'.
                    // dir(env.PROJECT_ROOT_DIR) { // Use this if you explicitly need to change directory

                        echo 'Stopping existing containers (if any)...'
                        // '|| true' ensures the command doesn't fail the pipeline if no containers are running
                        sh 'docker-compose down || true'

                        echo 'Cleaning up Docker system aggressively before build attempt...'
                        // Add sudo if your jenkins user needs it to prune system-wide Docker resources.
                        // If your Jenkins user is in the docker group, sudo might not be needed for docker commands.
                        sh 'sudo docker system prune -af || true'

                        echo 'Building backend service...'
                        // Service name 'backend' comes from your docker-compose.yml
                        sh 'docker-compose build --no-cache backend'

                        echo 'Cleaning up Docker images after backend build...'
                        // Add sudo if needed
                        sh 'sudo docker image prune -af || true'

                        echo 'Building frontend service...'
                        // Service name 'frontend' comes from your docker-compose.yml
                        sh 'docker-compose build --no-cache frontend'

                        // Optional: Clean up again if you have more services or for general tidiness
                        // echo 'Cleaning up Docker images after frontend build...'
                        // sh 'sudo docker image prune -af || true' // Add sudo if needed

                        echo 'Starting new containers in detached mode...'
                        sh 'docker-compose up -d'

                        echo 'Deployment complete!'
                    // }
                }
            }
        }

        stage('Cleanup Docker (Optional)') {
            // This stage cleans up dangling images to save disk space.
            // It will only run if the 'Build and Deploy Docker Containers' stage (and 'Checkout Code') succeeded.
            steps {
                echo 'Cleaning up unused Docker images...'
                // '|| true' to prevent failure if there's nothing to prune
                // Using 'sudo' here as well, for consistency if needed for other prune commands.
                sh 'sudo docker image prune -af || true'
            }
        }
    }

    post {
        // Actions to take after the pipeline finishes, regardless of outcome
        always {
            echo 'Pipeline finished.'
            // Clean up the workspace
            cleanWs()
        }
        // Actions for successful pipeline
        success {
            echo 'Pipeline executed successfully!'
            // You could add notifications here (e.g., email, Slack)
        }
        // Actions for failed pipeline
        failure {
            echo 'Pipeline failed!'
            // You could add notifications here
        }
    }
}