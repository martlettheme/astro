export type Space = 'small' | 'regular' | 'large';
export type Tag = 'div' | 'section' | 'article' | 'nav' | 'ul' | 'ol';
export function choice(value: unknown, allowed: readonly unknown[], name: string) { if (!allowed.includes(value)) throw new TypeError(`Invalid ${name}: ${String(value)}`); }
