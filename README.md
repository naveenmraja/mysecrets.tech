

## [MySecrets](http://mysecrets.tech)

[MySecrets](http://mysecrets.tech) is a simple diary app and a great way to record your memories. You can create an entry against any date, edit and delete it at any point in time. MySecrets provides a dashboard to view and navigate through all the entries created.

| ![6xW98N.md.png](https://iili.io/6xW98N.md.png) | ![6xWJ9I.md.png](https://iili.io/6xWJ9I.md.png) |  
|--|--|  
| ![6xVpFR.md.png](https://iili.io/6xVpFR.md.png) | ![6xVyap.md.png](https://iili.io/6xVyap.md.png) |  
|![6xWdut.md.png](https://iili.io/6xWdut.md.png)|


**Technologies Used:**

- Node.js (Express)
- React+Redux
- AWS DynamoDB
- Nginx
- Docker-compose
- Kubernetes

**To run the app in development mode :**

- Run the following command in the root directory to start up the development server :

      docker-compose -f docker-compose.dev.yml up --build  

**For Production build and deployment :**

- Create the following files in root directory :

  - **`backend-env-secrets.yml`**


		apiVersion: v1    kind: Secret    
	    metadata:    
	      name: backend-env-secrets    
	    type: Opaque    
	    stringData:    
	      EXPRESS_SESSION_SECRET: "EXPRESS_SECRET"    
	      AWS_ACCESS_KEY_ID: "AWS_ACCESS_KEY_ID"    
	      AWS_SECRET_ACCESS_KEY: "AWS_SECRET_ACCESS_KEY"    
	      AWS_REGION: "AWS_REGION"  

- Update the image names of `mysecrets-backend` and `nginx` services in `docker-compose.yml` and build the images and push it to your docker repository using the following commands

      docker-compose build --pull  
docker-compose push
- Set your gcloud project id using the following command :

      gcloud config set project $PROJECT_ID  

- Generate kubectl config using the following command :

      gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE --project $PROJECT_ID  

- Create cluster role binding to use ingress-nginx using the following command:

      kubectl create clusterrolebinding cluster-admin-binding \  
--clusterrole cluster-admin \ --user $(gcloud config get-value account)
- Install ingress-nginx :

      kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.0/deploy/static/provider/cloud/deploy.yaml  

- To deploy to gcloud, run the following command from root directory :

      kubectl apply -f ./k8s  

- You should see your resources created and the application running. To access the application, simply get the ingress service IP Address and use it in browser.