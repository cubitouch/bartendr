/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;

toolbox.cache("./assets/imgs/bars/qmWW0p6SkKwpLag3SYsT_Duke%25e2%2580%2599s-Bar-H%25c3%25b4tel-Westminster---630x405---%25c2%25a9-H%25c3%25b4tel-Westminster.jpg");
toolbox.cache("./assets/imgs/bars/alU2BPFQQ2eXSsDQodxi_Bar-8.jpg");
toolbox.cache("./assets/imgs/bars/oEFR2EBS8uJv7HluBO3g_bar-228.jpg");
toolbox.cache("./assets/imgs/bars/yGHW6m0zTwi58BQBvTvQ_Paris-bar-O.jpg");
toolbox.cache("./assets/imgs/bars/kCcl51rqRvadBKVqKWpz_osullivans-grandsboulevards.png");
toolbox.cache("./assets/imgs/bars/pgMlgppT5imAbCwUiapA_cafeozgrandsboulevard.jpg");
toolbox.cache("./assets/imgs/bars/mJjwDdOfSHS4cCc3iDTE_corcorans.jpg");
toolbox.cache("./assets/imgs/bars/2wJ8cxagQ2KeAoktB2jM_Le-Cafe-des-Antiquaires.jpg");
toolbox.cache("./assets/imgs/bars/XIBzw1BFRpO3F5aDDrOi_le-nimporte-quoi-paris-bar-original.jpg");
toolbox.cache("./assets/imgs/bars/OqeltM2TyOrOHM7B5ivM_laconserverie.jpg");
toolbox.cache("./assets/imgs/bars/QT5p0z2ERrynApnoMud5_BBar_Paris.jpg");
toolbox.cache("./assets/imgs/bars/VtjuB9oqRny2eF2I9Zx4_experimentalcocktailclub.png");
toolbox.cache("./assets/imgs/bars/5klkaStgRGqW0W3ffa3Q_aufutetamesure.jpg");
toolbox.cache("./assets/imgs/bars/zQuX2OMKQkesxCG8jlkC_cafeozchatelet.jpg");
toolbox.cache("./assets/imgs/bars/ewthWAkvSxmW8FxSPwwq_rosabonheursurseine.jpg");
toolbox.cache("./assets/imgs/bars/U0GJDDfZTaKPn4ej0AdU_dernierbar.png");
toolbox.cache("./assets/imgs/bars/k7zuUHSPQo6ajHy6AeMm_blackdog.jpg");
toolbox.cache("./assets/imgs/bars/igKZYRTcTFKJO2d4wSzt_153.jpg");
toolbox.cache("./assets/imgs/bars/5TIk7y38RIej2mlb97cq_au-dixieme.jpg");
toolbox.cache("./assets/imgs/bars/jcKHGWN0QSGfwQnij1sC_Chez-Jeannette32.jpg");
toolbox.cache("./assets/imgs/bars/fLRw8FbzSyCbigh6nRoI_thefrogprincess.png");
toolbox.cache("./assets/imgs/bars/oEyfDTLTqGySvYMpwcdw_cavesalliees.jpg");
toolbox.cache("./assets/imgs/bars/CzB523FdTNaN2S2OmPYe_Up-the-roof.jpg");
toolbox.cache("./assets/imgs/bars/RkXoRon0SlqC6koE6V9U_lacompagniedesvinssurnaturels.jpg");
toolbox.cache("./assets/imgs/bars/emBysnXbQYGoe8fkSj9O_jules-et-jim-bar-paris-04.jpg");
toolbox.cache("./assets/imgs/bars/qlbwHXm5ThSGPyM7Npkl_7556-LE-PERCHOIR-MARAIS.jpg");
toolbox.cache("./assets/imgs/bars/Tx7cKoqQoKvEatmuUC52_theclub.png");
toolbox.cache("./assets/imgs/bars/Tk1kJkTVS9GsjWXYfNSx_blind%2Bbar.jpg");
toolbox.cache("./assets/imgs/bars/3TddHZ3wQqu6SvZC2ikC_963123_ritz.jpg");
toolbox.cache("./assets/imgs/bars/AoLviKVRmS1hX9U0vNSP_Bar%2BTerass%2BHotel.jpg");
toolbox.cache("./assets/imgs/bars/uQ4fBeKoTm6k83R5Q9kT_1K-Paris-Bar-031.jpg");
toolbox.cache("./assets/imgs/bars/fLMqjauDRmyqWJFE017W_lecinquante.png");
toolbox.cache("./assets/imgs/bars/9tkrwYKlQlKMQTXrKeDG_thelittlereddoor.png");
toolbox.cache("./assets/imgs/bars/nbCuLSQHa7VqAzPJwKXA_brasseriebarbes.jpg");
toolbox.cache("./assets/imgs/bars/i8nGZnxXQfWHAZ2CDCwz_candelaria.jpg");
toolbox.cache("./assets/imgs/bars/mMf1gLGJSkq4SktOeAdy_Pershing-Hall-bar-lounge-1---630x405---%25c2%25a9-Pershing-Hall.jpg");
toolbox.cache("./assets/imgs/bars/opRfVMaVRG2KVadaq2aY_Comptoir-g%C3%A9n%C3%A9ral.jpg");
toolbox.cache("./assets/imgs/bars/poh3puJRNa0USrWZ8gAG_lautobus.png");
toolbox.cache("./assets/imgs/bars/aX4KPFQuu1NhCexDfBwX_le%2Bbar%2Blong.jpg");
toolbox.cache("./assets/imgs/bars/J72PafCaThqwf8aXK4nD_rideauxsalle-bizzart-photo-olivier-bangoura-web.jpeg");
toolbox.cache("./assets/imgs/bars/1AydpZlkRVyA9sel5y4m_ice-kubebar-paris.jpg");
toolbox.cache("./assets/imgs/bars/0O9cmzFHQty5bOSeBdu7_IMG_1830.JPG");
toolbox.cache("./assets/imgs/bars/Emwog2O4RVGvL03LNRNe_fifth.jpg");
toolbox.cache("./assets/imgs/bars/cYH2W6IOR0OtPtKbkSzL_cristal.jpg");
toolbox.cache("./assets/imgs/bars/5BAuUaRfRjaFpFxPU7eW_13847-le-bar-du-shangri-la-hotel-article_diapo-1.jpg");
toolbox.cache("./assets/imgs/bars/Wh98yRtSCa0LlQV9GUMn_UFO_comptoir.jpg");
toolbox.cache("./assets/imgs/bars/ZZ4777FATEWrlEstw5Hu_Noham%2BCaf%25c3%25a9.jpg");
toolbox.cache("./assets/imgs/bars/0e4qUcn6SN6iHL6mnhmE_lamaison.jpg");
toolbox.cache("./assets/imgs/bars/ywbHDavSLCqojRxZTjg5_le-mecano.jpg");
toolbox.cache("./assets/imgs/bars/DbxlhJKSoqN4dp0gNk7b_pointephemere.jpg");
toolbox.cache("./assets/imgs/bars/XE561R6qTea63jPwTk8q_cir%25c3%25a9jaune.jpg");
toolbox.cache("./assets/imgs/bars/HL79upJwQNaQlH5710k9_le-zinc-corner-1200x900.jpg");
toolbox.cache("./assets/imgs/bars/Yfc95ZVYQmuPIBbqaAaY_choupitos.jpg");
toolbox.cache("./assets/imgs/bars/oxLaueVTAiOuSfY6le8w_cafecherie.jpg");
toolbox.cache("./assets/imgs/bars/eeTLjNiyRoaj5ScRVmPh_quartiergeneralcoub-950x380.jpg");
toolbox.cache("./assets/imgs/bars/tAIx6Z6WSnGQ8lv54utI_Le-Zorba-paris.jpg");
toolbox.cache("./assets/imgs/bars/AZIvYLkSBilouweb8Ufq_carousel_petites-gouttes-aux.jpg");
toolbox.cache("./assets/imgs/bars/a0Y2i1b5Q9SIx81s5v2c_la-rotonde.jpg");
toolbox.cache("./assets/imgs/bars/WX68rVgqTevAHiYTvznQ_Chez-Pierrot-2ok.jpg");
toolbox.cache("./assets/imgs/bars/1tACG0koRMaoBirhulio_en-vrac-bar-paris.jpg");
toolbox.cache("./assets/imgs/bars/UCse9vkQLiETImOFwzlH_auxfolies.jpg");
toolbox.cache("./assets/imgs/bars/nkvHQtjPQ7mgr1cBccyN_brasserie-l-olive.jpg");
toolbox.cache("./assets/imgs/bars/0nN7Cgn0QkKKk8zIHMeh_lamaizon.png");
toolbox.cache("./assets/imgs/bars/ni4dRQtSCZz7VAlUWb0Q_destiny-meltdown-119.jpg");
toolbox.cache("./assets/imgs/bars/6xv5MA1PQzS1AaPNf3FP_triplettes.jpg");
toolbox.cache("./assets/imgs/bars/5fwh3IJsS3CNvQBQAoAu_le%2Bdokhans.jpg");
toolbox.cache("./assets/imgs/bars/q9AtdsY4Tc2Mevnr3a28_5076b6dc601154.90885972.page_slider_8.jpg");
toolbox.cache("./assets/imgs/bars/BW550vXgTkCiJFtUHm5W_le-perchoir-1_4519918.jpg");
toolbox.cache("./assets/imgs/bars/ipqzmVJTRRKJWXwg2s1B_photo-635633423166610601-2.jpg");
toolbox.cache("./assets/imgs/bars/X6Z6xkLTgiWMg0Qz0inQ_pavillonpuebla.jpg");
toolbox.cache("./assets/imgs/bars/3kmGLrRtQ6KW9U8QtZII_transversal.jpg");
toolbox.cache("./assets/imgs/bars/vM0OBv8TP6CFpooGfeKO_bacchus.jpg");
toolbox.cache("./assets/imgs/bars/x4I6P6wRE6gGt88lkk9A_au-metro-14-exterieur-83bfd.jpg");
toolbox.cache("./assets/imgs/bars/BJKLj85DRsGw8SqRqIVI_calbar1.jpg");
toolbox.cache("./assets/imgs/bars/lHdWgg3fROakIVcDAXJJ_la%2Bchope%2Bdaguerre.jpg");
toolbox.cache("./assets/imgs/bars/VVAaHSKWTcesjhedQ58K_caf%25c3%25a9%2Bdaguerre.jpg");
toolbox.cache("./assets/imgs/bars/KOofqF5PRu2B4qZzpSgQ_cafeozdenfert.png");
toolbox.cache("./assets/imgs/bars/lXs7vVxCRtW6ckrihgk8_13522023_10153758550176375_8672208421626093102_n.jpg");
toolbox.cache("./assets/imgs/bars/NTj8Pt2fT5C3f2Hp0nn0_motown.jpg");
toolbox.cache("./assets/imgs/bars/uixsLfY6QwqznvgKWkKN_138.jpg");
toolbox.cache("./assets/imgs/bars/cjZab2NQ1GbszF62vW2n_jamesjoycepub.jpg");
toolbox.cache("./assets/imgs/bars/PSOOzlCTTIeKHgE2PATQ_charlie-birdy-paris-8e_1.jpg");
toolbox.cache("./assets/imgs/bars/WY5dqdEcTEm8SsqfiAVu_limpr%25c3%25a9vu.jpg");
toolbox.cache("./assets/imgs/bars/k7gsAiuFQcWX6SnQ9dvx_saint%2Bjames%2Bparis.jpg");
toolbox.cache("./assets/imgs/bars/9rnbRobqT9mMWLg7nieB_lescargot.jpg");
toolbox.cache("./assets/imgs/bars/6tryv17sRZO9weyHbq5d_La%2BVue.jpg");
toolbox.cache("./assets/imgs/bars/BBHYvh2sQUSDnK3MpL67_rosabonheur.jpg");
toolbox.cache("./assets/imgs/bars/X8pO20ZhTBQqxVL52xno_abracadabar.jpg");
toolbox.cache("./assets/imgs/bars/0bw4YfjxSIiQlTGSxJrO_maroquinerie.JPG");
toolbox.cache("./assets/imgs/bars/Od8ppNu0ScahEZ37kA0P_bellevilloise.jpg");
toolbox.cache("./assets/imgs/bars/OBEMX38RWq65UUQSFCSR_sputnik.jpg");
toolbox.cache("./assets/imgs/bars/H4UqfyelRuSz2eqPher1_inside-bar.jpg");
toolbox.cache("./assets/imgs/bars/D44yPsj4QqivNgATUIyY_lemerlemoqueur.jpg");
toolbox.cache("./assets/imgs/bars/FNI8KGx1TnaGcY0JD75V_mama-shelter-paris-bar-2.jpg");
toolbox.cache("./assets/imgs/bars/E6efODdFSXC7a8i9jp39_frogbercy.jpg");
