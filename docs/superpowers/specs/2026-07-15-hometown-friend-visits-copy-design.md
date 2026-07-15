# Hometown Friend Visits Copy Design

## Goal

Add the current friend-visit limitation to the beginning of the Hometown concept.

## Approved change

Prepend this exact sentence to `USE_CASE_1.problem.intro`, followed by one space:

> Friend visits currently display the friend’s active Village and offer no interaction.

Keep the complete existing Hometown concept copy immediately after it, unchanged.

## Scope

- Modify only the Hometown concept intro and its regression test.
- Preserve the existing paragraph structure, rendering, typography, and spacing.
- Do not modify other feature copy, prototype files, or demo files.

## Verification

- Assert that the rendered Hometown concept begins with the exact new sentence.
- Assert that the complete previous intro follows it unchanged.
- Run the focused assignment suite, full suite, and production build.
