package routes

//Based on request url make appropriate call to a function that processes the request
//Decide on the request method

import (
	"fmt"
	"net/http"

	"example.com/packages/controllers"
	"github.com/gorilla/mux"
)

// CORSRouterDecorator applies CORS headers to a mux.Router
type CORSRouterDecorator struct {
	R *mux.Router
}

func (c *CORSRouterDecorator) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers", "Accept, Accept-Language, Content-Type, Authorization")
		rw.Header().Set("Access-Control-Allow-Credentials", "true")
	}

	// // Debugging: Print the response headers
	// fmt.Println("Response Headers:")
	// for key, values := range rw.Header() {
	// 	for _, value := range values {
	// 		fmt.Printf("%s: %s\n", key, value)
	// 	}
	// }

	// Stop here if its Preflighted OPTIONS request
	if req.Method == "OPTIONS" {
		fmt.Println("Preflight OPTIONS request")
		return
	}

	c.R.ServeHTTP(rw, req)
}

func Router() {
	router := mux.NewRouter()

	// Wrap the router with the CORS middleware
	corsMiddleware := &CORSRouterDecorator{R: router}

	// Define your routes
	router.HandleFunc("/api/login/{username}/{password}", controllers.Login).Methods("POST")      //To login
	router.HandleFunc("/api/logout", controllers.Logout).Methods("POST")                          //To logout
	router.HandleFunc("/api/deletegroup/{group_name}", controllers.DeleteGroup).Methods("DELETE") //To delete a group
	//User Dashboard related APIs
	router.HandleFunc("/api/getuserroles", controllers.UserRoles).Methods("GET")                                                                                         //Get all user roles in database
	router.HandleFunc("/api/getuserrolepermdets", controllers.UserRolePerms).Methods("GET")                                                                              //To retrieve a user's permissions through user role
	router.HandleFunc("/api/getprofile", controllers.GetUserProfile).Methods("GET")                                                                                      //Get Profile details of user
	router.HandleFunc("/api/editprofile", controllers.EditUserProfile).Methods("POST")                                                                                   //Edit Profile details of user
	router.HandleFunc("/api/getusergroupdets", controllers.GetUserGroupDets).Methods("GET")                                                                              // Function to get details of all groups, logged in user is a part of
	router.HandleFunc("/api/reguser/{username}/{password}/{name}/{email_id}/{user_role}", controllers.Register).Methods("POST")                                          //Register a user
	router.HandleFunc("/api/adduserrole/{user_role_name}/{reg_user}/{view_dets}/{delete_users}/{create_group}/{delete_groups}", controllers.AddUserRole).Methods("POST") //To add a custom user role
	router.HandleFunc("/api/creategroup/{group_name}", controllers.CreateGroup).Methods("POST")                                                                          //Function to create a group
	router.HandleFunc("/api/delaccnt/{username}", controllers.DeleteAccount).Methods("POST")                                                                             //To delete a user's account (Based on conditions)
	router.HandleFunc("/api/getalldets", controllers.GetAllDets).Methods("GET")                                                                                          //To get all group and user details
	router.HandleFunc("/api/getalluserdets", controllers.GetAllUserDets).Methods("GET")                                                                                  //To get all user details
	router.HandleFunc("/api/getallgroupdets", controllers.GetAllGroupDets).Methods("GET")                                                                                //To get all group details

	//Group Dashboard related APIs
	router.HandleFunc("/api/getgrouproles", controllers.GroupRoles).Methods("GET")                                                                                                  //Get all group roles in database
	router.HandleFunc("/api/getgrouprolepermdets/{group_role_name}", controllers.GroupRolePerms).Methods("GET")                                                                     //To retrieve a group user's task details
	router.HandleFunc("/api/getgroupusertaskdets/{group_name}", controllers.GetGroupUserTaskDets).Methods("GET")                                                                    //To retrieve a group user's permissions through group role
	router.HandleFunc("/api/getnongroupusers/{group_name}", controllers.GetAllNonGroupUserDets).Methods("GET")                                                                      //To get all user details who are not a part of the group
	router.HandleFunc("/api/getallgroupuserdets/{group_name}", controllers.GetGroupUserDets).Methods("GET")                                                                         //To get a group's user details
	router.HandleFunc("/api/getgroupdets/{group_name}", controllers.GetGroupDets).Methods("GET")                                                                                    //To get all details of a group                                                                   //To get a group's details
	router.HandleFunc("/api/addgroupuser/{group_name}/{username}/{group_role}", controllers.AddGroupUser).Methods("POST")                                                           //Add a user to a group
	router.HandleFunc("/api/addgrouprole/{group_role_name}/{delete_group}/{add_user}/{delete_group_users}/{view_all_dets}/{create_task}", controllers.AddGroupRole).Methods("POST") //To add a custom group role
	router.HandleFunc("/api/delgroupuser/{group_name}/{username}", controllers.DeleteGroupUser).Methods("POST")                                                                     //To delete a user from the group

	//Task Dashboard related APIs
	router.HandleFunc("/api/createtask/{group_name}/{task_name}/{task_desc}", controllers.CreateTask).Methods("POST")               //Function to create a task
	router.HandleFunc("/api/deletetask/{group_name}/{task_name}", controllers.DeleteTask).Methods("DELETE")                         //Function to delete a task
	router.HandleFunc("/api/gettaskdets/{group_name}/{task_name}", controllers.TaskDets).Methods("GET")                             //Function to get all details in a task
	router.HandleFunc("/api/getnontaskgroupuserdets/{group_name}/{task_name}", controllers.GetNonGroupTaskUserDets).Methods("GET")  //To get all user details who are not a part of the group task
	router.HandleFunc("/api/gettaskgroupuserdets/{group_name}/{task_name}", controllers.GetGroupTaskUserDets).Methods("GET")        //To get a group task's user details
	router.HandleFunc("/api/assigntask/{group_name}/{task_name}/{username}", controllers.AssignTask).Methods("POST")                //Assign a task to a user
	router.HandleFunc("/api/deallocatetask/{group_name}/{task_name}/{username}", controllers.DeallocateTask).Methods("POST")        //To deallocate a task from a user
	router.HandleFunc("/api/updatetaskstatus/{group_name}/{task_name}/{task_status}", controllers.UpdateTaskStatus).Methods("POST") //To update task status
	router.HandleFunc("/api/updatereport/{group_name}/{task_name}/{username}/{report}", controllers.UpdateReport).Methods("POST")   //To update user report for a task
	// Create an HTTP server using the wrapped router with CORS
	http.Handle("/", corsMiddleware)

	//Start listening on port 8000
	fmt.Println("Starting the server on port 8000...")
	err := http.ListenAndServe(":8000", corsMiddleware)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}
