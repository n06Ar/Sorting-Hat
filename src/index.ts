import meow from "meow"
import fs from "fs"
import path from "path"
import inquirer from "inquirer"
import chalk from "chalk"
const figlet = require("figlet")

import { Class, Student, SortData, Prefix } from "./type"

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

    if (flags.file) {
        // Get
        const filename: string = flags.file as string
        data = getFileData(filename)
    } else if (args.length > 0 && args[0] === "generate") {
        // FIXME: Make template file.
        return
    } else {
        // FIXME: Add No file sorting.
        return
    }

    displaySortingResult(sorting(data), data.prefixes)
};

/**
 * Get sorting settings.
 * @param filename string filename.
 * @return SortData
 */
const getFileData = (filename: string): SortData => {
    let sorting

    switch (path.extname(filename)) {
        case ".json":
            sorting = JSON.parse(fs.readFileSync(`${filename}`, "utf8"))
            break;
        case ".yml":
            break
        default:
            break
    }

    return sorting
};

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
                break
            } else if (
                // Assignment of people who cannot be divided
                sortedStudentsCount >= classes.length * classStudentNum.min &&
                classes[classRandomIndex].students.length < classStudentNum.max
            ) {
                classes[classRandomIndex].students.push(student)
                sortedStudentsCount++;
                break
            }
        }
    })

    return classes
};

/**
 *  Display Sorting Result.
 *  @param classes Class
 *  @param prefix Prefix
 */
const displaySortingResult = (classes: Class[], prefixes: Prefix[]) => {
    console.log("Result !!")
    console.log("========================")
    classes.forEach((c) => {
        console.log(c.name)
        console.log("----------------------")
        c.students.forEach((value, index) => {
            if (prefixes !== null && prefixes.length > index) {
                console.log(`${prefixes[index]}`)
            }
            console.log(`${index + 1} : ${value.name}`)
        });
        console.log("========================");
    })
}

(async () => {
    const cli = meow(
        `
    Usage
      $ sorting-hat

    Options
      --file, -f   target json file.

    Examples
      $ sorting-hat
      $ sorting-hat -f class.json
`,
        {
            flags: {
                file: {
                    type: "string",
                    alias: "f",
                },
            },
        }
    )
    main(cli.input, cli.flags)
})()
