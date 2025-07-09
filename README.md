Volt Playground
This is the playground for the Volt project where we experiment with new features and ideas.

Getting Started
To get started, you need to install the dependencies and start the service.

yarn install
The service resides in the platform/services directory which means it's a part of the platform monorepo. You should find the node_modules directory in the root of the monorepo which is the platform/ directory in this case.

Other dependencies
Tesseract CLI
The Tesseract CLI is required to run the local tesseract service. Install it through Atlas command:

atlas plugin install -n tesseract
Local dev
Same as above, but you can run the service in watch mode by running:

yarn run dev
The command will spin up a Parcel web server, a local Tesseract server and a Bifrost-like proxy server to handle the requests routing. The Bifrost-like proxy will first try request with local Tesseract server and fallback to Parcel web server if it fails.

RDE (Remote Dev Environment)
Follow this guide to setup your RDE. It's very similar to your local dev environment and everything works out of the box. Just remember to install all the depenencies mentioned above in your RDE envrionemnt as well, for example, the tesseract CLI.

Project structure
src/
  - bifrost-template.tsx - The entry point for SSR bundle
  - index.tsx - The entry point for Client bundle
scripts/ - Plugins and scripts for bundling and deployment
dev-server-parcel.js - dev server script
Deployment
The platform monorepo has a built-in deployment pipeline that will trigger the deployment process when you merge into the master branch with changesets. However, the deployment pipeline is scheduled every 2 hours which is too slow for us. We will have a conversation with AFM team and see how can we improve this but in the mean time, it's recommended to manually trigger the deployment pipeline without using any changeset.

Steps:

Go to the atlassian-frontend-mirror project in Bitbucket and open its pipelines page.

Click on the Run pipeline button. Select the master branch and select custom: deploy-service-dev piepline for dev and staging deployment.

Populate the SERVICE_PACKAGE field with value @af/volt-playground and select adev for dev deployment and stg-east for staging deployment.

Click on the Run button.

Other useful links:

Platform Service Support
Tesseract Integration Guide
