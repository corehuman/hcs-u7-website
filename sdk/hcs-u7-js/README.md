# hcs-u7 (JavaScript / TypeScript)

Official JavaScript/TypeScript parser and utilities for the HCS-U7 cognitive profile format.

## Installation

```bash
npm install hcs-u7
# or, until the package is published on npm:
# npm install corehuman/hcs-u7-js
```

## Quick start

```ts
import { parseHCSCode } from "hcs-u7";

const profile = parseHCSCode(
  "HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f0m50|COG:F39C21V0S25Cr15|INT:PB=B,SM=M,TN=M|QSIG:00004vs07r|B3:017zazpe"
);

console.log(profile.element, profile.cognition.logic);
```

## License

MIT
