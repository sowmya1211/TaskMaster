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

// Defines all the functions that handle the group task based url requests and make appropriate calls to database to perform CRUD operations and return a status message

// Function to create a task
func CreateTask(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name", "task_desc"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	// Retrieve the JWT cookie from the request - User must be authenticated to create a task
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

	//Create two entries in database : Group_Tasks and Group_User_Tasks
	//Group_Tasks
	group_task := models.Group_Tasks{
		G_ID:         params["group_name"],
		Task_Name:    params["task_name"],
		Task_Lead_ID: uname,
		Task_Desc:    params["task_desc"],
		Task_Status:  "Open",
	}
	err = database.DB.Create(&group_task).Error
	if err != nil {
		fmt.Printf("Error creating task: %v", err)
		http.Error(w, "Failed to create task", http.StatusInternalServerError)
		return
	}
	//Task_Group_Users
	group_user_tasks := models.Group_User_Tasks{
		G_ID:   params["group_name"],
		U_ID:   uname,
		T_ID:   params["task_name"],
		Report: "", //Task Lead - creates an entry for oneself
	}
	err = database.DB.Create(&group_user_tasks).Error
	if err != nil {
		fmt.Printf("Error creating task: %v", err)
		http.Error(w, "Failed to create task", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := map[string]interface{}{
		"message": "Creation successful",
	}
	json.NewEncoder(w).Encode(response)
}

// Function to delete a task
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	// Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var group_task models.Group_Tasks //Using table from which we have to delete
	// Perform the deletion
	if err := database.DB.Where("G_ID = ? AND Task_Name = ?", params["group_name"], params["task_name"]).Delete(&group_task).Error; err != nil {
		fmt.Printf("Cannot delete task: %v", err)
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

// Function to get task details
func TaskDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var group_tasks models.Group_Tasks //Using table from which we have to retrieve user roles

	if err := database.DB.Where("G_ID = ? AND Task_Name =?", params["group_name"], params["task_name"]).First(&group_tasks).Error; err != nil {
		fmt.Printf("Error retrieveing details: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(group_tasks)

}

// Function to get all user details who are not a part of the group task
func GetNonGroupTaskUserDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var group_user_tasks []models.Group_User_Tasks
	if err := database.DB.Where("G_ID = ? AND T_ID =?", params["group_name"], params["task_name"]).Find(&group_user_tasks).Error; err != nil {
		fmt.Printf("Error retrieveing users: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	var group_users []models.User_Groups
	if err := database.DB.Where("G_ID = ?", params["group_name"]).Find(&group_users).Error; err != nil {
		fmt.Printf("Error retrieveing users: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	// Create a slice to store users who are part of the group task
	var usersInGroupTask []string
	for _, GroupTaskUser := range group_user_tasks {
		usersInGroupTask = append(usersInGroupTask, GroupTaskUser.U_ID)
	}
	// Create a slice to store users who are part of the group
	var usersInGroup []string
	for _, GroupUser := range group_users {
		usersInGroup = append(usersInGroup, GroupUser.U_ID)
	}

	// Retrieve all users who are NOT part of the task but part of the group
	var NonGroupTaskUsers []models.Users
	if err := database.DB.Where("Username NOT IN (?) and Username IN (?)", usersInGroupTask, usersInGroup).Find(&NonGroupTaskUsers).Error; err != nil {
		fmt.Printf("Error retrieving users not in the group: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(NonGroupTaskUsers)

}

// Function to get all user details who a part of the group task
func GetGroupTaskUserDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var group_user_tasks []models.Group_User_Tasks
	if err := database.DB.Where("G_ID = ? AND T_ID =?", params["group_name"], params["task_name"]).Find(&group_user_tasks).Error; err != nil {
		fmt.Printf("Error retrieveing users: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	//New structure - to be returened in response
	type CombinedData struct {
		Username string `json:"username"`
		Fullname string `json:"fullname"`
		Report   string `json:"report"`
	}
	var combinedData []CombinedData

	// Loop through GroupTask users and retrieve fullname for each
	for _, groupTaskUser := range group_user_tasks {
		var user models.Users //Fetch name from users database for each entry
		if err := database.DB.Where("username= ?", groupTaskUser.U_ID).First(&user).Error; err != nil {
			fmt.Printf("Error retrieving user name: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		// Combine required entries
		combined := CombinedData{
			Username: groupTaskUser.U_ID,
			Fullname: user.Fullname,
			Report:   groupTaskUser.Report,
		}
		// Add the combined data to the slice
		combinedData = append(combinedData, combined)
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(combinedData)
}

// Function to assign a task to a user
func AssignTask(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name", "username"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}
	//Create an entry in database
	group_user_task := models.Group_User_Tasks{
		U_ID:   params["username"],
		G_ID:   params["group_name"],
		T_ID:   params["task_name"],
		Report: "",
	}
	err := database.DB.Create(group_user_task).Error
	if err != nil {
		fmt.Printf("Error assign task to user: %v", err)
		http.Error(w, "Failed to assign task to user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(group_user_task)
}

// Function to deallocate a task from a user
func DeallocateTask(w http.ResponseWriter, r *http.Request) {
	// Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name", "username"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var uname = params["username"]
	var gname = params["group_name"]
	var tname = params["task_name"]
	var groupUserTasks models.Group_User_Tasks
	var groupTasks models.Group_Tasks
	// Check if user to be deleted is the task lead - If yes dont deallocate task from user
	if err := database.DB.Where("g_id = ? AND task_name = ?", gname, tname).First(&groupTasks).Error; err != nil {
		http.Error(w, "Cannot Dellocate Task", http.StatusBadRequest)
		return
	}
	// Check if the user is the task lead
	if uname == groupTasks.Task_Lead_ID {
		http.Error(w, "Cannot Deallocate Task", http.StatusBadRequest)
		return
	}

	//Safe to perform deletion
	if err := database.DB.Where("G_ID = ? AND T_ID=? AND U_ID = ?", gname, tname, uname).Delete(&groupUserTasks).Error; err != nil {
		fmt.Printf("Cannot deallocate task: %v", err)
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

// Function to update Task status
func UpdateTaskStatus(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name", "task_status"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var groupTasks models.Group_Tasks

	//Update Task Status
	if err := database.DB.Model(&groupTasks).Where("g_id = ? AND task_name = ?", params["group_name"], params["task_name"]).
		Update("task_status", params["task_status"]).Error; err != nil {
		http.Error(w, "Failed to update task status", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	// Send a success deletion message
	json.NewEncoder(w).Encode(groupTasks)
}

// Function to update User's report in a task
func UpdateReport(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_name", "task_name", "username", "report"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var groupUserTasks models.Group_User_Tasks

	//Update Task Status
	if err := database.DB.Model(&groupUserTasks).Where("g_id = ? AND t_id = ? AND u_id = ?", params["group_name"], params["task_name"], params["username"]).
		Update("report", params["report"]).Error; err != nil {
		http.Error(w, "Failed to update user report", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	// Send a success deletion message
	json.NewEncoder(w).Encode(groupUserTasks)
}
