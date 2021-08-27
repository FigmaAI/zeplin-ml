<p align="center">
  <a href="#">
    <img alt="Zeplin ML" src="logo.png" width="256" />
  </a>
</p>
<h1 align="center">
  Zeplin ML
</h1>

<h3 align="center">
  Object detection from Zeplin projects based on machine learning
</h3>
<div align="center">
	<a href="https://github.com/dusskapark/zeplin-ml/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/dusskapark/zeplin-ml"></a>
	<a href="https://github.com/dusskapark/zeplin-ml/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/dusskapark/zeplin-ml"></a>
	<a href="https://github.com/dusskapark/zeplin-ml/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/dusskapark/zeplin-ml"></a>
</div>

## Overview

A project using [TensorFlow JS](https://www.tensorflow.org/js) to create the “spell check” of design systems, that helps designers by keep-watching numerous design elements instead of humans. The best way to illustrate this is to see it in action via the animation below:

[**Demo (Youtube)**](https://youtu.be/ec3AEtY-qEY) 

[![Demo](public/socialMediaGraphic.gif)](https://youtu.be/ec3AEtY-qEY) 


## Prerequirements 

| Item                      | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| Zeplin Dev App            | A Zeplin Dev app forms the connection between your app and Zeplin API. Create an App on the [Zeplin Developers tab](https://app.zeplin.io/profile/developer/). |
| Heroku account (optional) | [Heroku](https://www.heroku.com/) is a cloud service that lets you deploy and serve web apps. You don't need a Heroku account if you're deploying the app on another platform. |



## Customize the app and deploy it on Heroku 

Follow the below instructions to deploy your customized app using Heroku and Node.js.

### Install the app on your local machine

1. Make sure you have the following installed.

    - [Git](https://git-scm.com/)
    - [Node.js](https://nodejs.org/en/)
    - Items listed [here](#Prerequirements)

2. Clone this [line-liff-starter](https://github.com/dusskapark/zeplin-ml) GitHub repository.

    ```shell
    git clone https://github.com/dusskapark/zeplin-ml
    ```
3. `cd` into `zeplin-ml` directory.

4. Install the dependencies by running:
    ```shell
    $ yarn 
    ```

### Link your local repository to Heroku

1. Log in to Heroku from the command line.

    ```shell
    $ heroku login
    ```

2. Create a named Heroku app.

    ```shell
    $ heroku create {Heroku app name}
    ```

3. Take a note of your app's URL (`https://{Heroku app name}.herokuapp.com`). You'll need it when you add the app to LIFF.

4. Add a remote for Heroku to your local repository.

    ```shell
    $ heroku git:remote -a {Heroku app name}
    ```

### Add your app to Zeplin API

1. Follow the instructions on the page [Getting Started with Zeplin API](https://docs.zeplin.dev/docs/getting-started-with-zeplin-api).
2. Take a note of your Zeplin App ID and Secret, because you'll need it for the next part. 
3. Locate the **Developer** tab and click the **Manage details** button.
4. Enter your app's URL (`https://{Heroku app name}.herokuapp.com`) and
5. Click the **Update** button and publish the Zeplin app.

### Customize and deploy the app 

1. Set your Zeplin Client ID, Secret, RedirectUri using an environment variable.

    ```shell
    heroku config:set REACT_APP_ZEPLIN_CLIENT_ID={YOUR ZEPLIN CLINET ID}
    heroku config:set REACT_APP_ZEPLIN_CLIENT_SECRET={YOUR ZEPLIN CLINET SECRET}
    heroku config:set REACT_APP_APP_URL={YOUR APP URL}
    ```

2. Copy your environment variable into the `.env` file for local testing.

    Heroku recommends setting up an `.env` file to use an environment variable in a local environment.
    ```shell
    $ heroku config:get REACT_APP_ZEPLIN_CLIENT_ID REACT_APP_ZEPLIN_CLIENT_SECRET REACT_APP_APP_URL -s  >> .env
    ```
    **Note**: Don't commit the `.env` file to GitHub. To exclude it, add the `.env` file to your `.gitignore`.

3. Replace the `REACT_APP_APP_URL` on  `.env`  with `http://localhost:5000/` for testing locally

4. Run the app locally to preview your changes:

    ```shell
    heroku local
    ```
   View the app by browsing to [localhost:5000](http://localhost:5000/).

5. If you're happy with your changes, stage, commit, and deploy the app.

    ```shell
    $ git add .
    $ git commit -m "My first commit"
    $ git push heroku master
    ```
    
6. Browse to your app's URL (`https://{Heroku app name}.herokuapp.com`) and confirm that your app is operational. 

7. Lastly, check whether your channel status is **Published**.



### Checking logs

To get more information, you can check your app's logs using Heroku's GUI or [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

#### Check your app's logs using Heroku's GUI

To get more information, check your app's logs online:

1. In Heroku, go to [Dashboard](https://dashboard.heroku.com/).
2. Select the app you just created.
3. In the top-right corner, click **More**.
4. Click **View logs**. 

You'll find the log under **Application Logs**.

#### Check your app's logs using Heroku CLI

1. Log in to Heroku from the command line (if you haven't already).

   ```shell
   $ heroku login
   ```

2. Check the logs.

   ```shell
   $ heroku logs --app {Heroku app name} --tail
   ```




## Support Zeplin-ML

If you have a question or a suggestion or found a bug, please tell us using the [issue tracker](https://github.com/dusskapark/zeplin-ml/issues) of this project. We'd love to have your Pull Request for helping hand on `Zeplin-ML`! 



## License

This project is licensed under the terms of the [MIT](./LICENSE.md).
