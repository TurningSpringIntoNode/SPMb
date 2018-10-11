
const ensureStudent = (req, res, next) => {
  console.log(req.user);
  if(req.user.getRole() !== 'Student'){
    return res.status(401).send();
  }
  next();
};

module.exports = ensureStudent;