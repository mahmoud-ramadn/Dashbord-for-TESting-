interface UploadResponse {
    name: string
    relativePath: string
    sizeInBytes: number
    hasReferenceInDB: boolean
    encoding: string
    mimetype: string
}
