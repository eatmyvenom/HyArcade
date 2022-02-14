module.exports = function GetLastActions(acc) {
  if (acc.displayname == undefined) return { quest: { time: 0 }, pets: 0, dailyReward: 0, otherActions: [] };
  const actions = [];

  const allQuests = acc?.quests ?? {};

  let lastQuestTime = 0;
  let lastQuestName;

  for (const questName in allQuests) {
    const quest = allQuests[questName];

    if (quest.active) {
      actions.push(quest.active.started);
    }

    if (quest.completions && quest.completions[quest.completions.length - 1].time > lastQuestTime) {
      actions.push(quest.completions[quest.completions.length - 1].time);
      lastQuestTime = quest.completions[quest.completions.length - 1].time;
      lastQuestName = questName;
    }
  }

  const quest = { time: lastQuestTime, name: lastQuestName };

  const allPets = acc?.petStats ?? {};

  let lastPetTime = 0;

  for (const petName in allPets) {
    const pet = allPets[petName];

    const thisPetTime = Math.max(pet?.THIRST?.timestamp ?? 0, pet?.EXERCISE?.timestamp ?? 0, pet?.HUNGER?.timestamp ?? 0);

    if (thisPetTime > lastPetTime) {
      lastPetTime = thisPetTime;
    }
  }

  actions.push(
    acc?.stats?.SkyWars?.lucky_explained_last ?? 0,
    acc?.stats?.SkyWars?.tnt_madness_explained_last ?? 0,
    acc?.stats?.SkyWars?.slime_explained_last ?? 0,
    acc?.stats?.SkyWars?.rush_explained_last ?? 0,
    acc?.stats?.Pit?.profile?.last_save ?? 0,
    acc?.stats?.Pit?.profile?.last_midfight_disconnect ?? 0,
    acc?.stats?.Pit?.profile?.last_contract ?? 0,
    acc?.stats?.Pit?.profile?.genesis_allegiance_time ?? 0,
    acc?.stats?.SuperSmash?.ONE_V_JUAN_firstGame ?? 0,
    acc?.eugene?.dailyTwoKExp ?? 0,
    acc?.lastClaimedReward ?? 0,
    acc?.petJourneyTimestamp ?? 0,
  );

  const swHeads = acc?.stats?.SkyWars?.head_collection ?? {};

  if (swHeads.recent) {
    actions.push(swHeads.recent?.[swHeads.recent.length - 1]?.time ?? 0);
  }

  if (swHeads.prestigious) {
    actions.push(swHeads.prestigious?.[swHeads.prestigious.length - 1]?.time ?? 0);
  }

  if (acc?.achievementRewardsNew) {
    const rewardsArr = Object.values(acc?.achievementRewardsNew ?? {});
    actions.push(Math.max(...rewardsArr));
  }

  if (acc?.stats?.Pit?.profile?.items_last_buy) {
    actions.push(Math.max(...Object.values(acc?.stats?.Pit?.profile?.items_last_buy)));
  }

  if (Array.isArray(acc?.stats?.Pit?.profile?.ended_contracts)) {
    const times = acc?.stats?.Pit?.profile?.ended_contracts.map(c => c.completion_date);
    actions.push(Math.max(...times));
  }

  if (acc.parkourCompletions) {
    const lobbies = Object.values(acc.parkourCompletions);

    const starts = lobbies.map(l => l[0].timeStart);
    actions.push(Math.max(...starts));
  }

  return { quest, pets: lastPetTime, dailyReward: acc?.lastAdsenseGenerateTime ?? 0, otherActions: Math.max(...actions) };
};
