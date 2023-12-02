package controllers

//Defines all the functions that handle the get url requests to retrieve roles details and make appropriate calls to database to perform CRUD operations and return a status message
import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"example.com/packages/database"
	"example.com/packages/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

// Function to retrieve all valid user roles
func UserRoles(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	// Retrieve the JWT cookie from the request - Check if user is permitted to retrieve roles
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

	var userroles []models.User_Roles //Using table from which we have to retrieve user roles

	if err := database.DB.Find(&userroles).Error; err != nil {
		fmt.Printf("Error retrieveing user roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(userroles)
}

// Function to retrieve all valid group roles
func GroupRoles(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	// Retrieve the JWT cookie from the request - Check if user is permitted to retrieve roles
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

	var grouproles []models.Group_Roles //Using table from which we have to retrieve group roles

	if err := database.DB.Find(&grouproles).Error; err != nil {
		fmt.Printf("Error retrieveing group roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(grouproles)
}

// Function to retrieve a particular user role's permission details
func UserRolePerms(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	// Retrieve the JWT cookie from the request - Check if user is permitted to access details
	cookie, err := r.Cookie("jwt")
	if err != nil {
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
	//uname := "sowmya1211"
	var user models.Users

	if err := database.DB.Where("username = ?", uname).First(&user).Error; err != nil {
		fmt.Printf("Error retrieveing user roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var userrole models.User_Roles
	if err := database.DB.Where("Ur_ID = ?", user.User_Role).First(&userrole).Error; err != nil {
		fmt.Printf("Error retrieveing user role: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(userrole)
}

// Function to retrieve a particular group role's permission details
func GroupRolePerms(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	paramValue, found := params["group_role_name"] // Check if the parameter is missing or has a null (empty) value
	if !found || paramValue == "" {
		http.Error(w, "Groupname is missing or null", http.StatusBadRequest)
		return
	}

	var group_role models.Group_Roles

	if err := database.DB.Where("group_role_name = ?", params["group_role_name"]).First(&group_role).Error; err != nil {
		fmt.Printf("Error retrieveing user roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(group_role)
}

// Function to add a custom user role
func AddUserRole(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"user_role_name", "reg_user", "view_dets", "delete_users", "create_group", "delete_groups"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	//Counting no of roles to increment value of this entry's user role id
	var userroles []models.User_Roles //Using table from which we have to retrieve user roles
	var urcount int64
	if err := database.DB.Model(&userroles).Count(&urcount).Error; err != nil {
		fmt.Printf("Error retrieveing user roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	//Assigning serial user role id
	ur_id := "UR_" + strconv.FormatInt(urcount+1, 10)
	//Converting string to bool
	reg_user, _ := strconv.ParseBool(params["reg_user"])
	view_dets, _ := strconv.ParseBool(params["view_dets"])
	delete_users, _ := strconv.ParseBool(params["delete_users"])
	create_group, _ := strconv.ParseBool(params["create_group"])
	delete_groups, _ := strconv.ParseBool(params["delete_groups"])

	//Create an entry in database
	user_role := models.User_Roles{
		Ur_ID:          ur_id,
		User_Role_Name: params["user_role_name"],
		Reg_User:       reg_user,
		View_Dets:      view_dets,
		Delete_Users:   delete_users,
		Create_Group:   create_group,
		Delete_Groups:  delete_groups,
	}
	err := database.DB.Create(&user_role).Error
	if err != nil {
		fmt.Printf("Error creating user role: %v", err)
		http.Error(w, "Failed to create user role", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user_role)
}

// Function to add a custom group role
func AddGroupRole(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"group_role_name", "delete_group", "add_user", "delete_group_users", "view_all_dets", "create_task"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	//Counting no of roles to increment value of this entry's user role id
	var grouproles []models.Group_Roles //Using table from which we have to retrieve user roles
	var grcount int64
	if err := database.DB.Model(&grouproles).Count(&grcount).Error; err != nil {
		fmt.Printf("Error retrieveing group roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	//Assigning serial group role id
	gr_id := "GR_" + strconv.FormatInt(grcount+1, 10)
	//Converting string to bool
	delete_group, _ := strconv.ParseBool(params["delete_group"])
	add_user, _ := strconv.ParseBool(params["add_user"])
	delete_group_users, _ := strconv.ParseBool(params["delete_group_users"])
	view_all_dets, _ := strconv.ParseBool(params["view_all_dets"])
	create_task, _ := strconv.ParseBool(params["create_task"])

	//Create an entry in database
	group_role := models.Group_Roles{
		Gr_ID:              gr_id,
		Group_Role_Name:    params["group_role_name"],
		Delete_Group:       delete_group,
		Add_User:           add_user,
		Delete_Group_Users: delete_group_users,
		View_All_Dets:      view_all_dets,
		Create_Task:        create_task,
	}
	err := database.DB.Create(&group_role).Error
	if err != nil {
		fmt.Printf("Error creating group role: %v", err)
		http.Error(w, "Failed to create group role", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(group_role)
}

// Function to get all group and user details
func GetAllDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	var user_groups []models.User_Groups //Using table from which we have to retrieve user roles

	if err := database.DB.Find(&user_groups).Error; err != nil {
		fmt.Printf("Error retrieveing details: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user_groups)

}

// Function to get details of all groups, logged in user is a part of
func GetUserGroupDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	// Retrieve the JWT cookie from the request - Check if user is permitted to access details
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

	var user_groups []models.User_Groups //Using table from which we have to retrieve user's groups
	if err := database.DB.Where("u_id = ?", uname).Find(&user_groups).Error; err != nil {
		fmt.Printf("Error retrieveing user's group roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	//New structure - to be returened in response
	type CombinedData struct {
		Group_Name      string `json:"group_name"`
		Group_Admin_ID  string `json:"group_admin_id"`
		Group_Role_Name string `json:"group_role_name"`
	}
	var combinedData []CombinedData

	// Loop through userGroups and retrieve corresponding group_admin for each
	for _, userGroup := range user_groups {
		var group models.Groups //Fetch group admin from groups database for each entry
		if err := database.DB.Where("group_name = ?", userGroup.G_ID).First(&group).Error; err != nil {
			fmt.Printf("Error retrieving group admin: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		var grouprole models.Group_Roles //Fetch group role from groups database for each entry
		if err := database.DB.Where("gr_id= ?", userGroup.Group_Role).First(&grouprole).Error; err != nil {
			fmt.Printf("Error retrieving group role name: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		// Combine required entries
		combined := CombinedData{
			Group_Name:      userGroup.G_ID,
			Group_Admin_ID:  group.Group_Admin_ID,
			Group_Role_Name: grouprole.Group_Role_Name,
		}
		// Add the combined data to the slice
		combinedData = append(combinedData, combined)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(combinedData)
}

// Function to get details of all tasks, logged in user is a part of in a group
func GetGroupUserTaskDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	// Retrieve the JWT cookie from the request - Check if user is permitted to access details
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

	var group_user_tasks []models.Group_User_Tasks //Using table from which we have to retrieve user's group's tasks
	if err := database.DB.Where("U_ID = ? AND G_ID = ?", uname, params["group_name"]).Find(&group_user_tasks).Error; err != nil {
		fmt.Printf("Error retrieveing user's group roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	//New structure - to be returened in response
	type CombinedData struct {
		Task_Name    string `json:"task_name"`
		Task_Lead_ID string `json:"task_lead_id"`
		Task_Desc    string `json:"task_desc"`
		Task_Status  string `json:"task_status"`
	}
	var combinedData []CombinedData

	// Loop through userGroups and retrieve corresponding group_admin for each
	for _, userGroupTask := range group_user_tasks {
		var group_task models.Group_Tasks //Fetch task details using task name
		if err := database.DB.Where("g_id = ? AND task_name = ?", userGroupTask.G_ID, userGroupTask.T_ID).First(&group_task).Error; err != nil {
			fmt.Printf("Error retrieving group admin: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		// Combine required entries
		combined := CombinedData{
			Task_Name:    group_task.Task_Name,
			Task_Lead_ID: group_task.Task_Lead_ID,
			Task_Desc:    group_task.Task_Desc,
			Task_Status:  group_task.Task_Status,
		}
		// Add the combined data to the slice
		combinedData = append(combinedData, combined)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(combinedData)
}
