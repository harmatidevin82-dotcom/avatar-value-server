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

    const itemResponse = await fetch(
      "https://catalog.roblox.com/v1/catalog/items/details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: avatarData.assetIds.map((id) => ({
            itemType: 1,
            id: id
          }))
        })
      }
    );

    const itemData = await itemResponse.json();

    let totalValue = 0;
    const items = [];

    for (const item of itemData.data || []) {
      const price = item.price || 0;

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
