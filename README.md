# pgw-integrations

## Overview

This repository consists of three main components:

1. [**payment-gw-lib**](#payment-gw-lib): A payment gateway integration library that unifies different payment gateways into a single interface.
2. [**api-server**](#api-server): A Node.js server built with ExpressJS to manage business logic for orders, using SQLite3 for persistent storage of order data.
3. [**sample-app**](#sample-app): A minimal front-end that demonstrates the user flow and integrates with api-server.

## Prerequisite

Before we get started, please make sure you have following:

- `Node.js` and `git` installed
- Sandbox Accounts for [Paypal](#https://developer.paypal.com/home/) and [Braintree](#https://www.braintreepayments.com/sandbox)
- Repository cloned into local directory

## Setup & Installation

### payment-gw-lib

1. Install dependencies
   ```
   cd payment-gw-lib
   npm install
   ```
2. Create `setEnvVars.js` under `src/.jest/` directory with the following
   ```
   process.env.BRAINTREE_MERCHANT_ID = "<Replace this with your merchant id>";
   process.env.BRAINTREE_PUBLIC_KEY = "<Replace this with your public key>";
   process.env.BRAINTREE_PRIVATE_KEY = "<Replace this with your private key>";
   process.env.PAYPAL_CLIENT_ID = "<Replace this with your client id>";
   process.env.PAYPAL_SECRET = "<Replace this with your secret>";
   ```
3. Run tests
   ```
   npx jest
   ```
4. Register `payment-gw-lib` package globally on your system
   ```
   npm link
   ```

### api-server

1.  Install dependencies
    ```
    cd api-server
    npm install
    ```
2.  Create `setEnvVars.js` under `src/.jest/` directory with the following

    ```
    process.env.BRAINTREE_MERCHANT_ID = "<Replace this with your merchant id>";
    process.env.BRAINTREE_PUBLIC_KEY = "<Replace this with your public key>";
    process.env.BRAINTREE_PRIVATE_KEY = "<Replace this with your private key>";
    process.env.PAYPAL_CLIENT_ID = "<Replace this with your client id>";
    process.env.PAYPAL_SECRET = "<Replace this with your secret>";
    ```

3.  Create `.env` under `./api-server/` directory with the following
    ```
    BRAINTREE_MERCHANT_ID=<Replace this with your merchant id>
    BRAINTREE_PUBLIC_KEY=<Replace this with your public key>
    BRAINTREE_PRIVATE_KEY=<Replace this with your private key>
    PAYPAL_CLIENT_ID =<Replace this with your client id>
    PAYPAL_SECRET=<Replace this with your secret>
    ```
4.  Create a symbolic link in current project to use `payment-gw-lib`
    ```
    npm link payment-gw-lib
    ```
5.  Run tests
    ```
    npx jest
    ```
6.  Run server
    ```
    npm start
    ```

## sample-app

- No installation needed, it uses CDN libraries.
- Make sure you are connected to the Internet
- You can simply open up the HTML
