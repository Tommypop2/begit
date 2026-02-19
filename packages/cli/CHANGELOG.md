# @begit/cli

## 0.3.4

### Patch Changes

- Update all dependencies
- Updated dependencies
  - @begit/core@0.3.4

## 0.3.3

### Patch Changes

- Fix bug left in from debugging
- Updated dependencies
  - @begit/core@0.3.3

## 0.3.2

### Patch Changes

- Improve error handling in the CLI, and in the GitHub fetcher
- Updated dependencies
  - @begit/core@0.3.2

## 0.3.1

### Patch Changes

- Re-order arguments to `downloadRepo` and `downloadAndExtract`. Github fetcher is used by default
- Updated dependencies
  - @begit/core@0.3.1

## 0.3.0

### Minor Changes

- BREAKING: Use `fetchers` for fetching from git providers. These need to be provided to all calls to `downloadRepo`

### Patch Changes

- Updated dependencies
  - @begit/core@0.3.0

## 0.2.1

### Patch Changes

- Fixed issue where `fetchLatestCommit` wouldn't necessarily fetch the latest commit for the desired branch - resulting in the cache key having a different commit to the commit actually contained within the cache
- Updated dependencies
  - @begit/core@0.2.1

## 0.2.0

### Minor Changes

- Add support for fetching with GH Auth

### Patch Changes

- Updated dependencies
  - @begit/core@0.2.0

## 0.1.4

### Patch Changes

- Pass through auth_token to `fetchLatestCommit`
- Updated dependencies
  - @begit/core@0.1.5

## 0.1.3

### Patch Changes

- 40cb00b: Updated dependencies
- Updated dependencies [40cb00b]
- Updated dependencies [4f83390]
  - @begit/core@0.1.3

## 0.0.17

### Patch Changes

- Updated dependencies
  - @begit/core@0.0.19

## 0.0.15

### Patch Changes

- 84b983d: Updated packages and updated build configuration
- Updated dependencies [84b983d]
  - @begit/core@0.0.18
