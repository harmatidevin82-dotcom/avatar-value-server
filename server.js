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

    if (!avatarResponse.ok) {
      return res.status(404).json({
        error: "Avatar not found"
      });
    }

    const avatarData = await avatarResponse.json();

    const items = [];
    let totalValue = 0;

    for (const asset of avatarData.assets) {
      try {
        const itemResponse = await fetch(
          `https://catalog.roblox.com/v1/catalog/items/${asset.id}/details?itemType=Asset`
        );

        if (!itemResponse.ok) {
          continue;
        }

        const item = await itemResponse.json();

        let price = 0;

        if (item.price !== null && item.price !== undefined) {
          price = item.price;
        }

        if (
          item.lowestPrice !== null &&
          item.lowestPrice !== undefined
        ) {
          price = item.lowestPrice;
        }

        totalValue += price;

        items.push({
          id: asset.id,
          name: asset.name,
          price: price,
          priceStatus: item.priceStatus || "Off Sale"
        });
      } catch (error) {
        console.log(`Failed to load ${asset.name}`);
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
