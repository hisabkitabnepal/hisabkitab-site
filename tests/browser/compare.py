"""Compare actual full-page Chromium captures; requires Pillow and NumPy.

Usage: python tests/browser/compare.py /absolute/path/to/verification-output
Writes full-resolution diff/overlay PNGs and a machine-readable report.
No alignment/cropping is applied to hide layout discrepancies.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

root = Path(sys.argv[1] if len(sys.argv) > 1 else "verification-output")
reference = root / "reference"
rebuilt = root / "rebuilt"
out = root / "comparison"
out.mkdir(parents=True, exist_ok=True)
report = []
for source in sorted(reference.glob("*.png")):
    target = rebuilt / source.name
    if not target.exists():
        report.append({"image": source.name, "missing": True})
        continue
    a, b = Image.open(source).convert("RGB"), Image.open(target).convert("RGB")
    size = (max(a.width, b.width), max(a.height, b.height))
    ca, cb = Image.new("RGB", size, "magenta"), Image.new("RGB", size, "magenta")
    ca.paste(a, (0, 0))
    cb.paste(b, (0, 0))
    delta = np.abs(np.asarray(ca, dtype=np.int16) - np.asarray(cb, dtype=np.int16))
    changed = delta.max(axis=2) > 16
    row = {
        "image": source.name,
        "reference_size": a.size,
        "rebuilt_size": b.size,
        "different_pixel_percent": round(float(changed.mean() * 100), 4),
        "mean_channel_difference": round(float(delta.mean()), 4),
        "identical": bool(np.all(delta == 0)),
    }
    report.append(row)
    Image.fromarray(np.clip(delta * 4, 0, 255).astype(np.uint8)).save(out / (source.stem + "-diff.png"))
    Image.blend(ca, cb, 0.5).save(out / (source.stem + "-overlay.png"))
    print(f"{source.name}: {row['different_pixel_percent']:.4f}% pixels differ >16; {a.size} vs {b.size}")
(out / "report.json").write_text(json.dumps(report, indent=2) + "\n")
missing = sum(bool(row.get("missing")) for row in report)
print(f"Compared {len(report) - missing} images; {missing} missing counterparts.")
if missing:
    sys.exit(1)
