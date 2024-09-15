import cheerio from "cheerio";
import { favoriteGames, recentlyPlayed, currentlyPlaying, userInfo } from "../types/game";
import { extractGame } from "../utils/game";
import { queryPage } from "../utils/query-page";

async function getUserInfo(
  username: string
): Promise<userInfo | { error: string; status: number }> {
 
	const userDetails = await queryPage(`/u/${username}`, username);
  const $ = cheerio.load(userDetails);
  let userinfo: userInfo = {} as userInfo;
  userinfo.username = username;
  userinfo.profile = $("meta[property='og:image']").attr("content") || "https://backloggd.b-cdn.net/no_avatar.jpg";
  const hasBio = $("#bio-body").has("p").length === 0;
  const userBio = hasBio ? $("#bio-body").text().trim() : "Nothing here!"
  userinfo.bio = userBio;
  const favoriteGames: favoriteGames[] = [];
  const recentlyPlayed: recentlyPlayed[] = [];
  const favoritesDiv = $("#profile-favorites").children();
  const recentlyPlayedDiv = $("#profile-journal").children();
  const userStatsDiv = $("#profile-stats").children();
  const userStats: { [key: string]: number } = {};
  userStatsDiv.each((i, el) => {
    const value = $(el).children("h1").text();
    const key = $(el).children("h4").text();
    userStats[key] = parseInt(value);
  });
  favoritesDiv.each((i, el) => {
    const game = extractGame($(el));
    if (game) {
      const mostFavorite = el.attribs.class.includes("ultimate_fav");
      favoriteGames.push({ ...game, mostFavorite });
    }
  });
  recentlyPlayedDiv.each((i, el) => {
    const game = extractGame($(el));
    if (game) {
      recentlyPlayed.push({ ...game });
    }
  });

	
	const currentlyPlayingResponse = await queryPage(`/u/${username}/games/added/type:playing/`, username);
	const $currentlyPlaying = cheerio.load(currentlyPlayingResponse);
	const currentlyPlaying: currentlyPlaying[] = [];
	const currentlyPlayingHolder = $currentlyPlaying("#game-lists").children();
	currentlyPlayingHolder.each((i, el) => {
		const game = extractGame($currentlyPlaying(el));
		if (game) {
			currentlyPlaying.push({ ...game });
		}
	  });
	userinfo.favoriteGames = favoriteGames;
	userinfo.recentlyPlayed = recentlyPlayed;
	userinfo.currentlyPlaying = currentlyPlaying;
	userinfo = { ...userinfo, ...userStats };

  return userinfo;
}

export { getUserInfo };
