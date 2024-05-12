# Begit

A smaller and lighter degit alternative with typescript support.

## Features

- Fast
  - Caches results by default so nothing is refetched unnecessarily
- Small
  - Only 13.1kB unpacked on [npm](https://www.npmjs.com/package/@begit/core?activeTab=readme) (actual source code is more like 1.4kB minified)
- Fault-tolerant
  - Can recover from a corrupted cache file
- XDG Friendly
  - Respects [XDG directories](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
- Minimal Dependencies
  - Only has a single dependency ([tar](https://www.npmjs.com/package/tar)) for extracting the downloaded tarballs

## Begit CLI

{{cli}}

## API Reference

{{core}}
