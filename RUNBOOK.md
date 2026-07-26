# RUNBOOK

Operational reference for running service-O locally on Minikube (Windows). Written from the actual sequence used to bring this project up — includes the gotchas that cost time the first time around, so they don't cost time again.

---

## Prerequisites (one-time install)

- Docker Desktop (with WSL2 backend on Windows)
- Minikube
- kubectl
- Node.js 20+ (only needed if running services outside Docker)
- k6 (for load testing) — `choco install k6` (run PowerShell as Administrator)
- ngrok (only needed for testing GitHub webhooks locally) — `choco install ngrok`

---

## 1. Cold Start — bring dev up from nothing

```powershell
# 1. Start Docker Desktop, wait for the whale icon to settle, then confirm:
docker version

# 2. Start Minikube with addons
minikube start --cpus=4 --memory=6144 --driver=docker
minikube addons enable ingress
minikube addons enable metrics-server

# 3. Point THIS terminal's Docker CLI at Minikube's internal daemon
#    (required every time you open a new terminal to build images)
minikube docker-env | Invoke-Expression      # PowerShell
# @FOR /f "tokens=*" %i IN ('minikube docker-env --shell cmd') DO @%i   # cmd

# 4. Build all 8 images
docker build -t auth-service:local ./auth-service
docker build -t movie-catalog:local ./movie-catalog
docker build -t seat-service:local ./seat-service
docker build -t booking-service:local ./booking-service
docker build -t payment-service:local ./payment-service
docker build -t notification-service:local ./notification-service
docker build -t api-gateway:local ./api-gateway
docker build -t frontend:local ./movie-frontend --build-arg NEXT_PUBLIC_API_URL=http://service-o.local:8080

# 5. Create namespace (only needed once)
kubectl create namespace dev

# 6. Create secrets (see section 2 below for the full list with real values)

# 7. Deploy
kubectl apply -k k8s/overlays/dev

# 8. Watch pods come up
kubectl get pods -n dev -w
```

---

## 2. Secrets — dev namespace

Run once per namespace. Replace every value with your real credentials (Mongo URI, JWT secret, AWS keys, internal API key — see `.env.example` in each service folder for the variable names).

```powershell
kubectl create secret generic auth-service-secret -n dev --from-literal=MONGO_URI="<value>" --from-literal=JWT_SECRET="<value>" --from-literal=INTERNAL_API_KEY="<value>"
kubectl create secret generic movie-catalog-secret -n dev --from-literal=MONGO_URI="<value>" --from-literal=AWS_ACCESS_KEY_ID="<value>" --from-literal=AWS_SECRET_ACCESS_KEY="<value>" --from-literal=AWS_S3_BUCKET_NAME="<value>"
kubectl create secret generic seat-service-secret -n dev --from-literal=MONGO_URI="<value>"
kubectl create secret generic booking-service-secret -n dev --from-literal=MONGO_URI="<value>" --from-literal=INTERNAL_API_KEY="<value>"
kubectl create secret generic payment-service-secret -n dev --from-literal=MONGO_URI="<value>" --from-literal=INTERNAL_API_KEY="<value>"
kubectl create secret generic notification-service-secret -n dev --from-literal=MONGO_URI="<value>" --from-literal=AWS_ACCESS_KEY_ID="<value>" --from-literal=AWS_SECRET_ACCESS_KEY="<value>" --from-literal=SES_FROM_EMAIL="<value>" --from-literal=INTERNAL_API_KEY="<value>"
kubectl create secret generic api-gateway-secret -n dev --from-literal=JWT_SECRET="<value>"
kubectl create secret generic grafana-secret -n dev --from-literal=admin-password="admin"
```

**For `test` and `prod`**, repeat the same 8 commands with `-n test` / `-n prod` instead of `-n dev`. Same real values across all three is fine for local demo purposes — see README's Security Notes for the caveat this implies.

```powershell
kubectl create namespace test
kubectl create namespace prod
# ...then the 8 commands above with -n test, then again with -n prod
```

---

## 3. Expose the app locally

Kubernetes Ingress + Minikube's `docker` driver on Windows can't be reached via `minikube tunnel` or the Minikube node IP directly (both are unreachable from the host in this configuration) — `kubectl port-forward` is the reliable path.

```powershell
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
```

**Leave this running in its own terminal for the entire session.** Closing it (or the terminal) breaks access immediately with `ERR_CONNECTION_REFUSED` — this is the single most common "it stopped working" cause.

