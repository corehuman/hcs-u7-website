# hcs-u7 (Python)

Official Python parser and utilities for the HCS-U7 cognitive profile format.

## Installation

```bash
pip install hcs-u7
# or, until the package is published on PyPI:
# pip install "git+https://github.com/corehuman/hcs-u7-python.git"
```

## Quick start

```python
from hcs_u7 import parse_hcs_code, HCSCodeParseError

code = "HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f0m50|COG:F39C21V0S25Cr15|INT:PB=B,SM=M,TN=M|QSIG:00004vs07r|B3:017zazpe"

try:
    profile = parse_hcs_code(code)
    print(profile.element, profile.cognition.logic)
except HCSCodeParseError as exc:
    print("Invalid HCS-U7 code:", exc)
```

## License

MIT
