/**
 * Student Interface
 * This interface has Student's name and class name of favor.
 */
export interface Student {
    name: "";
    favor: {
        className: string;
    };
}

/**
 * Prefix is
 */
export type Prefix = string;

/**
 * SortData has output data.
 */
export interface SortData {
    classNames: string[];
    students: Student[];
    prefixes: Prefix[];
}

/**
 * Class Data
 */
export interface Class {
    name: string;
    students: Student[];
}
