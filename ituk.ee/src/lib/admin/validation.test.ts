import { describe, it, expect } from 'vitest';
import { validate, schemas, type ValidationResult } from './validation';

describe('validate function', () => {
    describe('required fields', () => {
        it('should fail when required field is empty', () => {
            const result = validate({ name: '' }, { name: { required: true } });
            expect(result.valid).toBe(false);
            expect(result.errors.name).toBe('See väli on kohustuslik');
        });

        it('should fail when required field is only whitespace', () => {
            const result = validate({ name: '   ' }, { name: { required: true } });
            expect(result.valid).toBe(false);
            expect(result.errors.name).toBe('See väli on kohustuslik');
        });

        it('should pass when required field has value', () => {
            const result = validate({ name: 'Test' }, { name: { required: true } });
            expect(result.valid).toBe(true);
            expect(result.errors).toEqual({});
        });
    });

    describe('minLength validation', () => {
        it('should fail when value is shorter than minLength', () => {
            const result = validate({ name: 'A' }, { name: { minLength: 2 } });
            expect(result.valid).toBe(false);
            expect(result.errors.name).toBe('Minimaalne pikkus on 2 tähemärki');
        });

        it('should pass when value meets minLength', () => {
            const result = validate({ name: 'AB' }, { name: { minLength: 2 } });
            expect(result.valid).toBe(true);
        });
    });

    describe('maxLength validation', () => {
        it('should fail when value exceeds maxLength', () => {
            const result = validate({ name: 'ABCDEF' }, { name: { maxLength: 5 } });
            expect(result.valid).toBe(false);
            expect(result.errors.name).toBe('Maksimaalne pikkus on 5 tähemärki');
        });

        it('should pass when value is within maxLength', () => {
            const result = validate({ name: 'ABCDE' }, { name: { maxLength: 5 } });
            expect(result.valid).toBe(true);
        });
    });

    describe('email validation', () => {
        it('should fail for invalid email format', () => {
            const result = validate({ email: 'invalid' }, { email: { isEmail: true } });
            expect(result.valid).toBe(false);
            expect(result.errors.email).toBe('Palun sisesta kehtiv email');
        });

        it('should fail for email without domain', () => {
            const result = validate({ email: 'test@' }, { email: { isEmail: true } });
            expect(result.valid).toBe(false);
        });

        it('should pass for valid email', () => {
            const result = validate({ email: 'test@example.com' }, { email: { isEmail: true } });
            expect(result.valid).toBe(true);
        });
    });

    describe('URL validation', () => {
        it('should fail for invalid URL', () => {
            const result = validate({ link: 'not-a-url' }, { link: { isUrl: true } });
            expect(result.valid).toBe(false);
            expect(result.errors.link).toBe('Palun sisesta kehtiv URL');
        });

        it('should pass for valid URL with https', () => {
            const result = validate({ link: 'https://example.com' }, { link: { isUrl: true } });
            expect(result.valid).toBe(true);
        });

        it('should pass for valid URL with http', () => {
            const result = validate({ link: 'http://example.com/path' }, { link: { isUrl: true } });
            expect(result.valid).toBe(true);
        });
    });

    describe('pattern validation', () => {
        it('should fail when value does not match pattern', () => {
            const result = validate(
                { handle: 'Invalid Handle' },
                { handle: { pattern: /^[a-z0-9-]+$/ } }
            );
            expect(result.valid).toBe(false);
            expect(result.errors.handle).toBe('Välja formaat ei ole korrektne');
        });

        it('should pass when value matches pattern', () => {
            const result = validate(
                { handle: 'valid-handle-123' },
                { handle: { pattern: /^[a-z0-9-]+$/ } }
            );
            expect(result.valid).toBe(true);
        });
    });

    describe('custom validation', () => {
        it('should fail when custom validation returns error', () => {
            const result = validate(
                { value: 'has space' },
                { value: { custom: (v) => v.includes(' ') ? 'Tühikud pole lubatud' : null } }
            );
            expect(result.valid).toBe(false);
            expect(result.errors.value).toBe('Tühikud pole lubatud');
        });

        it('should pass when custom validation returns null', () => {
            const result = validate(
                { value: 'no-spaces' },
                { value: { custom: (v) => v.includes(' ') ? 'Tühikud pole lubatud' : null } }
            );
            expect(result.valid).toBe(true);
        });
    });

    describe('empty optional fields', () => {
        it('should skip validation for empty non-required fields', () => {
            const result = validate(
                { email: '' },
                { email: { isEmail: true } }
            );
            expect(result.valid).toBe(true);
        });
    });
});

describe('predefined schemas', () => {
    describe('board schema', () => {
        it('should validate complete board member data', () => {
            const validData = {
                name: 'Test User',
                position: 'Esimees',
                position_en: 'Chairman',
                email: 'test@ituk.ee',
                imagePath: '/board/test.jpg',
                year: '2025/2026',
            };
            const result = validate(validData, schemas.board);
            expect(result.valid).toBe(true);
        });

        it('should fail for invalid board member email', () => {
            const invalidData = {
                name: 'Test User',
                position: 'Esimees',
                position_en: 'Chairman',
                email: 'invalid-email',
                imagePath: '/board/test.jpg',
                year: '2025/2026',
            };
            const result = validate(invalidData, schemas.board);
            expect(result.valid).toBe(false);
            expect(result.errors.email).toBeDefined();
        });
    });

    describe('timeline schema', () => {
        it('should validate complete timeline data', () => {
            const validData = {
                name: 'ITÜK asutamine',
                date: '2004-01-01',
            };
            const result = validate(validData, schemas.timeline);
            expect(result.valid).toBe(true);
        });

        it('should fail for missing timeline name', () => {
            const invalidData = {
                name: '',
                date: '2004-01-01',
            };
            const result = validate(invalidData, schemas.timeline);
            expect(result.valid).toBe(false);
            expect(result.errors.name).toBeDefined();
        });
    });

    describe('event schema', () => {
        it('should validate event with valid handle', () => {
            const validData = {
                name: 'Test Event',
                name_en: 'Test Event EN',
                handle: 'test-event',
                category: 'haridus',
            };
            const result = validate(validData, schemas.event);
            expect(result.valid).toBe(true);
        });

        it('should fail for handle with spaces', () => {
            const invalidData = {
                name: 'Test Event',
                name_en: 'Test Event EN',
                handle: 'test event',
                category: 'haridus',
            };
            const result = validate(invalidData, schemas.event);
            expect(result.valid).toBe(false);
        });
    });

    describe('sponsor schema', () => {
        it('should validate sponsor with valid URL', () => {
            const validData = {
                name: 'Test Sponsor',
                link: 'https://sponsor.com',
                imagePath: '/sponsors/test.jpg',
            };
            const result = validate(validData, schemas.sponsor);
            expect(result.valid).toBe(true);
        });

        it('should fail for invalid sponsor URL', () => {
            const invalidData = {
                name: 'Test Sponsor',
                link: 'not-a-url',
                imagePath: '/sponsors/test.jpg',
            };
            const result = validate(invalidData, schemas.sponsor);
            expect(result.valid).toBe(false);
            expect(result.errors.link).toBeDefined();
        });
    });
});
