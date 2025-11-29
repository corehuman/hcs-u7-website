from dataclasses import dataclass
from typing import Dict, Optional, Any


@dataclass
class ModalDistribution:
    c: int = 0
    f: int = 0
    m: int = 0


@dataclass
class CognitionScores:
    form: int = 0
    logic: int = 0
    visual: int = 0
    synthesis: int = 0
    creative: int = 0


@dataclass
class InteractionSettings:
    PB: Optional[str] = None
    SM: Optional[str] = None
    TN: Optional[str] = None


@dataclass
class HCSProfile:
    raw_code: str
    version: str
    algorithm: str
    element: str
    modal: ModalDistribution
    cognition: CognitionScores
    interaction: InteractionSettings
    qsig: Optional[str] = None
    b3: Optional[str] = None

    @property
    def dominant_element(self) -> str:
        """Compatibility helper used in docs: returns the elemental type (E/F/W/A)."""

        return self.element

    def to_dict(self) -> Dict[str, Any]:
        return {
            "raw_code": self.raw_code,
            "version": self.version,
            "algorithm": self.algorithm,
            "element": self.element,
            "modal": {
                "c": self.modal.c,
                "f": self.modal.f,
                "m": self.modal.m,
            },
            "cognition": {
                "form": self.cognition.form,
                "logic": self.cognition.logic,
                "visual": self.cognition.visual,
                "synthesis": self.cognition.synthesis,
                "creative": self.cognition.creative,
            },
            "interaction": {
                "PB": self.interaction.PB,
                "SM": self.interaction.SM,
                "TN": self.interaction.TN,
            },
            "qsig": self.qsig,
            "b3": self.b3,
        }
