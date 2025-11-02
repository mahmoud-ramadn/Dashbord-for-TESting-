/**
 * Maximum allowed size for project images in bytes.
 * Equals to 2MB (2 * 1024 * 1024 bytes).
 * Used for validating project image uploads.
 * @constant
 */
export const MAX_IMAGE_SIZE = 2097152

/**
 * Default page size for pagination.
 * @constant
 */
export const DEFAULT_PAGE_SIZE = 20

/**
 * Levels of difficulty for questions.
 * @constant
 */
export enum LEVELS {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

/**
 * Map of levels to their Arabic names.
 * @constant
 */
export const LEVELS_MAP: Record<LEVELS, string> = {
    [LEVELS.EASY]: "سهل",
    [LEVELS.MEDIUM]: "متوسط",
    [LEVELS.HARD]: "صعب",
}

export enum UserSortFieldsEnum {
    CREATED_AT = "createdAt",
    NAME = "name",
}

export enum CategoryStatustype {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum UsersState {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum RolesSortFieldsEnum {
    CREATED_AT = "createdAt",
    NAME = "name",
}

export enum RoleClass {
    USER = "USER",
    BOARD_MEMBER = "BOARD_MEMBER",
}

export enum QuestionsState {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    RESTE = "",
}
