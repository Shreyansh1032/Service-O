pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                    docker build -t auth-service:local ./auth-service
                    docker build -t movie-catalog:local ./movie-catalog
                    docker build -t seat-service:local ./seat-service
                    docker build -t booking-service:local ./booking-service
                    docker build -t payment-service:local ./payment-service
                    docker build -t notification-service:local ./notification-service
                    docker build -t api-gateway:local ./api-gateway
                    docker build -t frontend:local ./movie-frontend --build-arg NEXT_PUBLIC_API_URL=http://service-o.local:8080
                '''
            }
        }

        stage('Deploy to Dev') {
            steps {
                sh 'kubectl apply -k k8s/overlays/dev'
            }
        }

        stage('Deploy to Test') {
            steps {
                sh 'kubectl apply -k k8s/overlays/test'
            }
        }

        stage('Approve Production Deploy') {
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
            }
        }

        stage('Deploy to Prod') {
            steps {
                sh 'kubectl apply -k k8s/overlays/prod'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}