
const calculatePercentage = async (type /* rarity or advancament */, targetTokenAttributes, subcollectionId, targetTokenId) => {

  let percentagesArray = [];

  await fetch(`http://localhost:4000/get-all-items-collection?subcollectionId=${subcollectionId}`)
    .then(response => response.json())
    .then(data => {

      const activeItems = data.activeItems;
      let attributesPercentages = [];
      for (let i = 0; i < targetTokenAttributes.length; i++) {
        const eachTraitType = targetTokenAttributes[i].trait_type;

        activeItems.sort((a, b) => {
          const sortA = (a.attributes.find(attr => attr.trait_type == [eachTraitType]) || { value: 0 }).value;
          const sortB = (b.attributes.find(attr => attr.trait_type == [eachTraitType]) || { value: 0 }).value;
          return sortA - sortB;
        });
        attributesPercentages.push(activeItems);
      }

      for (let i = 0; i < attributesPercentages.length; i++) {
        const eachList = attributesPercentages[i];
        const index = eachList.findIndex(eachItem => eachItem.tokenId == targetTokenId);
        const percentage = (((index + 1) / eachList.length) * 100).toFixed(0);
        percentagesArray.push(percentage);
      }
    })
  return percentagesArray;

}

module.exports = { calculatePercentage }