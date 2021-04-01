<p align="center">
  <a href="#">
    <img alt="Zeplin Slides" src="/logo.png" width="256" />
  </a>
</p>
<h1 align="center">
  Zeplin ML
</h1>

<h3 align="center">
  Object detection from Zeplin projects based on machine learning
</h3>


## Overview

This project uses [Zeplin API](https://docs.zeplin.dev) to fetch Zeplin projects and screens and [Object Detection API](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) of [Tenserflow](https://github.com/tensorflow/tfjs) to detect UI objects in Zeplin screen.

### Available Scripts

### `.env`

In the project directory, you shoud add `.env` file at the root directory.

```
REACT_APP_ZEPLIN_CLIENT_ID={{Your ID}}
REACT_APP_ZEPLIN_CLIENT_SECRET={{Your Secret}}
REACT_APP_APP_URL={{Your redirect url}}
```


#### `yarn start`

After preparing environment, you can run:

Runs the app in the development mode. on [http://localhost:3000](http://localhost:3000) 
