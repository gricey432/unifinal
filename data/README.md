# Uni Final: Data

To make it easy for people to contribute and fix courses, all the course data is stored in the repository as json files.

These are usually generated using the scrapers found in `scrapers`, and then can be hand tweaked to fix small errors.

These files are uploaded using the `syncer`, which has its own readme.

## Directory Structure

```
{institutionId}/{semesterId}/{courseCode}.json
```

### Institution ID

A unique identifier for an institution, see the root README.md for a list

### Semester ID

Usually of the format `{year}-{n}` however there may be exceptions for each institution.
See `client/config` for an explicit mapping.

## Item Structure

```
{
    message: optional<string>,
    cutoffs: optional<array<number>>,
    assessment: array<{
        name: string,
        weight: string | number,
    }>,
}
```

### Message

An optional message which will be displayed to the user for a course.
Useful for showing that a course is incalculable.

### Cutoffs

An ordered list of cutoffs for the grades at the institution this offering is from.
If this is missing, the default cutoffs for the institution will be used, see `client/config`.

### Assessment

An ordered list of objects, each representing an assessment item.

**name**: The human readable name of this assessment item, e.g. "Final Exam"

**weight**: Number out of 100 for the weight of this assessment or a string explaining the weighting e.g. "Pass/Fail" 
