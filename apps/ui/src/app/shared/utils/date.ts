import dayjs from 'dayjs';

export class DateUtils {
    static expiresIn(expiresAt: string, format: 'humanized' | 'long'): string {
        if (format === 'humanized') {
            const expiration = dayjs(expiresAt);
            if (expiration < dayjs()) {
                return 'Expired';
            } else {
                return expiration.fromNow();
            }
        } else {
            return dayjs(expiresAt).format('MMMM D, YYYY h:mm A');
        }
    }
}
