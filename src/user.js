const KEY_USER_PROFILE = "user_profile";

export function storeUserProfile(user_profile) {
  localStorage.setItem(KEY_USER_PROFILE, JSON.stringify(user_profile));
}

export function getUserProfile() {
  var d = localStorage.getItem(KEY_USER_PROFILE);
  try {
    return JSON.parse(d);
  } catch (error) {
    return null;
  }
}
