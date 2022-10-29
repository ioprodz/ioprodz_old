# 🔥 ioprodz

Main repository of the ioprodz platform, holding the codebase of the different apps that power the platform.

This is a monorepo, learn more about them [here](https://monorepo.tools/)

## 👷 Working with the project

### 🔨 Pre-required tools

- Source control : [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Package & dependency managment : [yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

### 🚀 Running locally

1. cloning the project and navigating to the working directory:

   #### Http

   ```sh
   git clone https://github.com/ioprodz/ioprodz.git
   cd ioprodz
   ```

   #### SSH

   ```sh
   git clone git@github.com:ioprodz/ioprodz.git
   cd ioprodz
   ```

2. installing dependencies

   ```sh
   yarn
   ```

3. commands

   App names available :

   - `hoggar` : server
   - `icosium` : web client

   run for develoment in watch mode

   ```sh
   yarn <app-name>:dev
   ```

   run tests

   ```sh
   yarn <app-name>:test
   yarn <app-name>:test --watch # for watch mode
   ```

   run linter

   ```sh
   yarn <app-name>:lint
   yarn <app-name>:lint --fix # to autofix issues
   ```

   #### Hoggar specific commands

   generate the prisma client

   ```sh
   yarn hoggar:generate
   ```

   migrate the db schema

   ```sh
   yarn hoggar:generate
   ```

   #### Building and running for production

   build app

   ```sh
   yarn <app-name>:build
   ```

   start the build

   ```sh
   yarn <app-name>:start
   ```

#### Project commands

run linter on all apps

```sh
yarn project:dev
yarn project:dev --fix # to autofix issues
```

clean project from build files and node_modules

```sh
yarn project:clean
```

### 🖋️ Contributing to ioprodz

Please find guidelines on how to contribute in the [CONTRIBUTING](CONTRIBUTING.md) section
