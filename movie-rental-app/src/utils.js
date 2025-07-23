// filepath: movie-rental-app/movie-rental-app/src/utils.js

function formatDate(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function clearLocalStorage(key) {
  localStorage.removeItem(key);
}

function calculateRentalEndDate(durationInDays) {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + durationInDays);
  return formatDate(endDate);
}

export { formatDate, saveToLocalStorage, getFromLocalStorage, clearLocalStorage, calculateRentalEndDate };