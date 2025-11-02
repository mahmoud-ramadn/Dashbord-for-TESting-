import { MAX_IMAGE_SIZE } from "@/lib/constants"

/**
 * Reads a file and returns its content as a Data URL.
 * @param {File} file - The file to be read.
 * @returns {Promise<string>} A promise that resolves with the file content as a Data URL.
 * @throws {Error} If the file could not be read.
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onloadend = () => {
            resolve(reader.result as string)
        }

        reader.onerror = () => {
            reject(new Error("Failed to read file"))
        }

        reader.readAsDataURL(file)
    })
}

/**
 * Checks if a given file is an image.
 * @param {File} file - The file to check.
 * @returns {boolean} True if the file is an image, otherwise false.
 */
export const isImageType = (file: File): boolean => {
    if (!file) return false
    return file.type.startsWith("image/") && file.size < MAX_IMAGE_SIZE
}

/**
 * Checks if a given file is a regular file (not an image).
 * @param {File} file - The file to check.
 * @returns {boolean} True if the file is a regular file, otherwise false.
 */
export const isFileType = (file: File): boolean => {
    if (!file) return false
    return !file.type.startsWith("image/") // Return true if the file is not an image
}

/**
 * Checks if all files in a given list are of a certain type.
 * @param {FileList | File[]} files - The list of files to check.
 * @param {string} type - The type to check for. Can be "image" or "file".
 * @returns {boolean} True if all files are of the specified type, otherwise false.
 */
export const areAllValidFiles = (files: FileList | File[], type: "image" | "file"): boolean => {
    const action = type === "image" ? isImageType : isFileType
    return Array.from(files).every((file) => action(file))
}



