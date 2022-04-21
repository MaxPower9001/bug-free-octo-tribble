let plainRecipesActivated = false;
let collapseCrafting = true;
let itemsToCraft = [];
let itemsToCraftWithoutParents = [];

let childCount = 0;

let archs = [];
let recipesToResolve = [];

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
  itemsToCraft = [];
  itemsToCraftWithoutParents = [];
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
          return `<div onclick='addArchnemesis("${
            arch.name
          }")' class="arch tooltip">
        <span class="tooltiptext">${generateToolTip(arch.dependency)}</span>
      <div class="archText">${arch.name}</div>
  </div>`;
        }
      }
    })
    .join("");
}

function generateToolTip(dependencyList) {
  return dependencyList
    .map((dependency) => {
      return `${dependency.name}`;
    })
    .join(", ");
}

function addArchnemesis(archnemesis) {
  let uniqueArch = JSON.parse(
    JSON.stringify(archs.find((arch) => arch.name === archnemesis))
  );

  itemsToCraft.push(uniqueArch);

  reloadCraftingWindow();
}

function removeArchnemesis(archnemesisIndex) {
  itemsToDisplay.splice(archnemesisIndex, 1);

  reloadCraftingWindow();
}

function archnemesisCrafted(itemIndex) {
  console.log(`Removing index ${itemIndex}`);
  console.log(`${itemsToCraft[itemIndex].name} crafted`);
  itemsToCraft.splice(itemsToCraft.indexOf(itemIndex), 1);
  reloadCraftingWindow();
}

function archnemesisDependencyCrafted(parentIndex, childIndex) {
  console.log(`Removing dependency from ${parent.name}`);
  let parent = itemsToCraft[parentIndex];
  let child;
  if (parent.dependency.length < childIndex) {
    parent.dependency.splice(childIndex, 1);
  } else {
    for (let index = 0; index <= childIndex; index++) {
      currentDependency = parent.dependency[index];
      if (currentDependency.dependency.length > 0) {
        child = currentDependency;
      }
    }
  }

  reloadCraftingWindow();
}

function archnemesisDependencyChildCrafted(dependency, childIndex) {
  dependency.dependency.forEach((dependency) => {
    if (dependency.dependency.length === 0) {
      return dependency;
    } else {
      archnemesisDependencyChildCrafted(dependency, childIndex--);
    }
  });
}

function reloadCraftingWindow() {
  displayKey();
  if (itemsToCraft.length > 0) {
    document.getElementById("craftingNavigation").style = "visibility: visible";
    displayItemsToCraft();
  } else {
    displayEmptyCraftingList();
  }
  displayRecipeCount();
}

function displayKey() {
  if (!collapseCrafting && itemsToCraft.length > 0) {
    document.getElementById("key").innerHTML = `<div class="key">
      <div class="greenBox"></div>
      &nbsp;= Selected Recipe <br />
      <div class="blueBox"></div>
      &nbsp;= Intermediate Recipe<br />
      <div class="greyBox"></div>
      &nbsp;= Dropped Item<br />
    </div>`;
  } else {
    document.getElementById("key").innerHTML = "";
  }
}

function displayEmptyCraftingList() {
  document.getElementById(
    "toCraft"
  ).innerHTML = `Click recipes to add them to your crafting list`;
  document.getElementById("craftingNavigation").style = "visibility: hidden";
}

