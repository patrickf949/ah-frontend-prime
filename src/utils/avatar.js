export const getDefaultAvatar = (name = "User") => {
  const cleanName = encodeURIComponent((name || "User").trim() || "User");
  return `https://ui-avatars.com/api/?name=${cleanName}&background=03a9f4&color=fff&rounded=true`;
};
