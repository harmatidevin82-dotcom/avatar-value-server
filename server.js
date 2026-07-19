const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Avatar Value Server is online!");
});

app.get("/avatar-value/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const avatarResponse = await fetch(
      `https://avatar.roblox.com/v1/users/${userId}/avatar`
    );

    const avatarData = await avatarResponse.json();

    res.json({
      userId: userId,
      avatarData: avatarData
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
