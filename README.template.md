# Begit

![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40begit%2Fcore)

A smaller and lighter degit alternative with Typescript support.

## Features

- Fast
  - Caches results by default so nothing is refetched unnecessarily
- Small
  - Only 24.9kB unpacked on [npm](https://www.npmjs.com/package/@begit/core?activeTab=readme) (22.6kB minified, bundled and gzipped with all dependencies)
- Fault-tolerant
  - Can recover from a corrupted cache file
- XDG Friendly
  - Respects [XDG directories](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
- Minimal Dependencies
  - Only has a single dependency ([tar](https://www.npmjs.com/package/tar)) for extracting the downloaded tarballs
- Flexible Fetching
  - Can fetch from different git providers. You can even provide your own fetcher!

## Begit CLI
{{cli}}
## API Reference
{{core}}