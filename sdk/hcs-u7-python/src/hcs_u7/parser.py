from __future__ import annotations

import re
from typing import Dict

from .types import HCSProfile, ModalDistribution, CognitionScores, InteractionSettings


class HCSCodeParseError(ValueError):
    """Raised when an HCS-U7 code is invalid or cannot be parsed."""


def _parse_segments(code: str) -> Dict[str, str]:
    parts = code.split("|")
    if len(parts) < 2 or not parts[0].startswith("HCS-U7"):
        raise HCSCodeParseError("Invalid HCS-U7 header")

    segments: Dict[str, str] = {}
    for seg in parts[1:]:
        if ":" in seg:
            key, value = seg.split(":", 1)
            segments[key] = value
    return segments


def _parse_modal(value: str | None) -> ModalDistribution:
    modal = ModalDistribution()
    if not value:
        return modal

    for key, num in re.findall(r"([cfm])(\d+)", value):
        val = int(num)
        if key == "c":
            modal.c = val
        elif key == "f":
            modal.f = val
        elif key == "m":
            modal.m = val
    return modal


def _parse_cognition(value: str | None) -> CognitionScores:
    scores = {"form": 0, "logic": 0, "visual": 0, "synthesis": 0, "creative": 0}
    if not value:
        return CognitionScores(**scores)

    mapping = {"F": "form", "C": "logic", "V": "visual", "S": "synthesis", "Cr": "creative"}
    for code, num in re.findall(r"([A-Z][a-z]?)(\d+)", value):
        key = mapping.get(code)
        if key:
            scores[key] = int(num)

    return CognitionScores(**scores)


def _parse_interaction(value: str | None) -> InteractionSettings:
    settings = InteractionSettings()
    if not value:
        return settings

    for part in value.split(","):
        if "=" not in part:
            continue
        raw_key, raw_val = part.split("=", 1)
        key = raw_key.strip()
        val = raw_val.strip()
        if key in {"PB", "SM", "TN"}:
            setattr(settings, key, val)
    return settings


def parse_hcs_code(code: str) -> HCSProfile:
    """Parse an HCS-U7 code into a structured HCSProfile instance."""

    trimmed = code.strip()
    if not trimmed:
        raise HCSCodeParseError("Empty HCS-U7 code")

    segments = _parse_segments(trimmed)

    version = segments.get("V", "7.0")
    algorithm = segments.get("ALG", "QS")
    element = segments.get("E", "E")
    modal = _parse_modal(segments.get("MOD"))
    cognition = _parse_cognition(segments.get("COG"))
    interaction = _parse_interaction(segments.get("INT"))
    qsig = segments.get("QSIG")
    b3 = segments.get("B3")

    return HCSProfile(
        raw_code=trimmed,
        version=version,
        algorithm=algorithm,
        element=element,
        modal=modal,
        cognition=cognition,
        interaction=interaction,
        qsig=qsig,
        b3=b3,
    )
