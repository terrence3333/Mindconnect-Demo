export const validators = {
  email: (value) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },

  password: (value) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return null;
  },

  required: (value) => {
    return value && value.trim() ? null : 'This field is required';
  },

  phone: (value) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(value) ? null : 'Please enter a valid phone number';
  },

  minLength: (min) => (value) => {
    return value.length >= min ? null : `Must be at least ${min} characters`;
  },

  maxLength: (max) => (value) => {
    return value.length <= max ? null : `Must not exceed ${max} characters`;
  }
};
