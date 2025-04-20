# @begit/core

## 0.3.1

### Patch Changes

- Re-order arguments to `downloadRepo` and `downloadAndExtract`. Github fetcher is used by default

## 0.3.0

### Minor Changes

- BREAKING: Use `fetchers` for fetching from git providers. These need to be provided to all calls to `downloadRepo`

## 0.2.1

### Patch Changes

- Fixed issue where `fetchLatestCommit` wouldn't necessarily fetch the latest commit for the desired branch - resulting in the cache key having a different commit to the commit actually contained within the cache

## 0.2.0

### Minor Changes

- Add support for fetching with GH Auth

## 0.1.5

### Patch Changes

- Pass through auth_token to `fetchLatestCommit`

## 0.1.3

### Patch Changes

- 40cb00b: Updated dependencies
- 4f83390: Allow setting GH auth token from javascript API

## 0.0.19

### Patch Changes

- Support setting `BEGIT_GH_API_KEY` for fetching commits from the github API

## 0.0.18

### Patch Changes

- 84b983d: Updated packages and updated build configuration
