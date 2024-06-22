export const getFolderName = (elementName: string): string => {
    return elementName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_")
}