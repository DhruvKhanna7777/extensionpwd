# Reuse, attribution and sign-data requirements

## Bundled materials

| Material | Source | Notice |
|---|---|---|
| Atkinson Hyperlegible Regular | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/atkinsonhyperlegible) | `assets/fonts/AtkinsonHyperlegible-OFL.txt` |
| Lexend variable font | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/lexend) | `assets/fonts/Lexend-OFL.txt` |
| OpenDyslexic Regular | [Upstream archived source](https://github.com/antijingoist/opendyslexic) | `assets/fonts/OpenDyslexic-OFL.txt` |
| svg-path-parser 1.1.0 | [Upstream source](https://github.com/hughsk/svg-path-parser) / locked npm package | MIT notice at `assets/notices/svg-path-parser-LICENSE.txt` |

Font files are unmodified. `assets/fonts/provenance.json` records pinned source revisions, download URLs and SHA-256 values. The font notices, provenance and parser notice are included in the production allowlist. These licences do not choose a distribution licence for AbleVerse's own code; that remains an owner decision.

Font licence files are checked out with LF line endings to preserve their pinned upstream bytes on Windows. The build verifies all six font/notice hashes before copying them; a mismatch fails packaging instead of shipping inconsistent provenance. Upstream licence whitespace is retained intentionally.

The supplied Stitch ZIP is a UI reference containing a Markdown frontend specification, sample state and SVG components. Its visual language was adapted onto real application state; its static charts, active counts, simulated notifications and unimplemented switches were not treated as verified behavior. The private reference PDF and ZIP are not committed to Git.

## AI reuse researched

[simply-simplify-language](https://github.com/machinelearningZH/simply-simplify-language) is an MIT-licensed full application, but still needs model/provider setup. No source from it was copied. This extension instead integrates the existing [Ollama runtime](https://github.com/ollama/ollama) through its documented local API, with a small local adapter. Ollama binaries/models are not redistributed here. Each model has separate terms; see OPTIONAL-AI.md.

## ASL: data is still required

No approved sign clips are shipped. The loader rejects missing attribution/review fields, unsupported licences, remote media URLs and traversal paths. Supported licence IDs in this development loader are CC0-1.0, CC-BY-4.0 and CC-BY-SA-4.0; actual permission and compliance must still be checked by a reviewer. A metadata field claiming approval is not proof of rights.

Research found [ASL-LEX's download page](https://asl-lex.org/download.html), whose open database licence expressly excludes reference videos, and [PopSign's published dataset information](https://signdata.cc.gatech.edu/view/datasets/popsign_v2_1/index.html), which states CC BY 4.0 but whose download site timed out during this session. PopSign's game-code MIT licence alone was not treated as proof of the rights to every video. No clips were copied from these candidates.

Before adding real entries:

1. Obtain original clips and record redistribution permission, source URL, licence and required attribution. Confirm rights apply to the video, not only its index/code.
2. Have an appropriate linguistic/source reviewer verify the headword, meaning/sense and ASL identity. Record `reviewedBy`, `reviewStatus: approved` and `updatedAt`.
3. Add entries to the curated catalog in `src/signs.ts`: `id`, `headword`, `sense`, `language: ASL`, `clipPath`, `sourceName`, `sourceUrl`, `licence`, `attribution`, `reviewStatus`, `reviewedBy`, `updatedAt`.
4. Use local `signs/<filename>.mp4` or `.webm` media; update the build copy step and exact manifest shipping resources/allowlist, including all notices. The current empty catalog deliberately has no media-copy step.
5. Test multiple senses, exact hits, misses, missing/offline media, keyboard playback, Escape, navigation and attribution. Only then add the A9 word-hover/anchored/pinnable card and its arbitration with hover speech.

Credit alone is not substituted for permission. Never generate guessed sign motions, label fingerspelling as sentence translation, or mark synthetic test entries as real shipped clips.
