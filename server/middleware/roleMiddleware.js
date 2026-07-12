export const isAdmin = (req,res,next)=>{
  if(req.user.role !== 'admin'){
    return res.status(403).json({
      message:"Access Denied. Admins only",
    });
  }
  next();
};

export const isCandidate = (req,res,next)=>{
  if(req.user.role!=='candidate'){
    return res.status(403).json({
      message:"Access Denied. candidate only",
    });
  }
  next();
};

export const isRecruiter = (req,res,next)=>{
  if(req.user.role!=='recruiter'){
    return res.status(403).json({
      message:"Access Denied. recruiter only",
    });
  }
  next();
};