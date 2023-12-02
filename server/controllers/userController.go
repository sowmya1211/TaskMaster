package controllers

//Defines all the functions that handle the user based url requests and make appropriate calls to database to perform CRUD operations and return a status message
import (
	"example.com/packages/database"
	"example.com/packages/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"

	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// Used for encryption purposes - Data security : Retrieve jwt token info from cookies
const SecretKey = "sowmya-secret"

// Function to handle register user api request
func Register(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	//Display parameters recvd
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"username", "password", "name", "email_id", "user_role"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	//Hash password before storing it in database
	password, _ := bcrypt.GenerateFromPassword([]byte(params["password"]), 14)

	//Create an entry in database
	user := models.Users{
		Username:  params["username"],
		Password:  password,
		Fullname:  params["name"],
		Email_ID:  params["email_id"],
		User_Role: params["user_role"],
	}
	err := database.DB.Create(&user).Error
	if err != nil {
		fmt.Printf("Error creating user: %v", err)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

// Function to handle login api request
func Login(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	//Check if all parameters are available
	requiredParams := []string{"username", "password"}
	for _, paramName := range requiredParams {
		paramValue, found := params[paramName]
		if !found || paramValue == "" {
			http.Error(w, paramName+" parameter is missing or null", http.StatusBadRequest)
			return
		}
	}

	var user models.Users //Using table in which we have to search for user
	// Perform the search
	if err := database.DB.Where("Username = ?", params["username"]).First(&user).Error; err != nil {
		fmt.Printf("Error searching user: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if user.Username == "" {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	//Bcrypt - Password retrieved is compared with hashed password
	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(params["password"])); err != nil {
		http.Error(w, "Invalid Password", http.StatusBadRequest)
		return
	}

	//Record is found - Login to system
	//Generate a jwt token for authentication and set its issuer to user id (can check for user permissions) and set validity to 12 hours
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    user.Username,
		ExpiresAt: time.Now().Add(time.Hour * 12).Unix(), //12 hours
	})

	token, err := claims.SignedString([]byte(SecretKey)) //At server side to retrieve info from cookie, secret key required
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	//Storing generated token in a cookie - can be seen in client side
	cookie := http.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 12), //12 Hours expirty date
		HttpOnly: true,
		Path:     "/",
	}
	fmt.Printf("%s - %s\n", cookie.Value, cookie.Expires)
	http.SetCookie(w, &cookie)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

// Function to logout a user
func Logout(w http.ResponseWriter, r *http.Request) {
	// Setting up response
	w.Header().Set("Content-Type", "application/json")
	// Retrieve the JWT cookie from the request
	cookie, err := r.Cookie("jwt")
	if err != nil {
		// Handle the error when the cookie is not found
		http.Error(w, "JWT cookie not found", http.StatusUnauthorized)
		return
	}

	// Expire the JWT cookie by setting its expiration time to a past time
	cookie.Expires = time.Now().Add(time.Hour * -1)
	fmt.Printf("%s - %s\n", cookie.Value, cookie.Expires)

	// Update the cookie on the client-side
	http.SetCookie(w, cookie)

	// Send a success message
	response := map[string]interface{}{
		"message": "Logout successful",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Function to get user's profile details
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	// Retrieve the JWT cookie from the request - To get username
	cookie, err := r.Cookie("jwt")
	if err != nil {
		http.Error(w, "JWT cookie not found - User unauthenticated", http.StatusUnauthorized)
		return
	}
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

	if err := database.DB.Select("fullname", "email_id").Where("username = ?", uname).First(&user).Error; err != nil {
		fmt.Printf("Error retrieveing user details: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

// Function to edit user's profile details
func EditUserProfile(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	// Retrieve the JWT cookie from the request - To get username
	cookie, err := r.Cookie("jwt")
	if err != nil {
		http.Error(w, "JWT cookie not found - User unauthenticated", http.StatusUnauthorized)
		return
	}
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

	var user models.Users
	if err := database.DB.Where("username = ?", uname).First(&user).Error; err != nil {
		fmt.Printf("Error retrieveing user details: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	//Getting from body
	var updateData map[string]interface{}
	err1 := json.NewDecoder(r.Body).Decode(&updateData)
	if err1 != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	// Update the profile fields that are provided in the request
	if val, ok := updateData["fullname"]; ok {
		user.Fullname = val.(string)
	}
	if val, ok := updateData["email_id"]; ok {
		user.Email_ID = val.(string)
	}
	if val, ok := updateData["password"]; ok {
		pass, _ := bcrypt.GenerateFromPassword([]byte(val.(string)), 14) //Hash password before storing it in database
		user.Password = pass
	}
	database.DB.Save(&user) //Save it in database
	fmt.Printf("%s %s %s\n", string(user.Password), user.Fullname, user.Email_ID)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

// Function to get all group and user details
func GetAllUserDets(w http.ResponseWriter, r *http.Request) {
	//Setting up response
	w.Header().Set("Content-Type", "application/json")

	var users []models.Users //Using table from which we have to retrieve user roles

	if err := database.DB.Find(&users).Error; err != nil {
		fmt.Printf("Error retrieveing user roles: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)

}

// Function to delete a user's account
func DeleteAccount(w http.ResponseWriter, r *http.Request) {
	// Setting up response
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r) //Key - Value pairs to retrieve data in url passed as parameters
	fmt.Printf("Parameters: %v", params)
	for key, value := range params {
		fmt.Printf("Variable: %s, Value: %s\n", key, value)
	}
	paramValue, found := params["username"] // Check if the parameter is missing or has a null (empty) value
	if !found || paramValue == "" {
		http.Error(w, "Username is missing or null", http.StatusBadRequest)
		return
	}

	var uname = params["username"]
	var groupTasks models.Group_Tasks
	var groups models.Groups

	// Check if there is a group task associated with the user
	if err := database.DB.Where("task_lead_id = ?", uname).First(&groupTasks).Error; err == nil {
		// If user is a task lead, check for the user's group admin
		if err := database.DB.Where("group_name = ?", groupTasks.G_ID).First(&groups).Error; err == nil {
			if uname == groups.Group_Admin_ID {
				//If yes, try to retrieve a super user
				var users1 models.Users
				if err := database.DB.Where("user_role = ? AND username != ?", "UR_1", uname).First(&users1).Error; err != nil {
					http.Error(w, "Cannot Delete user", http.StatusBadRequest)
					return
				}

				// Update group admin to superuser's ID
				if err := database.DB.Model(&groups).Where("group_name = ?", groups.Group_Name).
					Update("group_admin_id", users1.Username).Error; err != nil {
					http.Error(w, "Failed to delete user", http.StatusInternalServerError)
					return
				}
				//Update superuser's details in the user groups. If not present add to group
				var user_groups2 models.User_Groups
				if err := database.DB.Where("u_id = ? AND g_id != ?", users1.Username, groups.Group_Name).First(&user_groups2).Error; err != nil {
					if err := database.DB.Model(&user_groups2).Where("group_name = ?", groups.Group_Name).
						Update("group_role", "GR_1").Error; err != nil {
						http.Error(w, "Failed to delete user", http.StatusInternalServerError)
						return
					}
				} else {
					//Not present in group - add user to group
					user_group := models.User_Groups{
						U_ID:       users1.Username,
						G_ID:       groups.Group_Name,
						Group_Role: "GR_1",
					}
					err := database.DB.Create(&user_group).Error
					if err != nil {
						fmt.Printf("Error while deleting user: %v", err)
						http.Error(w, "Failed to delete user", http.StatusInternalServerError)
						return
					}
				}
				// Update superuser's details in group tasks
				if err := database.DB.Model(&groupTasks).Where("g_id = ? AND task_name = ?", groupTasks.G_ID, groupTasks.Task_Name).
					Update("task_lead_id", users1.Username).Error; err != nil {
					http.Error(w, "Failed to delete user", http.StatusInternalServerError)
					return
				}
				// Check if superuser is in user_group_tasks
				var groupUserTasks models.Group_User_Tasks
				if err := database.DB.
					Where("u_id = ? AND g_id = ? AND t_id = ?", users1.Username, groups.Group_Name, groupTasks.Task_Name).
					First(&groupUserTasks).Error; err != nil {
					// Superuser is not in user_group_tasks, so add them
					groupUserTask1 := models.Group_User_Tasks{
						U_ID:   users1.Username,
						G_ID:   groups.Group_Name,
						T_ID:   groupTasks.Task_Name,
						Report: "",
					}
					if err := database.DB.Create(&groupUserTask1).Error; err != nil {
						http.Error(w, "Failed to delete user", http.StatusInternalServerError)
						return
					}
				}
			} else {
				// Update group admin's task details in the group
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
		} else {
			http.Error(w, "Failed to delete user", http.StatusInternalServerError)
			return
		}
	}
	// If group admin - make superuser the admin
	var groups1 models.Groups
	var users2 models.Users
	// Check if there is a group under the user
	if err := database.DB.Where("group_admin_id = ?", uname).First(&groups1).Error; err == nil {
		//If present - search for a super user : role - UR_1 apart from the user
		if err := database.DB.Where("user_role = ? AND username != ?", "UR_1", uname).First(&users2).Error; err == nil {
			//Update the group_admin to superuser's id
			if err := database.DB.Model(&groups1).Where("group_name = ?", groups1.Group_Name).
				Update("group_admin_id", users2.Username).Error; err != nil {
				http.Error(w, "Failed to delete user", http.StatusInternalServerError)
				return
			}
			//Update superuser's details in the group. If not present add to group
			var user_groups1 models.User_Groups
			if err := database.DB.Where("u_id = ? AND g_id != ?", users2.Username, groups1.Group_Name).First(&user_groups1).Error; err != nil {
				if err := database.DB.Model(&user_groups1).Where("group_name = ?", groups1.Group_Name).
					Update("group_role", "GR_1").Error; err != nil {
					http.Error(w, "Failed to delete user", http.StatusInternalServerError)
					return
				}
			} else {
				//Not present in group - add user to group
				user_group := models.User_Groups{
					U_ID:       users2.Username,
					G_ID:       groups1.Group_Name,
					Group_Role: "GR_1",
				}
				err := database.DB.Create(&user_group).Error
				if err != nil {
					fmt.Printf("Error while deleting user: %v", err)
					http.Error(w, "Failed to delete user", http.StatusInternalServerError)
					return
				}
			}
		} else {
			http.Error(w, "Cannot Delete user", http.StatusBadRequest)
			return
		}
	}
	//Safe to perform deletion
	var user models.Users // Using table from which we have to delete
	if err := database.DB.Where("Username = ?", uname).Delete(&user).Error; err != nil {
		fmt.Printf("Cannot delete user: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	//If user is logged in - log him out
	cookie, err := r.Cookie("jwt") // Retrieve the JWT cookie from the request
	if err == nil {                //Cookie found
		token, err1 := jwt.ParseWithClaims(cookie.Value, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(SecretKey), nil
		})
		if err1 == nil && token.Valid { //Token found and valid
			claims := token.Claims.(*jwt.StandardClaims) //Retrieving the username from the cookie (Stored in JWT cookie at time of login)
			//If user is currently logged in
			if claims.Issuer == uname {
				cookie.Expires = time.Now().Add(-time.Hour) // Expire the JWT cookie by setting its expiration time to a past time
				http.SetCookie(w, cookie)                   // Update the cookie on the client-side
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	// Send a success deletion message
	response := map[string]interface{}{
		"message": "Deletion successful",
	}
	json.NewEncoder(w).Encode(response)
}
