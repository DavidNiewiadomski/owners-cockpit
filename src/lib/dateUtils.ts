
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateInTimezone = (date: string | Date, tz: string, format: string = 'MMM D, YYYY h:mm A') => {
  return dayjs(date).tz(tz).format(format);
};

export const formatRelativeTime = (date: string | Date, tz: string) => {
  const now = dayjs().tz(tz);
  const targetDate = dayjs(date).tz(tz);
  const diffDays = now.diff(targetDate, 'day');
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return targetDate.format('MMM D, YYYY');
};
