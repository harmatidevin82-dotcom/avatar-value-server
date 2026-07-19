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
      `https://avatar.roblox.com/v1/users/${userId}/currently-wearing`
    );

    if (!avatarResponse.ok) {
      return res.status(404).json({
        error: "Roblox user not found"
      });
    }

    const avatarData = await avatarResponse.json();

    let totalValue = 0;
    const items = [];

    for (const assetId of avatarData.assetIds) {
      try {
        const itemResponse = await fetch(
          `https://economy.roblox.com/v2/assets/${assetId}/details`
        );

        if (!itemResponse.ok) continue;

        const item = await itemResponse.json();
        const price = item.PriceInRobux || 0;

        totalValue += price;

        items.push({
          id: assetId,
          name: item.Name,
          price: price
        });
      } catch (error) {
        console.log(`Could not load asset ${assetId}`);
      }
    }

    res.json({
      userId: userId,
      totalValue: totalValue,
      items: items
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
