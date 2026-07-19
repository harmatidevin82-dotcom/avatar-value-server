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

    const avatarData = await avatarResponse.json();

    const assetIds = avatarData.assetIds;

    const itemResponse = await fetch(
      `https://catalog.roblox.com/v1/search/items/details?${assetIds
        .map((id) => `AssetId=${id}`)
        .join("&")}`
    );

    const itemData = await itemResponse.json();

    let totalValue = 0;
    const items = [];

    for (const item of itemData.data || []) {
      const price = item.price || item.lowestPrice || 0;

      totalValue += price;

      items.push({
        id: item.id,
        name: item.name,
        price: price
      });
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
