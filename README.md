# Talk Importer

Importer of comments from various exports based on provided strategies.

## Available Import Strategies

- Livefyre
- Civil

## Install

```sh
# Verify your node installation version.
$ node -v
v8.x.x

# Install dependencies.
$ yarn

# Get the current pinned commit of Talk setup as a git submodule.
$ git submodule update --init

# Install those dependencies.
$ cd services/talk
$ yarn
```

## Config

Add a `.env` file in the project root that contains the required environment
variables for the Talk installation you are migrating into.

# Data Source

Make sure you have received an export of your user and comment data from
your provider and saved to your local file system. These files should be in the
format required by the importer.

# Running Script

## Users

```
$ ./cli.js users <PATH_TO_USER_DATA> --concurrency <NUMBER>
```

The above command will import users into your Talk instance. _This should be done before importing assets_.

## Assets

```
$ ./cli.js assets <PATH_TO_ASSET_DATA> --concurrency <NUMBER>
```

The above command will import all assets in the file into Talk. _This should be done before importing comments_.

## Comments

```
$ ./cli.js comments <PATH_TO_COMMENTS_DATA> --concurrency <NUMBER>
```

The above command will import all comments in the file into Talk. _This should be done after importing assets and users_.


## Actions

**(Coming Soon)**

## License

  Copyright 2017 Mozilla Foundation

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

  See the License for the specific language governing permissions and limitations under the License.
