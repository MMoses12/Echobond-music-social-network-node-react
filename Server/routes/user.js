import express from "express"

// Import controllers.
import LogIn from "../controllers/UserControllers/logIn.js"
import Register from "../controllers/UserControllers/register.js"
import AddFriend from "../controllers/FriendsControllers/addFriend.js"
import ConfirmFriend from "../controllers/FriendsControllers/confirmFriend.js"
import GetFriends from "../controllers/FriendsControllers/getFriends.js"
import GetFriendRequests from "../controllers/FriendsControllers/getFriendRequests.js"
import DeclineRequest from "../controllers/FriendsControllers/declineRequest.js"
import ChangeUserData from "../controllers/UserControllers/changeUserData.js"
import ChangeProfileImage from "../controllers/UserControllers/changeProfileImage.js"
import GetUserInfo from "../controllers/UserControllers/getUserInfo.js"

import AddFavouriteAlbum from "../controllers/UserControllers/Favourites/addFavouriteAlbum.js"
import RemoveFavouriteAlbum from "../controllers/UserControllers/Favourites/removeFavouriteAlbum.js"
import AddFavouriteArtist from "../controllers/UserControllers/Favourites/addFavouriteArtist.js"
import RemoveFavouriteArtist from "../controllers/UserControllers/Favourites/removeFavouriteArtist.js"
import GetFavouriteArtist from "../controllers/UserControllers/Favourites/getFavouriteArtists.js"
import GetFavouriteAlbum from "../controllers/UserControllers/Favourites/getFavouriteAlbums.js"

import SearchRecent from "../controllers/UserControllers/searchRecent.js"
import SearchFriends from "../controllers/FriendsControllers/searchFriends.js"
import GetRecentSongs from "../controllers/UserControllers/getRecentSongs.js"
import DeleteUser from "../controllers/UserControllers/deleteUser.js"
import DeleteFriend from "../controllers/FriendsControllers/deleteFriend.js"
import ForgotPassword from "../controllers/UserControllers/forgotPassword.js"

const router = express.Router()

// User log in.
router.post("/login", LogIn)

// User register.
router.put("/register", Register)

// User addfriend
router.post("/add-friend", AddFriend)

// User confirm friend request
router.post("/confirm-friend", ConfirmFriend)

// User decline friend request.
router.post("/decline-request", DeclineRequest)

// Get all user's friends.
router.get("/get-friends", GetFriends)

// Get all user's friend requests.
router.get("/get-friend-requests", GetFriendRequests)

// Search for friends.
router.post("/search-friends", SearchFriends)

// Remove a friend.
router.delete("/remove-friend", DeleteFriend)

// ---------------------------------------------------------------------------------------------
// Change user data

// Change user's country.
router.patch("/change-user-data", ChangeUserData)

// Change user's photo.
router.patch("/change-user-image", ChangeProfileImage)

// Get user's data.
router.get("/get-user-info", GetUserInfo)

// Delete user's account.
router.delete("/delete-account", DeleteUser)

// Forgot password.
router.post("/forgot-password", ForgotPassword)

// ---------------------------------------------------------------------------------------------
// Favourites.

// Add favourite album.
router.put("/add-favourite-album", AddFavouriteAlbum)

// Remove album from favourites.
router.delete("/remove-favourite-album", RemoveFavouriteAlbum)

// Add favourite artist.
router.put("/add-favourite-artist", AddFavouriteArtist)

// Remove artist from favourites.
router.delete("/remove-favourite-artist", RemoveFavouriteArtist)

// Get a user's favourite albums.
router.get("/get-favourite-albums",GetFavouriteAlbum)

// Get a user's favourite artists.
router.get("/get-favourite-artists",GetFavouriteArtist)

// ----------------------------------------------------------
// Search routes.

// Add recent searched to the database.
router.get("/search-recent", SearchRecent)

// Get all recent searched songs.
router.get("/get-recent-songs", GetRecentSongs)

export default router