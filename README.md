# Talk LiveFyre Importer

Importer of comments from LiveFyre exports.

# Getting Started
## Install
```
$ node -v
v8.x.x

$ yarn
$ git submodule update --init
$ cd services/talk
$ yarnq
```
## Config
Add a `.env` file in the project root that contains the required environment variables for the Talk installation you are migrating into.

# Data Source
Make sure you have received an export of your user and comment data from LiveFyre and saved to your local file system. These files should be in the format of newline separated JSON objects.

# Running Script

## Users
```
$ node import-users.js --file <PATH_TO_USER_DATA> --concurrency <NUMBER
```

The above command will import users into your talk instance. _This should be done before importing assets_.

## Comments (Coming Soon)

TKTKTK

## Likes (Coming Soon)

TKTKTK


## License

  Copyright 2017 Mozilla Foundation

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

  See the License for the specific language governing permissions and limitations under the License.
