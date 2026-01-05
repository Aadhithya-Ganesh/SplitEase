const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateFullName(name) {
  if (!name || name.trim().length === 0) {
    return "Full name is required";
  }

  if (name.trim().length < 3) {
    return "Full name must be at least 3 characters";
  }

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return "Full name can only contain letters and spaces";
  }

  return null;
}

export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return "Email is required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Enter a valid email address";
  }

  return null;
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}
