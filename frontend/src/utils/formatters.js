import { format, parseISO, formatDistanceToNow } from 'date-fns';

export const formatters = {
  date: (date) => {
    if (!date) return '';
    return format(parseISO(date), 'MMM dd, yyyy');
  },

  dateTime: (date) => {
    if (!date) return '';
    return format(parseISO(date), 'MMM dd, yyyy h:mm a');
  },

  time: (date) => {
    if (!date) return '';
    return format(parseISO(date), 'h:mm a');
  },

  timeAgo: (date) => {
    if (!date) return '';
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
  },

  currency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  percentage: (value) => {
    return `${Math.round(value)}%`;
  },

  truncate: (text, length = 100) => {
    if (!text || text.length <= length) return text;
    return `${text.substring(0, length)}...`;
  }
};
