import { createProfile, getProfileByUserId, updateProfile } from "../models/profileModel.js";

export const createUserProfile = async (req,res)=>{
  try{
    const {
      full_name,
      phone,
      address,
      bio,
      experience,
      education,
      skills,
      linkedin_url,
      github_url,
      portfolio_url,
      profile_photo,
    } = req.body;

    const userId = req.user.id;

    const existingProfile = await getProfileByUserId(userId);

    if (!existingProfile) {
      const profile = await createProfile(
        userId,
      full_name,
      phone,
      address,
      bio,
      experience,
      education,
      skills,
      linkedin_url,
      github_url,
      portfolio_url,
      profile_photo
      );

      res.status(201).json({
        message:"Profile Created Successfully",
        profile,
      });

    }
    else {
       return res.status(400).json({
        message: "Profile already exists",
      });
    }

  }
  catch(err){
    console.log(err);
    res.status(500).json({
      message:"Server Error",
    });
    
  }
};


export const getProfile = async (req,res) => {
  try {

    const profile = await getProfileByUserId(req.user.id)

     if (!profile) {
      res.status(404).json({
        message:"profile not Exist",
      });
     } else {
        res.status(200).json(profile);
     }

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:"Server Error",
    });
    
  }
};

export const updateUserProfile = async (req,res) => {
  try {
    const {
      full_name,
      phone,
      address,
      bio,
      experience,
      education,
      skills,
      linkedin_url,
      github_url,
      portfolio_url,
      profile_photo,
    } = req.body;

    const profile = await updateProfile(
       req.user.id,
      full_name,
      phone,
      address,
      bio,
      experience,
      education,
      skills,
      linkedin_url,
      github_url,
      portfolio_url,
      profile_photo
    );

    if (!profile) {
      res.status(404).json({
        message:"profile not Found",
      });
    } else {
       res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
    }

  } catch (error) {
    res.status(500).json({
      message:"Server Error",
    });
  }
}