Add to `C:\Windows\System32\drivers\etc\hosts` (edit as Administrator, or via elevated PowerShell):
```powershell
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "127.0.0.1  service-o.local"
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "127.0.0.1  test.service-o.local"
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "127.0.0.1  prod.service-o.local"
```

Then visit:
- `http://service-o.local:8080` (dev)
- `http://test.service-o.local:8080` (test)
- `http://prod.service-o.local:8080` (prod)

---

## 4. Jenkins

```powershell
# Start (if container already exists and is stopped)
docker start jenkins

# First-time creation only (already done once for this project)
docker run -d --name jenkins -p 8081:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts
```

Open: `http://localhost:8081`

**If GitHub webhook auto-triggering needs testing locally** (not needed for normal use — manual "Build Now" always works without this):
```powershell
ngrok http 8081
```
Copy the printed `https://....ngrok-free.dev` URL and update the webhook's Payload URL at `https://github.com/<user>/Service-O/settings/hooks` to `<ngrok-url>/github-webhook/`. Note: ngrok's free tier issues a **new random URL every restart** — the webhook URL must be updated each time this tunnel is restarted.

---

## 5. Common operations

**Rebuild one service after a code change:**
```powershell
minikube docker-env | Invoke-Expression   # if a new terminal
docker build -t seat-service:local ./seat-service
kubectl delete pod -n dev -l app=seat-service
```
(Deleting the pod forces Kubernetes to pull the freshly-built image, since `imagePullPolicy: Never` + a static tag means it won't otherwise notice the image changed.)

**Reapply manifests after a k8s YAML change:**
```powershell
kubectl apply -k k8s/overlays/dev
```

**Check logs for a service:**
```powershell
kubectl logs -n dev -l app=api-gateway --tail=100
kubectl logs -n dev -l app=api-gateway -f     # follow live
```

**Check HPA status:**
```powershell
kubectl get hpa -n dev -w
```

**Check current replica count for a deployment:**
```powershell
kubectl get deployment api-gateway -n dev -o jsonpath='{.spec.replicas}'
```

**Run a load test (see `load-test.js`):**
```powershell
kubectl create configmap k6-script -n dev --from-file=load-test.js
kubectl apply -f k8s/k6-job.yaml
kubectl logs -n dev -f job/k6-load-test
```

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ERR_CONNECTION_REFUSED` on `service-o.local:8080` | `kubectl port-forward` terminal was closed | Restart the port-forward command (section 3) |
| `docker: not found` in Jenkins console output | Jenkins' container image doesn't ship the Docker CLI | `docker exec -u root -it jenkins bash` → `apt-get update && apt-get install -y docker.io` |
| `permission denied ... docker.sock` in Jenkins | `jenkins` user isn't in the socket's owning group | Inside container: `usermod -aG root jenkins`, then `docker restart jenkins` |
| `kubectl: not found` in Jenkins | Same root cause as docker — binary not installed | Install via `curl -LO` per official kubectl install docs, `chmod +x`, move to `/usr/local/bin` |
| Jenkins `kubectl get nodes` → TLS certificate error | Minikube's cert isn't issued for `host.docker.internal` | Add `--tls-server-name=localhost` when running `kubectl config set-cluster` inside the Jenkins container |
| Ingress admission webhook: "host already defined" | Two overlays' Ingress objects claim the same host | Give each overlay (`test`, `prod`) its own host via a Kustomize patch — see `k8s/overlays/*/patches/ingress.yaml` |
| Logged in but navbar still shows "Sign In" | Cookie's `secure` flag set to `true` while serving over plain HTTP | Ensure `COOKIE_SECURE=false` in the frontend's ConfigMap for non-HTTPS environments |
| `docker build` fails pulling Google Fonts mid-build | No internet access during the build step (`next/font/google` fetches at build time) | Check connectivity, retry; long-term fix is switching to `next/font/local` with self-hosted font files |
| Docker build lands in the wrong daemon (host vs Minikube) | `minikube docker-env` wasn't re-run in a fresh terminal | Re-run the redirect command every new terminal before building |

---

## 7. Teardown

```powershell
# Stop port-forward: Ctrl+C in its terminal
# Stop Jenkins
docker stop jenkins
# Stop the whole cluster
minikube stop
# Full reset (deletes all cluster state — rarely needed)
minikube delete
```
