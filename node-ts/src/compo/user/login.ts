import User from "../../model/user.js";

const userlogin = async (req: any, res: any) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username && !email) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    const checkUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!checkUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const passwordMatch = await checkUser.isPasswordCorrect(password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    // Generate tokens
    const accessToken = await checkUser.generateAccessToken();
   
    const refreshToken = await checkUser.generateRefreshToken();
    
    // Save refresh token in DB
    checkUser.refreshToken = refreshToken;
    await checkUser.save({ validateBeforeSave: false });

    // Remove sensitive fields
    const userView = await User.findById(checkUser._id).select(
      "-password -refreshToken"
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true, // set to true in production with HTTPS
    };

    return res
      .status(200)
      .cookie("AccessToken", accessToken, cookieOptions)
      .cookie("RefreshToken", refreshToken, cookieOptions)
      .cookie("user", userView?.username, {
    httpOnly: true,   // safer if you don’t need frontend JS to read it
    secure: false,    // set true in production with HTTPS
    sameSite: "strict"
  })
      .json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: userView,
      });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default userlogin;
