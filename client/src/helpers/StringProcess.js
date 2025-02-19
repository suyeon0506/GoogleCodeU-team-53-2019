export const isThisPathTagPage = link => {
  if (link.length < 4) return false;
  const page = link.substr(0, 4);
  return page === '/tag';
};

export const isThisPathUserPage = link => {
  if (link.length < 5) return false;
  const page = link.substr(0, 5);
  return page === '/user';
};

export const isItImage = type => {
  if (type.length < 5) return false;
  const page = type.substr(0, 5);
  return page === 'image';
}