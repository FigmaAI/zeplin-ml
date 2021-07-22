<p align="center">
  <a href="#">
    <img alt="Zeplin ML" src="/logo.png" width="256" />
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

**Demo (Youtube)**

[![Demo](http://img.youtube.com/vi/a3jANIGk5EA/0.jpg)](https://youtu.be/a3jANIGk5EA) 


### Quick start

**Prepare `.env`**

In the project directory, you shoud add `.env` file at the root directory.
You can generate and manage your API information on your Zeplin settings.

```
REACT_APP_ZEPLIN_CLIENT_ID={{Your ID}}
REACT_APP_ZEPLIN_CLIENT_SECRET={{Your Secret}}
REACT_APP_APP_URL={{Your redirect url}}
```

**Run development mode**

After preparing environment, you can run:

```
yarn start
```

Runs the app in the development mode. on [http://localhost:3000](http://localhost:3000) 
