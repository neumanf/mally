export class ObjectUtils {
    public static filterDefinedValues(obj: object) {
        return Object.fromEntries(
            Object.entries(obj).filter(
                ([, value]) =>
                    !(value === undefined || value === null || value === ''),
            ),
        );
    }
}
