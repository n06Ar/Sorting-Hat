import meow from "meow"
import fs from "fs"
import path from "path"
import inquirer from "inquirer"
import chalk from "chalk"
import yaml from "js-yaml"
import figlet from "figlet"

import { Class, Student, SortData, Prefix, DisplayStatuses } from "./type"

/**
 * main method.
 * @param args input args.
 * @param flags option.
 */
const main = (
    args: string[],
    flags: meow.TypedFlags<any> & { [p: string]: unknown }
): void => {
    let data: SortData
    const displayStatuses: DisplayStatuses = { color: false, aa: false }

    if (flags.file) {
        // Get Object from file.
        const filename: string = flags.file as string
        data = getFileData(filename)
    } else if (args.length > 0 && args[0] === "generate") {
        // FIXME: Make template file.
        return
    } else {
        // FIXME: Add No file sorting.
        return
    }

    if (flags.aa) {
        displayStatuses.aa = true
    }

    displaySortingResult(sorting(data), data.prefixes, displayStatuses)
}

/**
 * Get sorting settings.
 * @param filename string filename.
 * @return SortData
 */
const getFileData = (filename: string): SortData => {
    let sorting

    switch (path.extname(filename)) {
        case ".json":
            sorting = JSON.parse(fs.readFileSync(filename, "utf8"))
            break
        case ".yml":
        case ".yaml":
            sorting = yaml.safeLoad(fs.readFileSync(filename, "utf8"))
            break
        default:
            break
    }

    return sorting
}

/**
 * Assign students to classes.
 * @param data
 */
const sorting = (data: SortData): Class[] => {
    const classes: Class[] = []
    const students: Student[] = []

    let sortedStudentsCount = 0

    const classStudentNum = {
        max: Math.ceil(data.students.length / data.classNames.length),
        min: Math.floor(data.students.length / data.classNames.length),
    }

    // Make classes.
    data.classNames.forEach((value) => {
        classes.push({
            name: value,
            students: [],
        })
    });

    // Favored assign.
    data.students.forEach((student) => {
        const index = classes.findIndex((c) => {
            return c.name === student.favor.className
        });
        if (index >= 0) {
            classes[index].students.push(student)
            sortedStudentsCount++;
        } else {
            students.push(student)
        }
    })

    // Normal assign.
    students.forEach((student) => {
        while (true) {
            const classRandomIndex = Math.round(
                Math.random() * (classes.length - 1)
            )

            if (
                classes[classRandomIndex].students.length < classStudentNum.min
            ) {
                classes[classRandomIndex].students.push(student)
                sortedStudentsCount++;
                break;
            } else if (
                // Assignment of people who cannot be divided
                sortedStudentsCount >= classes.length * classStudentNum.min &&
                classes[classRandomIndex].students.length < classStudentNum.max
            ) {
                classes[classRandomIndex].students.push(student)
                sortedStudentsCount++;
                break;
            }
        }
    })

    return classes
}

/**
 *  Display Sorting Result.
 *  @param classes Class Data to be classified.
 *  @param prefixes Prrefi　The prefix displayed in front of the student.
 *  @param condition
 */
const displaySortingResult = (
    classes: Class[],
    prefixes: Prefix[],
    displayStatuses: DisplayStatuses
) => {
    print("Result!!", displayStatuses.aa)

    print("================================================")
    classes.forEach((c) => {
        print(c.name, displayStatuses.aa)
        print("--------------------------------------------")
        c.students.forEach((value, index) => {
            const prefix =
                prefixes !== null && prefixes.length > index
                    ? prefixes[index]
                    : index + 1
            print(`${prefix} : ${value.name}`, displayStatuses.aa)
        });
        print("================================================")
    });
}

const print = (value: string, aa?: boolean) => {
    if (aa) {
        console.log(figlet.textSync(value, "Basic"))
    } else {
        console.log(value)
    }
};

(async () => {
    const cli = meow(
        `
    Usage
      $ sorting-hat

    Options
      --file, -f   target json file.
      --AA , -A    Output as ASCII art.

    Examples
      $ sorting-hat
      $ sorting-hat -f class.json
      $ sorting-hat -f class.yaml
`,
        {
            flags: {
                file: {
                    type: "string",
                    alias: "f",
                },
                AA: {
                    type: "boolean",
                    alias: "A",
                },
            },
        }
    )
    main(cli.input, cli.flags)
})()
