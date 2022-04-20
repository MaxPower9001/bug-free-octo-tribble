let plainRecipesActivated = false;
let collapseCrafting = true;
let itemsToDisplay = [];
let itemsToCraftWithoutParents = [];

let archs = [];

let sortByName = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

fillArchnemesisRecipes();
archs.sort(sortByName);
populateRecipes();

function clearCraftingList() {
  itemsToDisplay = [];
  reloadCraftingWindow();
}

function togglePlainRecipes(event) {
  plainRecipesActivated = event.target.checked;
  if (plainRecipesActivated) {
    document.getElementById("headerRecipes").innerHTML = "Recipes & Drops";
  } else {
    document.getElementById("headerRecipes").innerHTML = "Recipes";
  }

  populateRecipes();
}

function groupByParent(event) {
  collapseCrafting = event.target.checked;
  reloadCraftingWindow();
}

function populateRecipes() {
  document.getElementById("archs").innerHTML = archs
    .map((arch) => {
      if (plainRecipesActivated || arch.dependency.length > 0) {
        if (arch.dependency.length == 0) {
          return `<div onclick='addArchnemesis("${arch.name}")' class="arch drop tooltip">
      <div class="archText">${arch.name}</div>
  </div>`;
        } else {
          return `<div onclick='addArchnemesis("${arch.name}")' class="arch tooltip">
        <span class="tooltiptext">${arch.dependency}</span>
      <div class="archText">${arch.name}</div>
  </div>`;
        }
      }
    })
    .join("");
}

function addArchnemesis(archnemesis) {
  resolveDependencies(
    archs.find((arch) => arch.name === archnemesis),
    true
  );
  reloadCraftingWindow();
}

function removeArchnemesis(archnemesisIndex) {
  itemsToDisplay.splice(archnemesisIndex, 1);

  reloadCraftingWindow();
}

function removeArchnemesisGroupedByParent(archnemesisIndex) {
  itemsToDisplay.splice(archnemesisIndex, 1);

  reloadCraftingWindow();
}

function reloadCraftingWindow() {
  if (itemsToDisplay.length > 0) {
    displayItemsToCraft();
  } else {
    displayEmptyCraftingList();
  }
  displayRecipeCount();
}

function displayItemsToCraft() {
  if (collapseCrafting) {
    displayGroupedByCount();
  } else {
    displayGroupedByParent();
  }
}

function displayEmptyCraftingList() {
  document.getElementById(
    "toCraft"
  ).innerHTML = `<h3>Click recipes to add them to your crafting list</h3>`;
}

function displayRecipeCount() {
  let countText = "";
  collapseCrafting
    ? (countText = "Count: ")
    : (countText = "Count (without crafted): ");
  let count = 0;
  itemsToDisplay.forEach((arch) => {
    if (arch.dependency.length === 0) {
      count++;
    }
  });
  if (count == 69) {
    document.getElementById("count").innerHTML = `${
      countText + count
    } (nice! still doesn't fit...)`;
  } else if (count > 64) {
    document.getElementById("count").innerHTML = `${
      countText + count
    } (doesn't fit in one inventory)`;
  } else {
    document.getElementById("count").innerHTML = `${countText + count}`;
  }
}

function displayGroupedByParent() {
  document.getElementById("toCraft").innerHTML =
    itemsToDisplay
      .map((arch, index) => {
        if (arch.dependency.length === 0) {
          return `<div onclick='removeArchnemesisGroupedByParent("${index}")' class="arch drop">
      <div class="archText">${arch.name}</div>
  </div>`;
        } else if (arch.isFirst) {
          return `<div class="break"><hr /></div><div onclick='removeArchnemesisGroupedByParent("${index}")' class="arch parent">
     <div class="archText">${arch.name}</div>
</div>`;
        } else {
          return `<div onclick='removeArchnemesisGroupedByParent("${index}")' class="arch">
    <div class="archText">${arch.name}</div>
</div>`;
        }
      })
      .join("") + `<div class="break"><hr /></div>`;
}

function displayGroupedByCount() {
  itemsToCraftWithoutParents = [];
  itemsToDisplay.forEach((currentArch) => {
    let index = itemsToCraftWithoutParents.indexOf(currentArch);
    if (index === -1 && currentArch.dependency.length === 0) {
      itemsToCraftWithoutParents[
        itemsToCraftWithoutParents.push(currentArch) - 1
      ].count = 1;
    } else if (currentArch.dependency.length === 0) {
      itemsToCraftWithoutParents[index].count++;
    }
  });
  itemsToCraftWithoutParents.sort(sortByName);
  document.getElementById("toCraft").innerHTML = itemsToCraftWithoutParents
    .map((arch) => {
      return `<div onclick='removeArchnemesis("${itemsToDisplay.indexOf(
        arch
      )}")' class="arch drop">
        <div class="archText">${arch.count}x ${arch.name}</div>
    </div>`;
    })
    .join("");
}

function resolveDependencies(currentArch, isFirst = false) {
  if (isFirst) {
    itemsToDisplay[itemsToDisplay.push(currentArch) - 1].isFirst = true;
  } else {
    itemsToDisplay.push(currentArch);
  }

  if (currentArch.dependency.length > 0) {
    currentArch.dependency.forEach((dependency) => {
      return resolveDependencies(
        archs.find((arch) => arch.name === dependency)
      );
    });
  }
}

