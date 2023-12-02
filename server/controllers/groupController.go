package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"example.com/packages/database"
	"example.com/packages/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

// Defines all the functions that handle the group based url requests and make appropriate calls to database to perform CRUD operations and return a status message

// Function to get all group and user details - grouped by group
func GetAllGroupDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	var groups []models.Groups //Using table from which we have to retrieve user roles

	if err := database.DB.Find(&groups).Error; err != nil {
		fmt.Printf("Error retrieveing user roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(groups)

}

// Function to get all user details who are not a part of the group
func GetAllNonGroupUserDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	paramValue, found := params["group_name"] // Check if the parameter is missing or has a null (empty) value
	if !found || paramValue == "" {
		http.Error(w, "Groupname is missing or null", http.StatusBadRequest)
		return
	}

	var user_groups []models.User_Groups //Using table from which we have to retrieve user roles

	if err := database.DB.Where("G_ID = ?", params["group_name"]).Find(&user_groups).Error; err != nil {
		fmt.Printf("Error retrieveing users: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	// Create a slice to store users who are part of the group
	var usersInGroup []string
	for _, userGroup := range user_groups {
		usersInGroup = append(usersInGroup, userGroup.U_ID)
	}

	// Retrieve all users who are NOT part of the group
	var NonGroupUsers []models.Users
	if err := database.DB.Where("Username NOT IN (?)", usersInGroup).Find(&NonGroupUsers).Error; err != nil {
		fmt.Printf("Error retrieving users not in the group: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(NonGroupUsers)

}

// Function to get all user details who a part of the group
func GetGroupUserDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	paramValue, found := params["group_name"] // Check if the parameter is missing or has a null (empty) value
	if !found || paramValue == "" {
		http.Error(w, "Groupname is missing or null", http.StatusBadRequest)
		return
	}

	var user_groups []models.User_Groups //Using table from which we have to retrieve user roles

	if err := database.DB.Where("G_ID = ?", params["group_name"]).Find(&user_groups).Error; err != nil {
		fmt.Printf("Error retrieveing users: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	//New structure - to be returened in response
	type CombinedData struct {
		Username        string `json:"username"`
		Fullname        string `json:"fullname"`
		Group_Role_Name string `json:"group_role_name"`
	}
	var combinedData []CombinedData

	// Loop through userGroups and retrieve corresponding group_admin for each
	for _, userGroup := range user_groups {
		var grouprole models.Group_Roles //Fetch group role from groups database for each entry
		if err := database.DB.Where("gr_id= ?", userGroup.Group_Role).First(&grouprole).Error; err != nil {
			fmt.Printf("Error retrieving group role name: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		var user models.Users //Fetch name from users database for each entry
		if err := database.DB.Where("username= ?", userGroup.U_ID).First(&user).Error; err != nil {
			fmt.Printf("Error retrieving user name: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		// Combine required entries
		combined := CombinedData{
			Username:        userGroup.U_ID,
			Fullname:        user.Fullname,
			Group_Role_Name: grouprole.Group_Role_Name,
		}
		// Add the combined data to the slice
		combinedData = append(combinedData, combined)
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(combinedData)
}

// Function to get all details of a group - Ordered by Tasks
func GetGroupDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	paramValue, found := params["group_name"] // Check if the parameter is missing or has a null (empty) value
	if !found || paramValue == "" {
		http.Error(w, "Groupname is missing or null", http.StatusBadRequest)
		return
	}

	//New structure - to be returened in response - separating usres with tasks from others
	type CombinedData struct {
		Task_Users  []models.Group_User_Tasks `json:"task_users"`
		Tasks       []models.Group_Tasks      `json:"tasks"`
		Other_Users []models.User_Groups      `json:"other_users"`
	}
	var combinedData CombinedData
	//Retrieving all users from the group
	var user_groups []models.User_Groups
	if err := database.DB.Where("G_ID = ?", params["group_name"]).Find(&user_groups).Error; err != nil {
		fmt.Printf("Error retrieveing users: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	//Retrieving all users with tasks from the group
	if err := database.DB.Where("G_ID= ?", params["group_name"]).Find(&combinedData.Task_Users).Error; err != nil {
		fmt.Printf("Error retrieving group role name: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	//Retrieving all task leads and task names from the group
	if err := database.DB.Where("G_ID= ?", params["group_name"]).Find(&combinedData.Tasks).Error; err != nil {
		fmt.Printf("Error retrieving group role name: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	// Retrieving group users who dont have tasks
	database.DB.Table("user_groups").
		Select("user_groups.*").Joins("LEFT JOIN group_user_tasks ON user_groups.U_ID = group_user_tasks.U_ID AND user_groups.G_ID = group_user_tasks.G_ID").
		Where("group_user_tasks.U_ID IS NULL").
		Where("user_groups.G_ID = ?", params["group_name"]).
		Find(&combinedData.Other_Users)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(combinedData)
}

// Function to create a group
func CreateGroup(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)                     //Key - Value pairs to retrieve data in url passed as parameters
	paramValue, found := params["group_name"] // Check if the parameter is missing or has a null (empty) value
	if !found || paramValue == "" {
		http.Error(w, "Group name is missing or null", http.StatusBadRequest)
		return
	}

	// Retrieve the JWT cookie from the request - User must be authenticated to create a group
	cookie, err := r.Cookie("jwt")
	if err != nil {
		// Handle the error when the cookie is not found
		http.Error(w, "JWT cookie not found - User unauthenticated", http.StatusUnauthorized)
		return
	}
	//Checking if user is permitted to access details - validate the JWT token
	token, err := jwt.ParseWithClaims(cookie.Value, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if err != nil {
		http.Error(w, "JWT not found  - User unauthenticated", http.StatusUnauthorized)
		return
	}
	// Check if the token is valid
	if !token.Valid {
		http.Error(w, "Invalid token  - User unauthenticated", http.StatusUnauthorized)
		return
	}
	//Retrieving the username from the cookie (Stored in JWT cookie at time of login)
	claims := token.Claims.(*jwt.StandardClaims)
	uname := claims.Issuer

	//Create two entries in database : Groups and User_Groups
	//Groups
	group := models.Groups{
		Group_Name:     params["group_name"],
		Group_Admin_ID: uname,
	}
	err = database.DB.Create(&group).Error
	if err != nil {
		fmt.Printf("Error creating group: %v", err)
		http.Error(w, "Failed to create group", http.StatusInternalServerError)
		return
	}
	//User_Groups
	user_group := models.User_Groups{
		G_ID:       params["group_name"],
		U_ID:       uname,
		Group_Role: "GR_1", //Admin - creates an entry for oneself
	}
	err = database.DB.Create(&user_group).Error
	if err != nil {
		fmt.Printf("Error creating group: %v", err)
		http.Error(w, "Failed to create group", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := map[string]interface{}{
		"message": "Creation successful",
	}
	json.NewEncoder(w).Encode(response)
}

// Function to delete a group
func DeleteGroup(w http.ResponseWriter, r *http.Request) {
	// Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	paramValue, found := params["group_name"] // Check if the parameter is missing or has a null (empty) value
	if !found || paramValue == "" {
		http.Error(w, "Groupname is missing or null", http.StatusBadRequest)
		return
	}

	var group models.Groups //Using table from which we have to delete
	// Perform the deletion
	if err := database.DB.Where("Group_name = ?", params["group_name"]).Delete(&group).Error; err != nil {
		fmt.Printf("Cannot delete group: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	// Send a success deletion message
	response := map[string]interface{}{
		"message": "Deletion successful",
	}
	json.NewEncoder(w).Encode(response)
}

// Function to add a user to the group
func AddGroupUser(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "username", "group_role"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}
	//Create an entry in database
	user_group := models.User_Groups{
		U_ID:       params["username"],
		G_ID:       params["group_name"],
		Group_Role: params["group_role"],
	}
	err := database.DB.Create(user_group).Error
	if err != nil {
		fmt.Printf("Error adding group user: %v", err)
		http.Error(w, "Failed to add user to group", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user_group)
}

// Function to delete a user from the group
func DeleteGroupUser(w http.ResponseWriter, r *http.Request) {
	// Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "username"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var uname = params["username"]
	var gname = params["group_name"]
	var groups models.Groups
	var groupTasks models.Group_Tasks
	// Check if user to be deleted is a group admin - If yes dont delete user
	if err := database.DB.Where("group_name = ?", gname).First(&groups).Error; err != nil {
		http.Error(w, "Cannot Delete user", http.StatusBadRequest)
		return
	}
	// Check if the user is the group admin
	if uname == groups.Group_Admin_ID {
		http.Error(w, "Cannot Delete user", http.StatusBadRequest)
		return
	} else {
		// If user is a task lead, update task lead to group admin
		if err := database.DB.Where("task_lead_id = ? AND g_id=? ", uname, gname).First(&groupTasks).Error; err == nil {
			//Make the group admin the task lead
			if err := database.DB.Model(&groupTasks).Where("g_id = ? AND task_name = ?", groupTasks.G_ID, groupTasks.Task_Name).
				Update("task_lead_id", groups.Group_Admin_ID).Error; err != nil {
				http.Error(w, "Failed to delete user", http.StatusInternalServerError)
				return
			}
			// Check if group admin is in user_group_tasks
			var groupUserTasks models.Group_User_Tasks
			if err := database.DB.
				Where("u_id = ? AND g_id = ? AND t_id = ?", groups.Group_Admin_ID, groups.Group_Name, groupTasks.Task_Name).
				First(&groupUserTasks).Error; err != nil {
				// Group admin is not in user_group_tasks, so add them
				groupUserTask1 := models.Group_User_Tasks{
					U_ID:   groups.Group_Admin_ID,
					G_ID:   groups.Group_Name,
					T_ID:   groupTasks.Task_Name,
					Report: "",
				}
				if err := database.DB.Create(&groupUserTask1).Error; err != nil {
					http.Error(w, "Failed to delete user", http.StatusInternalServerError)
					return
				}
			}
		}
	}

	//Safe to perform deletion
	var user_group models.User_Groups // Using table from which we have to delete
	if err := database.DB.Where("G_ID = ? AND U_ID = ?", gname, uname).Delete(&user_group).Error; err != nil {
		fmt.Printf("Cannot delete user from group: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	// Send a success deletion message
	response := map[string]interface{}{
		"message": "Deletion successful",
	}
	json.NewEncoder(w).Encode(response)
}
