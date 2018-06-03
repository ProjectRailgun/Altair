## Building

Nodejs 8.0 and above, npm and Yarn

## Development

Clone this repo, install dependencies

```shell
git clone git@github.com:ProjectSummerTriangle/Altair.git
cd Altair
yarn install
```

Copy `config/dev.proxy.js.example` to `config/dev.proxy.js`, If your backend server is running on a different host, you need update the target to your backend host

once npm installation is done, using npm script to run some task, all script can be found in package.json

to start up an dev server, run `npm start` in current directory.

the backend server aka [Vega](https://github.com/ProjectSummerTriangle/Vega) server must be started.

## Deployment

To deploy on production server, a compiled and minfied bundle is needed, to build this project, just run the following command.

```shell
export SITE_TITLE="Your site name"
export GA="You google analytics Tracking ID" # if you want to use google analytics, export this environment variable.
export CHROME_EXTENSION_ID=your chrome extension id # when you want user to bind Bangumi account, you should publish Sadr project for your domain, and give the id here.
yarn run build:aot:prod
```

After building process finished, you will have a **dist** directory in your project root. copy this project to your static site root directory.

### Nginx Configuration for SPA

To support SPA which using HTML5 History API. there are a little configuration need be done in Nginx or other your HTTP static server. Here we will
demonstrate with Nginx.

You can also see other reference for this common case: [https://www.linkedin.com/pulse/decouple-your-single-page-app-from-backend-nginx-tom-bray](https://www.linkedin.com/pulse/decouple-your-single-page-app-from-backend-nginx-tom-bray)

You need fallback all request except the path start with /api to /index.html which will make the SPA be able to handle the route in browser.

```
location / {
    try_files $uri $uri/ /index.html;
}

# Proxy requests to "/auth" and "/api" to the server.
location /api {
    proxy_pass http://application_upstream;
    proxy_redirect off;
}
```

### Image Thumbnail Support

We support responsive image feature which will request a resize image by appending uri with `/resize-{width}-{height}`.
This will significantly reduce the network usage and increase the loading performance.

We assume the image service support the following method:

- /resize-{width}-{height} will return a image in dimension of {width}x{height} which is a resize version of original image.
- /resize-{width}-0 will return an image with a resize width but keeping the ratio of height.
- /resize-0-{height} will return an image with a resize height but keeping the ratio of width.
- without the /resize-{width}-{height} uri suffix will return the original image.

We recommend [Picfit](https://github.com/thoas/picfit) and nginx to achieve this feature.
