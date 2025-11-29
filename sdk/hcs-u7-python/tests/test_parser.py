import pytest

from hcs_u7 import HCSCodeParseError, parse_hcs_code


def test_parse_full_example():
    code = (
        "HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f0m50|COG:F39C21V0S25Cr15|"
        "INT:PB=B,SM=M,TN=M|QSIG:00004vs07r|B3:017zazpe"
    )

    profile = parse_hcs_code(code)

    assert profile.version == "7.0"
    assert profile.algorithm == "QS"
    assert profile.element == "E"

    assert profile.modal.c == 50
    assert profile.modal.f == 0
    assert profile.modal.m == 50

    assert profile.cognition.form == 39
    assert profile.cognition.logic == 21
    assert profile.cognition.visual == 0
    assert profile.cognition.synthesis == 25
    assert profile.cognition.creative == 15

    assert profile.interaction.PB == "B"
    assert profile.interaction.SM == "M"
    assert profile.interaction.TN == "M"

    assert profile.qsig == "00004vs07r"
    assert profile.b3 == "017zazpe"


def test_invalid_header_raises():
    with pytest.raises(HCSCodeParseError):
        parse_hcs_code("INVALID")


def test_empty_code_raises():
    with pytest.raises(HCSCodeParseError):
        parse_hcs_code("   ")


def test_missing_optional_segments_have_defaults():
    code = "HCS-U7|V:7.0|ALG:QS|E:E"
    profile = parse_hcs_code(code)

    assert profile.modal.c == 0
    assert profile.cognition.logic == 0
