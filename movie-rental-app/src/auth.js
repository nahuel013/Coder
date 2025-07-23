function register(username, password) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(u => u.username === username)) {
    return false; 
  }
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

function login(username, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem('currentUser');
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function isLoggedIn() {
  return !!getCurrentUser();
}

export { register, login, logout, getCurrentUser, isLoggedIn };