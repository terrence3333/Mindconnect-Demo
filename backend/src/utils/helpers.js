const { format, parseISO } = require('date-fns');

exports.formatDate = (date) => {
  return format(parseISO(date), 'MMM dd, yyyy');
};

exports.formatDateTime = (date) => {
  return format(parseISO(date), 'MMM dd, yyyy h:mm a');
};

exports.calculateStreak = (checkIns) => {
  if (checkIns.length === 0) return 0;
  
  let streak = 1;
  const sortedCheckIns = checkIns.sort((a, b) => b.date - a.date);
  
  for (let i = 0; i < sortedCheckIns.length - 1; i++) {
    const current = new Date(sortedCheckIns[i].date);
    const next = new Date(sortedCheckIns[i + 1].date);
    const diffDays = Math.floor((current - next) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

exports.sanitizeUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;
  delete userObj.emailVerificationToken;
  delete userObj.emailVerificationExpire;
  return userObj;
};
