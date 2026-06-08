import { roles } from "./permission.js";

const checkRole = (action) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const permission = roles[userRole];

    const Haspermission = permission.filter((task) => action.includes(task))[0];
    if (Haspermission) {
      next();
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  };
};

export default checkRole;
