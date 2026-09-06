/**
 * Joins conditional class names, skipping falsy values.
 *
 * @remarks
 * Replaces the `condition ? \`${a} ${b}\` : a` ternary that was hand-written
 * at each call site — same output, one canonical implementation.
 *
 * @param classNames - Class names or falsy values to filter out.
 * @returns The truthy class names joined with a single space.
 */
export function cx(...classNames: ReadonlyArray<string | false | null | undefined>): string {
  return classNames.filter(Boolean).join(' ')
}
