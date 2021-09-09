# WEB-UI for [Vega](https://github.com/ProjectSummerTriangle/Vega)

## Building requirements

Nodejs 12.0 and above, npm 3 and above, Yarn.

## Development

Clone this repo, install dependencies.

```shell
git clone git@github.com:ProjectSummerTriangle/Altair.git
cd Altair
yarn install
```

Copy `config/dev.proxy.js.example` to `config/dev.proxy.js`, edit the configurations according to your environment.

After `yarn install` , you can use `npm <task>` to run script tasks, all task names can be found in package.json.

To start up an development server, just run `npm start`.

The backend server [Vega](https://github.com/ProjectSummerTriangle/Vega) must be started for further debugging.

## Deployment

Instead of running a development server, you should deploy a production build in production environment.

### Build

```shell
export SITE_TITLE="Your site name" # (required)
export SITE_DESCRIPTION="Your site description" # (optional) only use in <meta> in index.html.
export GA="Your Google Analytics Tracking ID" # (optional) if you want to use google analytics, export this environment variable.
export PORTAL_COVER_IMAGE="URL of the cover image in login & register page" # (required) or login & register page will have blank background.
export PORTAL_COVER_AUTHOR="Author of the cover image in login & register page" # (optional)
export PORTAL_COVER_LINK="Link of the cover image in login & register page" # (optional) url to the author's profile or the artwork page, etc.
export CHROME_EXTENSION_ID="Your chrome extension id" # (optional) if you published your Deneb browser plugin, specify its plugin ID so Altair can identify it.
yarn run build:aot:prod
```

After build process finished, you will have a `dist` directory in your project directory.

Copy all files in this directory to your website's root directory.

### Web Server Configuration

To support SPA which uses HTML5 History API, you should add some extra configuration to Nginx or other web servers.

Your web server should proxy requests with paths starting with `/api` to your backend server [Vega](https://github.com/ProjectSummerTriangle/Vega), while falling back
all other requests to /index.html which will make Altair to handle the request routes.

Here's an simple demo using Nginx.

```
# Send index.html to user regardless of their request paths.
location / {
    try_files $uri $uri/ /index.html;
}

# Proxy requests starting with "/api" to backend server (Vega).
location /api {
    proxy_pass http://vega_upstream_address;
    proxy_redirect off;
}
```

You can read more of SPA configuration here: [https://www.linkedin.com/pulse/decouple-your-single-page-app-from-backend-nginx-tom-bray](https://www.linkedin.com/pulse/decouple-your-single-page-app-from-backend-nginx-tom-bray)

### Image Resizing Support

Altair supports responsive image loading which will request a resized (usually downscaled) image by appending the image uri with `/resize-{width}-{height}`.

This feature can significantly reduce server bandwidth usage and increase content loading speed.

We assume the image service behaves as follows:

- `/resize-{width}-{height}` will return an resized image of the original one in dimension of {width}x{height}.
- `/resize-{width}-0` will return an resized image with width={width} and its ratio unchanged.
- `/resize-0-{height}` will return an resized image with height={height} and its ratio unchanged.
- without above uri suffixes will return the original image.

We recommend using [Picfit](https://github.com/thoas/picfit) and Nginx to set up the service.
