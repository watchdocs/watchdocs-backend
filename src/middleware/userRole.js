import Document from '../models/Document';

export default id => (req, res, next) => {
  Document.find({ id }, (err, row) => {
    const docByPosition = row.postion.find(req._decoded.user.position);
    const docByDepartment = Document.find(id).department.find(req._decoded.user.department);
    if (docByDepartment && docByPosition) {
      next();
    }
  });
};
