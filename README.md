How to run:

With Docker:
```
docker build . --tag zehitomo
docker run -it -p 8080:80  -e ACCESS_KEY="KEY_GOES_HERE" zehitomo
```
This starts the docker container attached to the terminal so you can quit with ctrl-C. You can change the port by changing 8080 to something else.

Without docker:
```
cd frontend
yarn
yarn run webpack-dev-server --define process.env.UNSPLASH_API_KEY='\"KEY_GOES_HERE\"'
```

There is a live version available (here)[http://loading.digital/zehitomo]

Overview

I have opted to create just a React Redux SPA with nearly direct api requests to Unsplash. The docker image compiles the React app and starts an nginx server, hosting the app, and a simple proxy to the unsplash servers. The official nginx docker image lets you supply an nginx configuration template file which injects environment variables into the nginx configuration. This way the nginx can append the api key to your requests when you proxy then through that instance. It's not actually secure in any way since any one can make requests to the proxy endpoint, but it's better than having the api key hardcoded somewhere. If this was really a production app you could limit the proxy with some sort of authentication meant for the app like our own access token, but for this demo I didn't have time to do that.

I've decided to use TypeScript with React Redux to make this website. It's the framework I'm most familiar with and it's great for developing SPAs like this. I prefer using TypeScript, because it lets you use a few extra language features such as null coalescing operators, but mostly because type safety makes it easy to refactor your code and not make negligent errors.
I'm also using Bootstrap. It has a few useful styles and utilities that let you develop applications quickly and let those applications be relatively portable between browsers and devices. I'm not married to bootstrap but for making quick mockups like this it's definitely a great tool.

The React App uses local storage to remember favourite groups and images. Writing a server to store this information would require some sort of user id for it to be more useful that just using local storage and there wasn't enough time for this. frontend/ is the folder with the React application. The application is small, so the main reducer is in the src/index.tsx file. All of the action creators and Action definitions are in the src/Actions.ts file. They were designed with the intention of being connectable to some rest API later, so instead of dispatching immediately you could call the rest api methods for updating your user record. The state is described in src/State.ts. The src/components/ folder contains all of the components, split into separate files.

There's a display for an image, you can pass it children which will be injected into the overlay element, so that you can have different overlays on the image. I do this for groups, with the preview image, and the general image displays when you're searching or looking at a group.
