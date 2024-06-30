//Créditos: https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd/7091965#7091965

export function getAge(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  return monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
}

export function logoutUser() {
  sessionStorage.setItem('user', JSON.stringify({}));
  window.location = "index.html";
}

export function redirectUnauthorized(minimumAccessLevel) {
  const hasUser = JSON.parse(sessionStorage.getItem('user'));
  if (!hasUser || minimumAccessLevel <= hasUser?.accessLevel) window.location = "index.html";
}