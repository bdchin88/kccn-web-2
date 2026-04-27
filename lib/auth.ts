// lib/auth.ts
export const checkAdminLock = () => {
  if (typeof window === "undefined") return { isLocked: false, remaining: 0 };
  
  const now = Date.now();
  const storedLock = localStorage.getItem("admin_lock_until");
  
  if (storedLock && now < parseInt(storedLock)) {
    const remaining = Math.ceil((parseInt(storedLock) - now) / 1000);
    return { isLocked: true, remaining };
  }
  return { isLocked: false, remaining: 0 };
};

export const recordFailAttempt = () => {
  if (typeof window === "undefined") return false;

  const attempts = parseInt(localStorage.getItem("admin_pw_attempts") || "0") + 1;
  
  if (attempts >= 5) {
    localStorage.setItem("admin_lock_until", (Date.now() + 60000).toString()); // 1분 잠금
    localStorage.setItem("admin_pw_attempts", "0");
    return true; // 잠금 발생
  }
  
  localStorage.setItem("admin_pw_attempts", attempts.toString());
  return false;
};

export const resetAuthAttempts = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_pw_attempts");
  localStorage.removeItem("admin_lock_until");
};