function fillArchnemesisRecipes() {
  // Base Archnemesis
  archs.push(
    {
      name: "Arcane Buffer",
      dependency: [],
    },
    {
      name: "Berserker",
      dependency: [],
    },
    {
      name: "Bloodletter",
      dependency: [],
    },
    {
      name: "Bombardier",
      dependency: [],
    },
    {
      name: "Bonebreaker",
      dependency: [],
    },
    {
      name: "Chaosweaver",
      dependency: [],
    },
    {
      name: "Consecrator",
      dependency: [],
    },
    {
      name: "Deadeye",
      dependency: [],
    },
    {
      name: "Dynamo",
      dependency: [],
    },
    {
      name: "Echoist",
      dependency: [],
    },
    {
      name: "Flameweaver",
      dependency: [],
    },
    {
      name: "Frenzied",
      dependency: [],
    },
    {
      name: "Frostweaver",
      dependency: [],
    },
    {
      name: "Gargantuan",
      dependency: [],
    },
    {
      name: "Hasted",
      dependency: [],
    },
    {
      name: "Incendiary",
      dependency: [],
    },
    {
      name: "Juggernaut",
      dependency: [],
    },
    {
      name: "Malediction",
      dependency: [],
    },
    {
      name: "Opulent",
      dependency: [],
    },
    {
      name: "Overcharged",
      dependency: [],
    },
    {
      name: "Permafrost",
      dependency: [],
    },
    {
      name: "Sentinel",
      dependency: [],
    },
    {
      name: "Soul Conduit",
      dependency: [],
    },
    {
      name: "Steel-Infused",
      dependency: [],
    },
    {
      name: "Stormweaver",
      dependency: [],
    },
    {
      name: "Toxic",
      dependency: [],
    },
    {
      name: "Vampiric",
      dependency: [],
    }
  );

  // Archnemesis recipes
  archs.push(
    {
      name: "Assassin",
      dependency: ["Deadeye", "Vampiric"],
    },
    {
      name: "Corpse Detonator",
      dependency: ["Necromancer", "Incendiary"],
    },
    {
      name: "Corrupter",
      dependency: ["Bloodletter", "Chaosweaver"],
    },
    {
      name: "Drought Bringer",
      dependency: ["Malediction", "Deadeye"],
    },
    {
      name: "Entangler",
      dependency: ["Toxic", "Bloodletter"],
    },
    {
      name: "Executioner",
      dependency: ["Frenzied", "Berserker"],
    },
    {
      name: "Flame Strider",
      dependency: ["Flameweaver", "Hasted"],
    },
    {
      name: "Frost Strider",
      dependency: ["Frostweaver", "Hasted"],
    },
    {
      name: "Heralding Minions",
      dependency: ["Dynamo", "Arcane Buffer"],
    },
    {
      name: "Hexer",
      dependency: ["Chaosweaver", "Echoist"],
    },
    {
      name: "Ice Prison",
      dependency: ["Permafrost", "Sentinel"],
    },
    {
      name: "Magma Barrier",
      dependency: ["Incendiary", "Bonebreaker"],
    },
    {
      name: "Mana Siphoner",
      dependency: ["Consecrator", "Dynamo"],
    },
    {
      name: "Mirror Image",
      dependency: ["Echoist", "Soul Conduit"],
    },
    {
      name: "Necromancer",
      dependency: ["Bombardier", "Overcharged"],
    },
    {
      name: "Rejuvenating",
      dependency: ["Gargantuan", "Vampiric"],
    },
    {
      name: "Storm Strider",
      dependency: ["Stormweaver", "Hasted"],
    },
    {
      name: "Abberath-Touched",
      dependency: ["Flame Strider", "Frenzied", "Rejuvenating"],
    },
    {
      name: "Arakaali-Touched",
      dependency: ["Corpse Detonator", "Entangler", "Assassin"],
    },
    {
      name: "Brine King-Touched",
      dependency: ["Ice Prison", "Storm Strider", "Heralding Minions"],
    },
    {
      name: "Crystal-Skinned",
      dependency: ["Permafrost", "Rejuvenating", "Berserker"],
    },
    {
      name: "Effigy",
      dependency: ["Hexer", "Malediction", "Corrupter"],
    },
    {
      name: "Empowered Elements",
      dependency: ["Evocationist", "Steel-Infused", "Chaosweaver"],
    },
    {
      name: "Empowering Minions",
      dependency: ["Necromancer", "Executioner", "Gargantuan"],
    },
    {
      name: "Evocationist",
      dependency: ["Flameweaver", "Frostweaver", "Stormweaver"],
    },
    {
      name: "Invulnerable",
      dependency: ["Sentinel", "Juggernaut", "Consecrator"],
    },
    {
      name: "Lunaris-Touched",
      dependency: ["Invulnerable", "Frost Strider", "Empowering Minions"],
    },
    {
      name: "Shakari-Touched",
      dependency: ["Entangler", "Soul Eater", "Drought Bringer"],
    },
    {
      name: "Solaris-Touched",
      dependency: ["Invulnerable", "Magma Barrier", "Empowering Minions"],
    },
    {
      name: "Soul Eater",
      dependency: ["Soul Conduit", "Necromancer", "Echoist"],
    },
    {
      name: "Temporal Bubble",
      dependency: ["Juggernaut", "Hexer", "Arcane Buffer"],
    },
    {
      name: "Treant Horde",
      dependency: ["Toxic", "Sentinel", "Steel-Infused"],
    },
    {
      name: "Trickster",
      dependency: ["Overcharged", "Assassin", "Echoist"],
    },
    {
      name: "Tukohama-Touched",
      dependency: ["Bonebreaker", "Executioner", "Magma Barrier"],
    },
    {
      name: "Innocence-Touched",
      dependency: [
        "Lunaris-Touched",
        "Solaris-Touched",
        "Mirror Image",
        "Mana Siphoner",
      ],
    },
    {
      name: "Kitava-Touched",
      dependency: [
        "Tukohama-Touched",
        "Abberath-Touched",
        "Corrupter",
        "Corpse Detonator",
      ],
    }
  );
}
