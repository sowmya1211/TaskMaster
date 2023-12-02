package models

type User_Roles struct {
	Ur_ID          string `json:"ur_id" gorm:"primary_key"`
	User_Role_Name string `json:"user_role_name" gorm:"unique;not null"`
	Reg_User       bool   `json:"reg_user" gorm:"not null;"`
	View_Dets      bool   `json:"view_dets" gorm:"not null;"`
	Delete_Users   bool   `json:"delete_users" gorm:"not null;"`
	Create_Group   bool   `json:"create_group" gorm:"not null;"`
	Delete_Groups  bool   `json:"delete_groups" gorm:"not null;"`
}

type Users struct {
	Username  string `json:"username" gorm:"primary_key"`
	Password  []byte `json:"password" gorm:"not null"`
	Fullname  string `json:"fullname" gorm:"not null"`
	Email_ID  string `json:"email_id" gorm:"not null"`
	User_Role string `json:"user_role" gorm:"not null"`
}

type Groups struct {
	Group_Name     string `json:"group_name" gorm:"primary_key"`
	Group_Admin_ID string `json:"group_admin_id" gorm:"not null"`
}

type Group_Roles struct {
	Gr_ID              string `json:"gr_id" gorm:"primary_key"`
	Group_Role_Name    string `json:"group_role_name" gorm:"unique;not null"`
	Delete_Group       bool   `json:"delete_group" gorm:"not null;"`
	Add_User           bool   `json:"add_user" gorm:"not null;"`
	Delete_Group_Users bool   `json:"delete_group_users" gorm:"not null;"`
	View_All_Dets      bool   `json:"view_all_dets" gorm:"not null;"`
	Create_Task        bool   `json:"create_task" gorm:"not null;"`
}

type User_Groups struct {
	G_ID       string `json:"g_id" gorm:"not null"`
	U_ID       string `json:"u_id" gorm:"not null"`
	Group_Role string `json:"group_role" gorm:"not null"`
}

type Group_Tasks struct {
	G_ID         string `json:"g_id" gorm:"not null"`
	Task_Name    string `json:"task_name" gorm:"not null"`
	Task_Lead_ID string `json:"task_lead_id" gorm:"not null"`
	Task_Desc    string `json:"task_desc"`
	Task_Status  string `json:"task_status"`
}

type Group_User_Tasks struct {
	G_ID   string `json:"g_id" gorm:"not null"`
	T_ID   string `json:"t_id" gorm:"not null"`
	U_ID   string `json:"u_id" gorm:"not null"`
	Report string `json:"report"`
}
