# Demo Kubernetes + Redis

Demo práctica para clase de Arquitectura de Software - Universidad ORT Uruguay

## Arquitectura

```
┌─────────────────────────────────────────┐
│         Kubernetes Cluster              │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  App Pod 1   │    │  Redis Pod   │  │
│  │  App Pod 2   │───▶│  (Storage)   │  │
│  │  App Pod 3   │    │              │  │
│  └──────────────┘    └──────────────┘  │
│         │                               │
│    NodePort:30080                       │
└─────────────────────────────────────────┘
```

## Prerequisitos

- Docker Desktop o OrbStack
- Minikube
- kubectl

## Instalación

```bash
# Instalar minikube (macOS)
brew install minikube

# Instalar kubectl (macOS)
brew install kubectl
```

## Pasos de la Demo

### 1. Iniciar Minikube

```bash
minikube start
```

### 2. Construir la imagen Docker

```bash
# Configurar Docker para usar el daemon de minikube
eval $(minikube docker-env)

# Construir la imagen
cd app
docker build -t demo-app:1.0 .
```

### 3. Desplegar Redis

```bash
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml
```

### 4. Crear ConfigMap y Secret

```bash
kubectl apply -f k8s/app-configmap.yaml
kubectl apply -f k8s/app-secret.yaml
```

### 5. Desplegar la Aplicación

```bash
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
```

### 6. Verificar el Despliegue

```bash
# Ver todos los recursos
kubectl get all

# Ver pods en detalle
kubectl get pods -o wide

# Ver logs de un pod
kubectl logs <nombre-del-pod>

# Describir un pod
kubectl describe pod <nombre-del-pod>
```

### 7. Acceder a la Aplicación

```bash
# Obtener la URL del servicio
minikube service app-service --url

# O usar port-forward
kubectl port-forward service/app-service 8080:80
```

Visitar: http://localhost:8080

## Conceptos Demostrados

### PODs
Unidad mínima de ejecución en Kubernetes. Cada POD contiene un contenedor.

```bash
# Ver pods
kubectl get pods

# Escalar manualmente
kubectl scale deployment app-deployment --replicas=5
```

### Deployment
Gestiona el ciclo de vida de los PODs y garantiza el número de réplicas deseado.

```bash
# Actualizar imagen
kubectl set image deployment/app-deployment demo-app=demo-app:2.0

# Ver estado del rollout
kubectl rollout status deployment/app-deployment

# Historial de deployments
kubectl rollout history deployment/app-deployment
```

### Service
Expone los PODs y balancea la carga entre ellos.

```bash
# Ver servicios
kubectl get services

# Describir servicio
kubectl describe service app-service
```

### ConfigMap y Secrets
Separación de configuración del código.

```bash
# Ver configmaps
kubectl get configmap

# Ver secrets
kubectl get secrets
```

## Auto-remediación

Demostrar la auto-remediación de Kubernetes:

```bash
# Eliminar un pod
kubectl delete pod <nombre-del-pod>

# Kubernetes automáticamente creará uno nuevo
kubectl get pods
```

## Escalado Horizontal

```bash
# Escalar a 5 réplicas
kubectl scale deployment app-deployment --replicas=5

# Verificar
kubectl get pods
```

## Limpieza

```bash
# Eliminar todos los recursos
kubectl delete -f k8s/

# Detener minikube
minikube stop
```

## Comandos Útiles

```bash
# Ver todos los recursos
kubectl get all

# Ver eventos del cluster
kubectl get events

# Ejecutar comando en un pod
kubectl exec -it <pod-name> -- /bin/sh

# Ver logs en tiempo real
kubectl logs -f <pod-name>

# Describir cualquier recurso
kubectl describe <tipo> <nombre>
```

## Estructura del Proyecto

```
kubernetes-redis-demo/
├── README.md
├── app/
│   ├── index.js           # Aplicación Node.js
│   ├── package.json       # Dependencias
│   └── Dockerfile         # Imagen Docker
└── k8s/
    ├── redis-deployment.yaml    # Deployment de Redis
    ├── redis-service.yaml       # Service de Redis
    ├── app-deployment.yaml      # Deployment de la app
    ├── app-service.yaml         # Service de la app (NodePort)
    ├── app-configmap.yaml       # Configuración
    └── app-secret.yaml          # Secretos (ejemplo)
```

## Endpoints de la API

- `GET /` - Contador de visitas (almacenado en Redis)
- `GET /health` - Health check
- `GET /reset` - Resetear contador

## Troubleshooting

### Pods no inician

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### No puedo acceder a la app

```bash
# Verificar que el servicio existe
kubectl get svc

# Obtener URL del servicio
minikube service app-service --url
```

### Imagen no encontrada

```bash
# Asegurarse de usar el docker de minikube
eval $(minikube docker-env)

# Verificar imágenes
docker images | grep demo-app
```