function displayRecipeCount() {
  let countText = "";
  collapseCrafting
    ? (countText = "Count: ")
    : (countText = "Count (without crafted): ");
  let count = 0;
  itemsToCraftWithoutParents.forEach((arch) => {
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

function displayItemsToCraft() {
  generateItemsToCraftWithoutParents();
  if (collapseCrafting) {
    displayGroupedByCount();
  } else {
    displayGroupedByParent();
  }
}
function generateItemsToCraftWithoutParents() {
  itemsToCraftWithoutParents = [];
  itemsToCraft.forEach((currentArch) => {
    let index = itemsToCraftWithoutParents.indexOf(currentArch);
    if (index === -1 && currentArch.dependency.length === 0) {
      itemsToCraftWithoutParents[
        itemsToCraftWithoutParents.push(currentArch) - 1
      ].count = 1;
    } else if (currentArch.dependency.length > 0) {
      countChildren(currentArch, itemsToCraftWithoutParents);
    } else if (currentArch.dependency.length === 0) {
      itemsToCraftWithoutParents[index].count++;
    }
  });
}
function displayGroupedByCount() {
  itemsToCraftWithoutParents.sort(sortByName);
  document.getElementById("toCraft").innerHTML =
    `<div class="break"><hr /></div>` +
    itemsToCraftWithoutParents
      .map((arch) => {
        return `<div onclick='removeArchnemesis("${itemsToCraft.indexOf(
          arch
        )}")' class="arch drop">
        <div class="archText">${arch.count}x ${arch.name}</div>
    </div>`;
      })
      .join("") +
    `<div class="break"><hr /></div>`;
}
function countChildren(arch, itemsToCraftWithoutParents) {
  let index = itemsToCraftWithoutParents.indexOf(arch);
  if (index === -1 && arch.dependency.length === 0) {
    itemsToCraftWithoutParents[
      itemsToCraftWithoutParents.push(arch) - 1
    ].count = 1;
  } else if (arch.dependency.length === 0) {
    itemsToCraftWithoutParents[index].count++;
  }
  arch.dependency.forEach((dependency) => {
    countChildren(dependency, itemsToCraftWithoutParents);
  });
}

function displayGroupedByParent() {
  sb2 = generateCraftingList(itemsToCraft);

  document.getElementById("toCraft").innerHTML = sb2;
}

function generateCraftingList(itemsToCraft) {
  let sb = "";
  for (let index = 0; index < itemsToCraft.length; index++) {
    childCount = 0;
    let currentArch = itemsToCraft[index];
    sb += `<div class="break"><hr /></div>`;
    if (currentArch.dependency.length === 0) {
      sb += `<div onclick='archnemesisCrafted("${index}")' class="arch drop first"><div class="archText">${currentArch.name}</div></div>`;
    } else if (currentArch.dependency.length > 0) {
      sb += `<div onclick='archnemesisCrafted("${index}")' class="arch parent"><div class="archText">${currentArch.name}</div></div>`;
      sb += generateCraftingListChildren(
        currentArch.dependency,
        index,
        childCount++
      );
    }
  }
  sb += `<div class="break"><hr /></div>`;

  return sb;
}

function generateCraftingListChildren(dependencyList, parentIndex, childCount) {
  let sb = "";
  dependencyList.forEach((archInList) => {
    if (archInList.dependency.length === 0) {
      childCount++;
      sb += `<div onclick='archnemesisDependencyCrafted(${parentIndex},${childCount})' class="arch drop"><div class="archText">${archInList.name}</div></div>`;
    } else {
      childCount++;
      sb += `<div onclick='archnemesisDependencyCrafted(${parentIndex},${childCount})' class="arch"><div class="archText">${archInList.name}</div></div>`;
      sb += generateCraftingListChildren(
        archInList.dependency,
        parentIndex,
        childCount
      );
    }
  });
  return sb;
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
  recipesToResolve.push(
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

  while (recipesToResolve.length > 0) {
    // get the first element and check if it can be resolved, if not put it back
    let recipe = { ...recipesToResolve[0] };
    let canBeResolved = true;

    console.log(`Checking recipe ${recipe.name}`);
    console.log(`Dependencies: ${recipe.dependency.join(", ")}`);
    recipe.dependency.forEach((dependency) => {
      if (recipesToResolve.find((recipe) => recipe.name === dependency)) {
        console.log(`Recipe ${recipe.name} cannot be resolved`);
        console.log(`Missing dependency ${dependency}`);
        canBeResolved = false;
      }
    });
    if (canBeResolved) {
      console.log(`Recipe ${recipe.name} can be resolved`);
      recipe.dependency = resolveRecipe(recipe.dependency);
      archs.push(recipe);
      recipesToResolve.shift();
      console.log(`Recipe ${recipe.name} resolved`);
    } else {
      recipesToResolve.push(recipesToResolve.shift());
    }
    console.log(`Recipes to resolve: ${recipesToResolve.length}`);
    console.log(`Resolved recipes: ${archs.length}`);
    console.log("");
  }

  function resolveRecipe(recipe) {
    let resolvedChildren = [];
    console.log(`Resolving recipe ${recipe}`);

    if (!Array.isArray(recipe)) {
      resolvedChildren.push(archs.find((arch) => arch.name === recipe));
    } else {
      recipe.forEach((dependency) => {
        let currentArch = archs.find((arch) => arch.name === dependency);
        if (!currentArch) {
          currentArch = dependency;
        }
        if (currentArch.dependency.length > 0) {
          resolvedChildren = resolvedChildren.concat(resolveRecipe(dependency));
        } else {
          resolvedChildren.push(currentArch);
        }
        console.log(`Current resolved recipes: ${resolvedChildren.join(", ")}`);
      });
    }
    return resolvedChildren;
  }
}
