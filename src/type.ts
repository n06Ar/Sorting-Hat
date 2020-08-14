
export interface Student {
    name: "",
    favor: {
        className:string
    }
}

export interface SortData {
    classNames: string[],
    students: Student[]
}

export interface Class {
    name: string
    students: Student[]
}
