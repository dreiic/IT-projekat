-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2025 at 12:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gamrate`
--

-- --------------------------------------------------------

--
-- Table structure for table `igra`
--

CREATE TABLE `igra` (
  `id` int(11) NOT NULL,
  `naziv` varchar(100) DEFAULT NULL,
  `zanr` varchar(50) DEFAULT NULL,
  `slika_url` text DEFAULT NULL,
  `kupi_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `igra`
--

INSERT INTO `igra` (`id`, `naziv`, `zanr`, `slika_url`, `kupi_url`) VALUES
(335, 'The Witcher 3', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg', 'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/'),
(336, 'Cyberpunk 2077', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg', 'https://store.steampowered.com/app/1091500/Cyberpunk_2077/'),
(337, 'Elden Ring', 'Action RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg', 'https://store.steampowered.com/app/1245620/ELDEN_RING/'),
(338, 'Counter-Strike: Global Offensive', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_600x900.jpg', 'https://store.steampowered.com/app/730/Counter-Strike_Global_Offensive/'),
(339, 'Minecraft', 'Sandbox', 'https://assets-prd.ignimgs.com/2021/12/14/minecraft-1639513933156.jpg', 'https://store.steampowered.com/app/252490/Minecraft/'),
(340, 'FIFA 23', 'Sports', 'https://m.media-amazon.com/images/M/MV5BODdjODAyMTAtMDlkYS00ZDE3LWI4MTQtZDc1ZjY1YzQ5MzU2XkEyXkFqcGc@._V1_.jpg', 'https://store.steampowered.com/app/1506830/FIFA_23/'),
(341, 'Valorant', 'Shooter', 'https://cdn.cloudflare.steamstatic.com/steam/apps/8850/library_600x900.jpg', 'https://playvalorant.com/'),
(342, 'Assassin\'s Creed Valhalla', 'Adventure', 'https://upload.wikimedia.org/wikipedia/en/f/ff/Assassin%27s_Creed_Valhalla_cover.jpg', 'https://store.steampowered.com/app/1096920/Assassins_Creed_Valhalla/'),
(343, 'League of Legends', 'MOBA', 'https://i0.wp.com/highschool.latimes.com/wp-content/uploads/2021/09/league-of-legends.jpeg?fit=1607%2C895&ssl=1', 'https://na.leagueoflegends.com/'),
(344, 'Hollow Knight', 'Metroidvania', 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg', 'https://store.steampowered.com/app/367520/Hollow_Knight/'),
(345, 'Stardew Valley', 'Simulation', 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg', 'https://store.steampowered.com/app/413150/Stardew_Valley/'),
(346, 'Among Us', 'Party', 'https://cdn.cloudflare.steamstatic.com/steam/apps/945360/library_600x900.jpg', 'https://store.steampowered.com/app/945360/Among_Us/'),
(347, 'Dota 2', 'MOBA', 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/library_600x900.jpg', 'https://store.steampowered.com/app/570/Dota_2/'),
(348, 'Overwatch', 'Shooter', 'https://upload.wikimedia.org/wikipedia/en/5/51/Overwatch_cover_art.jpg', 'https://playoverwatch.com/'),
(349, 'Cuphead', 'Platformer', 'https://cdn.cloudflare.steamstatic.com/steam/apps/268910/library_600x900.jpg', 'https://store.steampowered.com/app/268910/Cuphead/'),
(351, 'Dead Cells', 'Roguelike', 'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/library_600x900.jpg', 'https://store.steampowered.com/app/588650/Dead_Cells/'),
(352, 'Sekiro: Shadows Die Twice', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/library_600x900.jpg', 'https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice_Collectors_Edition/'),
(354, 'Terraria', 'Sandbox', 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/library_600x900.jpg', 'https://store.steampowered.com/app/105600/Terraria/'),
(355, 'Fall Guys', 'Battle Royale', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/library_600x900.jpg', 'https://store.steampowered.com/app/1097150/Fall_Guys/'),
(356, 'Dark Souls III', 'Action RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/library_600x900.jpg', 'https://store.steampowered.com/app/374320/DARK_SOULS_III/'),
(357, 'Rainbow Six Siege', 'Tactical Shooter', 'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/library_600x900.jpg', 'https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/'),
(358, 'Portal 2', 'Puzzle', 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_600x900.jpg', 'https://store.steampowered.com/app/620/Portal_2/'),
(359, 'The Last of Us Part II', 'Action', 'https://upload.wikimedia.org/wikipedia/en/4/4f/TLOU_P2_Box_Art_2.png', 'https://store.playstation.com/en-us/product/UP9000-CUSA03585_00-THELASTOFUSPARTII'),
(360, 'Mass Effect Legendary Edition', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1328670/library_600x900.jpg', 'https://store.steampowered.com/app/1328670/Mass_Effect_Legendary_Edition/'),
(361, 'Celeste', 'Platformer', 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/library_600x900.jpg', 'https://store.steampowered.com/app/504230/Celeste/'),
(362, 'Firewatch', 'Adventure', 'https://cdn.cloudflare.steamstatic.com/steam/apps/383870/library_600x900.jpg', 'https://store.steampowered.com/app/383870/Firewatch/'),
(363, 'The Elder Scrolls V: Skyrim', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/72850/library_600x900.jpg', 'https://store.steampowered.com/app/72850/The_Elder_Scrolls_V_Skyrim/'),
(364, 'Metro Exodus', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/412020/library_600x900.jpg', 'https://store.steampowered.com/app/412020/Metro_Exodus/'),
(365, 'Bioshock Infinite', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/8870/library_600x900.jpg', 'https://store.steampowered.com/app/8870/BioShock_Infinite/'),
(367, 'Dark Souls II', 'Action RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/335300/library_600x900.jpg', 'https://store.steampowered.com/app/335300/DARK_SOULS_II/'),
(368, 'Fallout 4', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/377160/library_600x900.jpg', 'https://store.steampowered.com/app/377160/Fallout_4/'),
(369, 'Persona 5 Royal', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1328670/library_600x900.jpg', 'https://store.playstation.com/en-us/product/UP1004-CUSA13677_00-PERSONA5ROYAL000'),
(370, 'Dead by Daylight', 'Horror', 'https://cdn.cloudflare.steamstatic.com/steam/apps/381210/library_600x900.jpg', 'https://store.steampowered.com/app/381210/Dead_by_Daylight/'),
(371, 'Resident Evil Village', 'Horror', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/library_600x900.jpg', 'https://store.steampowered.com/app/1196590/Resident_Evil_Village/'),
(372, 'Assassin\'s Creed Odyssey', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/812140/library_600x900.jpg', 'https://store.steampowered.com/app/812140/Assassins_Creed_Odyssey/'),
(373, 'Monster Hunter World', 'Action RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/library_600x900.jpg', 'https://store.steampowered.com/app/582010/Monster_Hunter_World/'),
(374, 'Hogwarts Legacy', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/library_600x900.jpg', 'https://store.steampowered.com/app/990080/Hogwarts_Legacy/'),
(375, 'The Elder Scrolls Online', 'MMORPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/306130/library_600x900.jpg', 'https://store.steampowered.com/app/306130/The_Elder_Scrolls_Online/'),
(376, 'Metro 2033 Redux', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/286690/library_600x900.jpg', 'https://store.steampowered.com/app/286690/Metro_2033_Redux/'),
(377, 'Apex Legends', 'Battle Royale', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/library_600x900.jpg', 'https://store.steampowered.com/app/1172470/Apex_Legends/'),
(378, 'GTA V', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg', 'https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/'),
(379, 'Dark Souls Remastered', 'Action RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/570940/library_600x900.jpg', 'https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/'),
(380, 'Call of Duty: Warzone', 'Battle Royale', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/library_600x900.jpg', 'https://store.steampowered.com/app/1172470/Call_of_Duty_Warzone/'),
(381, 'Rainbow Six Extraction', 'Tactical Shooter', 'https://upload.wikimedia.org/wikipedia/en/9/98/Rainbow_Six_Extraction_cover_art.jpg', 'https://store.steampowered.com/app/1155690/Tom_Clancys_Rainbow_Six_Extraction/'),
(382, 'Forza Horizon 5', 'Racing', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/library_600x900.jpg', 'https://store.steampowered.com/app/1551360/Forza_Horizon_5/'),
(383, 'The Sims 4', 'Simulation', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/library_600x900.jpg', 'https://store.steampowered.com/app/1222670/The_Sims_4/'),
(384, 'Rust', 'Survival', 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/library_600x900.jpg', 'https://store.steampowered.com/app/252490/Rust/'),
(385, 'Fallout: New Vegas', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/22380/library_600x900.jpg', 'https://store.steampowered.com/app/22380/Fallout_New_Vegas/'),
(386, 'Portal', 'Puzzle', 'https://cdn.cloudflare.steamstatic.com/steam/apps/400/library_600x900.jpg', 'https://store.steampowered.com/app/400/Portal/'),
(387, 'Borderlands 3', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/397540/library_600x900.jpg', 'https://store.steampowered.com/app/397540/Borderlands_3/'),
(388, 'Rocket League', 'Sports', 'https://cdn.cloudflare.steamstatic.com/steam/apps/252950/library_600x900.jpg', 'https://store.steampowered.com/app/252950/Rocket_League/'),
(389, 'Dead Space', 'Horror', 'https://cdn.cloudflare.steamstatic.com/steam/apps/17470/library_600x900.jpg', 'https://store.steampowered.com/app/17470/Dead_Space/'),
(391, 'GTA VI', 'Shooter', 'https://media-rockstargames-com.akamaized.net/seis-8878371b7eac6fbe31244d4cfde113a7f532fdb5727e70ceeaf8b3c73eca808f/meta/800x800.jpg', 'https://www.rockstargames.com/VI'),
(392, 'GTA V', 'Shooter', 'https://th.bing.com/th/id/OIP.JAEg_XVBsM35eQE3dMqUqwHaHa?rs=1&pid=ImgDetMain', 'https://store.steampowered.com/agecheck/app/3240220/'),
(393, 'Call of Duty:Ghosts', 'FPS', 'https://th.bing.com/th/id/OIP.cxx8t5pakx3BkmZmhMuOBgHaHa?rs=1&pid=ImgDetMain', 'https://store.steampowered.com/agecheck/app/209160/'),
(394, 'Grand Theft Auto: San Andreas', 'Shooter', 'https://th.bing.com/th/id/R.e625a1be40f83c454d100610ba0b9cbe?rik=5V0IQspC0JSfRw&pid=ImgRaw&r=0', 'https://www.rockstargames.com/games/sanandreas'),
(395, 'God of War', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/library_600x900.jpg', 'https://store.steampowered.com/app/1593500/God_of_War/'),
(396, 'Red Dead Redemption 2', 'Adventure', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg', 'https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/'),
(397, 'Hades', 'Roguelike', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg', 'https://store.steampowered.com/app/1145360/Hades/'),
(398, 'Control', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/870780/library_600x900.jpg', 'https://store.steampowered.com/app/870780/Control/'),
(399, 'Disco Elysium', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/632470/library_600x900.jpg', 'https://store.steampowered.com/app/632470/Disco_Elysium/'),
(400, 'Ori and the Will of the Wisps', 'Metroidvania', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/library_600x900.jpg', 'https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/'),
(401, 'Subnautica', 'Survival', 'https://cdn.cloudflare.steamstatic.com/steam/apps/264710/library_600x900.jpg', 'https://store.steampowered.com/app/264710/Subnautica/'),
(402, 'DOOM Eternal', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/library_600x900.jpg', 'https://store.steampowered.com/app/782330/DOOM_Eternal/'),
(403, 'It Takes Two', 'Adventure', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/library_600x900.jpg', 'https://store.steampowered.com/app/1426210/It_Takes_Two/'),
(404, 'Ghost of Tsushima', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1458140/library_600x900.jpg', 'https://store.steampowered.com/app/1458140/Ghost_of_Tsushima_Director_s_Cut/'),
(405, 'Hitman 3', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/library_600x900.jpg', 'https://store.steampowered.com/app/1659040/HITMAN_3/'),
(406, 'Outer Wilds', 'Adventure', 'https://cdn.cloudflare.steamstatic.com/steam/apps/753640/library_600x900.jpg', 'https://store.steampowered.com/app/753640/Outer_Wilds/'),
(407, 'The Forest', 'Survival', 'https://cdn.cloudflare.steamstatic.com/steam/apps/242760/library_600x900.jpg', 'https://store.steampowered.com/app/242760/The_Forest/'),
(408, 'Factorio', 'Simulation', 'https://cdn.cloudflare.steamstatic.com/steam/apps/427520/library_600x900.jpg', 'https://store.steampowered.com/app/427520/Factorio/'),
(409, 'Sea of Thieves', 'Adventure', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/library_600x900.jpg', 'https://store.steampowered.com/app/1172620/Sea_of_Thieves/'),
(410, 'Tony Hawks Pro Skater 1 + 2', 'Sports', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2395210/library_600x900.jpg', 'https://store.steampowered.com/app/2395210/Tony_Hawks_Pro_Skater_1__2/'),
(411, 'Horizon Zero Dawn', 'Action RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/library_600x900.jpg', 'https://store.steampowered.com/app/1151640/Horizon_Zero_Dawn_Complete_Edition/'),
(412, 'Detroit: Become Human', 'Adventure', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222140/library_600x900.jpg', 'https://store.steampowered.com/app/1222140/Detroit_Become_Human/'),
(413, 'Satisfactory', 'Simulation', 'https://cdn.cloudflare.steamstatic.com/steam/apps/526870/library_600x900.jpg', 'https://store.steampowered.com/app/526870/Satisfactory/'),
(414, 'Ori and the Blind Forest', 'Metroidvania', 'https://cdn.cloudflare.steamstatic.com/steam/apps/261570/library_600x900.jpg', 'https://store.steampowered.com/app/261570/Ori_and_the_Blind_Forest/'),
(415, 'Titanfall 2', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1237970/library_600x900.jpg', 'https://store.steampowered.com/app/1237970/Titanfall_2/'),
(416, 'Kerbal Space Program', 'Simulation', 'https://cdn.cloudflare.steamstatic.com/steam/apps/220200/library_600x900.jpg', 'https://store.steampowered.com/app/220200/Kerbal_Space_Program/'),
(417, 'A Way Out', 'Adventure', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222700/library_600x900.jpg', 'https://store.steampowered.com/app/1222700/A_Way_Out/'),
(418, 'Return of the Obra Dinn', 'Puzzle', 'https://cdn.cloudflare.steamstatic.com/steam/apps/653530/library_600x900.jpg', 'https://store.steampowered.com/app/653530/Return_of_the_Obra_Dinn/'),
(419, 'Risk of Rain 2', 'Roguelike', 'https://cdn.cloudflare.steamstatic.com/steam/apps/632360/library_600x900.jpg', 'https://store.steampowered.com/app/632360/Risk_of_Rain_2/'),
(420, 'Phasmophobia', 'Horror', 'https://cdn.cloudflare.steamstatic.com/steam/apps/739630/library_600x900.jpg', 'https://store.steampowered.com/app/739630/Phasmophobia/'),
(421, 'Deep Rock Galactic', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/548430/library_600x900.jpg', 'https://store.steampowered.com/app/548430/Deep_Rock_Galactic/'),
(422, 'Valheim', 'Survival', 'https://cdn.cloudflare.steamstatic.com/steam/apps/892970/library_600x900.jpg', 'https://store.steampowered.com/app/892970/Valheim/'),
(423, 'Divinity: Original Sin 2', 'RPG', 'https://cdn.cloudflare.steamstatic.com/steam/apps/435150/library_600x900.jpg', 'https://store.steampowered.com/app/435150/Divinity_Original_Sin_2/'),
(424, 'No Mans Sky', 'Survival', 'https://cdn.cloudflare.steamstatic.com/steam/apps/275850/library_600x900.jpg', 'https://store.steampowered.com/app/275850/No_Mans_Sky/'),
(425, 'Half-Life: Alyx', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/546560/library_600x900.jpg', 'https://store.steampowered.com/app/546560/HalfLife_Alyx/'),
(426, 'Prey', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/480490/library_600x900.jpg', 'https://store.steampowered.com/app/480490/Prey/'),
(427, 'Cities: Skylines', 'Simulation', 'https://cdn.cloudflare.steamstatic.com/steam/apps/255710/library_600x900.jpg', 'https://store.steampowered.com/app/255710/Cities_Skylines/'),
(428, 'Tekken 7', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/389730/library_600x900.jpg', 'https://store.steampowered.com/app/389730/TEKKEN_7/'),
(429, 'Mortal Kombat 11', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/976310/library_600x900.jpg', 'https://store.steampowered.com/app/976310/Mortal_Kombat11/'),
(430, 'Street Fighter 6', 'Action', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/library_600x900.jpg', 'https://store.steampowered.com/app/1364780/Street_Fighter_6/'),
(431, 'Alien: Isolation', 'Horror', 'https://cdn.cloudflare.steamstatic.com/steam/apps/214490/library_600x900.jpg', 'https://store.steampowered.com/app/214490/Alien_Isolation/'),
(432, 'The Stanley Parable', 'Adventure', 'https://cdn.cloudflare.steamstatic.com/steam/apps/221910/library_600x900.jpg', 'https://store.steampowered.com/app/221910/The_Stanley_Parable/'),
(433, 'Gris', 'Platformer', 'https://cdn.cloudflare.steamstatic.com/steam/apps/683320/library_600x900.jpg', 'https://store.steampowered.com/app/683320/GRIS/'),
(434, 'Inside', 'Platformer', 'https://cdn.cloudflare.steamstatic.com/steam/apps/304430/library_600x900.jpg', 'https://store.steampowered.com/app/304430/INSIDE/'),
(435, 'Limbo', 'Platformer', 'https://cdn.cloudflare.steamstatic.com/steam/apps/48000/library_600x900.jpg', 'https://store.steampowered.com/app/48000/LIMBO/'),
(436, 'The Binding of Isaac: Rebirth', 'Roguelike', 'https://cdn.cloudflare.steamstatic.com/steam/apps/250900/library_600x900.jpg', 'https://store.steampowered.com/app/250900/The_Binding_of_Isaac_Rebirth/'),
(437, 'Enter the Gungeon', 'Roguelike', 'https://cdn.cloudflare.steamstatic.com/steam/apps/311690/library_600x900.jpg', 'https://store.steampowered.com/app/311690/Enter_the_Gungeon/'),
(438, 'Steamworld Dig 2', 'Metroidvania', 'https://cdn.cloudflare.steamstatic.com/steam/apps/571310/library_600x900.jpg', 'https://store.steampowered.com/app/571310/SteamWorld_Dig_2/'),
(439, 'Slay the Spire', 'Roguelike', 'https://cdn.cloudflare.steamstatic.com/steam/apps/646570/library_600x900.jpg', 'https://store.steampowered.com/app/646570/Slay_the_Spire/'),
(440, 'Halo Infinite', 'FPS', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/library_600x900.jpg', 'https://store.steampowered.com/app/1240440/Halo_Infinite/'),
(441, 'Age of Empires IV', 'Strategy', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1466860/library_600x900.jpg', 'https://store.steampowered.com/app/1466860/Age_of_Empires_IV/'),
(442, 'Total War: Warhammer III', 'Strategy', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1142710/library_600x900.jpg', 'https://store.steampowered.com/app/1142710/Total_War_WARHAMMER_III/'),
(443, 'Crusader Kings III', 'Strategy', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1158310/library_600x900.jpg', 'https://store.steampowered.com/app/1158310/Crusader_Kings_III/'),
(444, 'Microsoft Flight Simulator', 'Simulation', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1250410/library_600x900.jpg', 'https://store.steampowered.com/app/1250410/Microsoft_Flight_Simulator/'),
(445, 'Euro Truck Simulator 2', 'Simulation', 'https://cdn.cloudflare.steamstatic.com/steam/apps/227300/library_600x900.jpg', 'https://store.steampowered.com/app/227300/Euro_Truck_Simulator_2/'),
(446, 'FIFA 24', 'Sports', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/library_600x900.jpg', 'https://store.steampowered.com/app/2195250/EA_SPORTS_FC_24/'),
(447, 'NBA 2K24', 'Sports', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2338770/library_600x900.jpg', 'https://store.steampowered.com/app/2338770/NBA_2K24/'),
(448, 'Madden NFL 24', 'Sports', 'https://m.media-amazon.com/images/I/81GFfmGY-WL.jpg', 'https://www.ea.com/games/madden-nfl/madden-nfl-24'),
(449, 'NHL 24', 'Sports', 'https://upload.wikimedia.org/wikipedia/en/6/63/NHL_24_cover_art.jpg', 'https://www.ea.com/games/nhl/nhl-24'),
(450, 'PES 2023', 'Sports', 'https://assets-prd.ignimgs.com/2022/09/09/efootball-2023-button-fin-1662706485618.jpg?width=300&crop=1%3A1%2Csmart&auto=webp', 'https://www.konami.com/wepes/2023/'),
(451, 'F1 23', 'Sports', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2108330/library_600x900.jpg', 'https://store.steampowered.com/app/2108330/F1_23/'),
(452, 'UFC 5', 'Sports', 'https://www.games.rs/files/images/product/PS5-EA-Sports-UFC-5-cena-prodaja-Srbija-PS50423.jpg.webp', 'https://www.ea.com/games/ufc/ufc-5'),
(453, 'WWE 2K24', 'Sports', 'https://upload.wikimedia.org/wikipedia/en/c/c5/WWE_2K24_Standard_Cover.png', 'https://store.steampowered.com/app/2543720/WWE_2K24/'),
(454, 'MLB The Show 24', 'Sports', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3k4TNvvQWCi2LAq5kCHELrF0ZFk1GR8eP3Q&s', 'https://theshow.com/'),
(455, 'Gran Turismo 7', 'Sports', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/library_600x900.jpg', 'https://www.playstation.com/games/gran-turismo-7/');

-- --------------------------------------------------------

--
-- Table structure for table `korisnik`
--

CREATE TABLE `korisnik` (
  `id` int(11) NOT NULL,
  `ime` varchar(50) DEFAULT NULL,
  `prezime` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `lozinka` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `opis` text DEFAULT NULL,
  `profilna_url` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `korisnik`
--

INSERT INTO `korisnik` (`id`, `ime`, `prezime`, `email`, `lozinka`, `role`, `opis`, `profilna_url`) VALUES
(1, 'Edis', 'Dreic', 'dreicedis@gmail.com', '123456', 'user', '85000', '/uploads/1750149722122.jpg'),
(2, 'Aco', 'Acovic', 'acoacovic@gmail.com', '123456', 'user', NULL, NULL),
(3, 'Baranin', 'Barski', 'barski@gmail.com', '123456', 'user', 'baaaaaaaaaaaarski', ''),
(4, 'Kole', 'Kolovic', 'kole@gmail.com', '123456', 'user', '', '/uploads/1750114675159.jpg'),
(5, 'Pero', 'Peric', 'peka@gmail.com', '123456', 'user', NULL, NULL),
(6, 'Pobro', 'Pobric', 'beztebe@gmail.com', '123456', 'user', 'bbbbrat', ''),
(7, 'Zoran', 'Zoric', 'zoki@gmail.com', '123456', 'user', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lajk`
--

CREATE TABLE `lajk` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) DEFAULT NULL,
  `igra_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ocjena`
--

CREATE TABLE `ocjena` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) DEFAULT NULL,
  `igra_id` int(11) DEFAULT NULL,
  `ocjena` int(11) DEFAULT NULL,
  `komentar` text DEFAULT NULL,
  `datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ocjena`
--

INSERT INTO `ocjena` (`id`, `korisnik_id`, `igra_id`, `ocjena`, `komentar`, `datum`) VALUES
(1, 1, 335, 5, 'Super!', '2025-06-16 01:17:25'),
(2, 2, 335, 5, 'Najjaca igrica na svijet', '2025-06-16 01:20:51'),
(3, 3, 335, 1, 'Trop ', '2025-06-16 01:21:10'),
(4, 3, 336, 3, 'Nije losa', '2025-06-16 22:14:33'),
(5, 3, 338, 5, 'Zlo', '2025-06-16 22:20:47'),
(6, 3, 337, 5, '', '2025-06-16 22:33:00'),
(7, 1, 393, 5, 'Najbolji ikad', '2025-06-17 01:07:18'),
(8, 1, 340, 5, 'Najjaca', '2025-06-17 01:17:16'),
(9, 7, 336, 3, 'Nije losa', '2025-06-17 11:06:59');

-- --------------------------------------------------------

--
-- Table structure for table `prati`
--

CREATE TABLE `prati` (
  `id` int(11) NOT NULL,
  `follower_id` int(11) DEFAULT NULL,
  `prati_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `korisnik_id` int(11) NOT NULL,
  `igra_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `korisnik_id`, `igra_id`) VALUES
(2, 3, 335),
(4, 3, 342),
(6, 3, 343),
(7, 3, 337),
(8, 3, 339),
(9, 4, 349),
(10, 4, 336),
(11, 1, 337),
(12, 6, 391),
(13, 6, 393),
(14, 6, 385),
(15, 1, 340),
(16, 1, 335),
(17, 1, 336),
(18, 1, 394),
(19, 1, 391),
(20, 7, 340),
(21, 7, 341),
(22, 7, 344),
(23, 7, 345),
(24, 7, 351),
(25, 7, 352),
(26, 7, 358),
(27, 3, 452),
(28, 3, 450),
(29, 3, 451),
(30, 3, 446),
(31, 3, 430),
(32, 3, 429),
(33, 3, 428);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `igra`
--
ALTER TABLE `igra`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `korisnik`
--
ALTER TABLE `korisnik`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `lajk`
--
ALTER TABLE `lajk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `korisnik_id` (`korisnik_id`),
  ADD KEY `igra_id` (`igra_id`);

--
-- Indexes for table `ocjena`
--
ALTER TABLE `ocjena`
  ADD PRIMARY KEY (`id`),
  ADD KEY `korisnik_id` (`korisnik_id`),
  ADD KEY `igra_id` (`igra_id`);

--
-- Indexes for table `prati`
--
ALTER TABLE `prati`
  ADD PRIMARY KEY (`id`),
  ADD KEY `follower_id` (`follower_id`),
  ADD KEY `prati_id` (`prati_id`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `korisnik_id` (`korisnik_id`),
  ADD KEY `igra_id` (`igra_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `igra`
--
ALTER TABLE `igra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=456;

--
-- AUTO_INCREMENT for table `korisnik`
--
ALTER TABLE `korisnik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `lajk`
--
ALTER TABLE `lajk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ocjena`
--
ALTER TABLE `ocjena`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `prati`
--
ALTER TABLE `prati`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `lajk`
--
ALTER TABLE `lajk`
  ADD CONSTRAINT `lajk_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`),
  ADD CONSTRAINT `lajk_ibfk_2` FOREIGN KEY (`igra_id`) REFERENCES `igra` (`id`);

--
-- Constraints for table `ocjena`
--
ALTER TABLE `ocjena`
  ADD CONSTRAINT `ocjena_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`),
  ADD CONSTRAINT `ocjena_ibfk_2` FOREIGN KEY (`igra_id`) REFERENCES `igra` (`id`);

--
-- Constraints for table `prati`
--
ALTER TABLE `prati`
  ADD CONSTRAINT `prati_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `korisnik` (`id`),
  ADD CONSTRAINT `prati_ibfk_2` FOREIGN KEY (`prati_id`) REFERENCES `korisnik` (`id`);

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`igra_id`) REFERENCES `igra` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Email verifikacija
ALTER TABLE korisnik 
  ADD COLUMN IF NOT EXISTS verified TINYINT(1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) DEFAULT NULL;

-- Postojeći korisnici su automatski verifikovani
UPDATE korisnik SET verified = 1 WHERE verified = 0 AND verification_token IS NULL;
