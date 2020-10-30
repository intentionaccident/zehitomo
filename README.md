### How to run:

With Docker:
``` bash
docker build . --tag zehitomo
docker run -it -p 8080:80  -e ACCESS_KEY="KEY_GOES_HERE" zehitomo
```
This starts the docker container attached to the terminal so you can quit with ctrl-C. You can change the port by changing 8080 to something else.

Without docker:
``` bash
cd frontend
yarn
yarn run webpack-dev-server --define process.env.UNSPLASH_API_KEY='\"KEY_GOES_HERE\"'
```

There is a live version available [here](http://loading.digital)

### Overview

I have opted to create just a React Redux SPA with an nginx proxy to redirect api requests to Unsplash with the access key header added. This lets me obfuscate the API key without having to implement a proxy server myself. The downside is it's still not very secure since anyone can just exploit the proxy server. It would be better to gate that behind some other authentication, like a user token for the site, but there wasn't time for this.

I've decided to use TypeScript with React Redux to make this website. It's the framework I'm most familiar with and it's great for developing SPAs like this. I prefer using TypeScript, because it lets you use a few extra language features such as null coalescing operators, but mostly because type safety makes it easy to refactor your code and not make negligent errors.
I'm also using Bootstrap. It has a few useful styles and utilities that let you develop applications quickly and let those applications be relatively portable between browsers and devices. I'm not married to bootstrap but for making quick mockups like this it's definitely a great tool.

The React App uses local storage to remember favourite groups and images. Writing a server to store this information would require some sort of user id for it to be more useful that just using local storage and there wasn't enough time for this. frontend/ is the folder with the React application. The application is small, so the main reducer is in the src/index.tsx file. All of the action creators and Action definitions are in the src/Actions.ts file. They were designed with the intention of being connectable to some rest API later, so instead of dispatching immediately you could call the rest api methods for updating your user record. The state is described in src/State.ts. The src/components/ folder contains all of the components, split into separate files.

Some basic things to improve the site:
* Let you edit groups after they're created.
* Implement user login to persist data across browsers.
* Make more search options available, such as search by user.

Also the API is rate limited pretty severely at 50 requests an hour so I've made the page size as big as possible and increased the auto search timer to 2 seconds. The production tier API keys let you have 5000 requests an hour so that would be a good improvement.
