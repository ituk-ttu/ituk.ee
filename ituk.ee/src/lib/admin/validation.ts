// Input validation for admin forms (without Zod)

export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    isUrl?: boolean;
    isEmail?: boolean;
    custom?: (value: string) => string | null;
}

export type ValidationSchema = Record<string, ValidationRule>;

// URL validation regex
const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(
    data: Record<string, string>,
    schema: ValidationSchema
): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [field, rules] of Object.entries(schema)) {
        const value = data[field] || '';

        // Required check
        if (rules.required && !value.trim()) {
            errors[field] = 'See väli on kohustuslik';
            continue;
        }

        // Skip other validations if field is empty and not required
        if (!value.trim()) continue;

        // Min length
        if (rules.minLength && value.length < rules.minLength) {
            errors[field] = `Minimaalne pikkus on ${rules.minLength} tähemärki`;
            continue;
        }

        // Max length
        if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] = `Maksimaalne pikkus on ${rules.maxLength} tähemärki`;
            continue;
        }

        // URL validation
        if (rules.isUrl && value && !urlPattern.test(value)) {
            errors[field] = 'Palun sisesta kehtiv URL';
            continue;
        }

        // Email validation
        if (rules.isEmail && value && !emailPattern.test(value)) {
            errors[field] = 'Palun sisesta kehtiv email';
            continue;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            errors[field] = 'Välja formaat ei ole korrektne';
            continue;
        }

        // Custom validation
        if (rules.custom) {
            const customError = rules.custom(value);
            if (customError) {
                errors[field] = customError;
            }
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}

// Pre-defined validation schemas for each entity type
export const schemas: Record<string, ValidationSchema> = {
    board: {
        name: { required: true, minLength: 2, maxLength: 100 },
        position: { required: true, minLength: 2 },
        position_en: { required: true, minLength: 2 },
        email: { required: true, isEmail: true },
        imagePath: { required: true },
        year: { required: true },
    },
    timeline: {
        name: { required: true, minLength: 2, maxLength: 200 },
        date: { required: true },
    },
    event: {
        name: { required: true, minLength: 2, maxLength: 100 },
        name_en: { required: true, minLength: 2, maxLength: 100 },
        handle: {
            required: true,
            pattern: /^[a-z0-9-]+$/,
            custom: (v) => v.includes(' ') ? 'Handle ei tohi sisaldada tühikuid' : null,
        },
        category: { required: true },
    },
    eventYear: {
        title: { required: true, minLength: 2 },
        title_en: { required: true, minLength: 2 },
        handle: { required: true, pattern: /^[a-z0-9-]+$/ },
        date: { required: true },
    },
    rent: {
        name: { required: true, minLength: 2 },
        name_en: { required: true, minLength: 2 },
    },
    sponsor: {
        name: { required: true, minLength: 2 },
        link: { required: true, isUrl: true },
        imagePath: { required: true },
    },
    partner: {
        name: { required: true, minLength: 2 },
        name_en: { required: true, minLength: 2 },
        link: { required: true, isUrl: true },
    },
};

// Validate with toast notification
export function validateWithToast(
    data: Record<string, string>,
    schemaName: keyof typeof schemas
): ValidationResult {
    const result = validate(data, schemas[schemaName]);
    return result;
}
