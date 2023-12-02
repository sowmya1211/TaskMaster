use BalkanID;

#Inserting into User Roles#
INSERT INTO User_Roles (UR_ID,User_Role_Name,Reg_User,View_Dets,Delete_Users,Create_Group,Delete_Groups)
VALUES ('UR_1', 'Super User', 1,1,1,1,1);
INSERT INTO User_Roles (UR_ID,User_Role_Name,Reg_User,View_Dets,Delete_Users,Create_Group,Delete_Groups)
VALUES ('UR_2', 'Group Supervisor', 0,0,0,1,0);
INSERT INTO User_Roles (UR_ID,User_Role_Name,Reg_User,View_Dets,Delete_Users,Create_Group,Delete_Groups)
VALUES ('UR_3', 'General User', 0,0,0,0,0);
INSERT INTO User_Roles (UR_ID,User_Role_Name,Reg_User,View_Dets,Delete_Users,Create_Group,Delete_Groups)
VALUES ('UR_4', 'Vendor', 0,1,0,1,0);

#Inserting into Group Roles#
INSERT INTO Group_Roles (GR_ID,Group_Role_Name,Delete_Group,Add_User,Delete_Group_Users,View_All_Dets,Create_Task)
VALUES ('GR_1', 'Group Admin', 1,1,1,1,1);
INSERT INTO Group_Roles (GR_ID,Group_Role_Name,Delete_Group,Add_User,Delete_Group_Users,View_All_Dets,Create_Task)
VALUES ('GR_2', 'Task Lead', 0,0,0,0,1);
INSERT INTO Group_Roles (GR_ID,Group_Role_Name,Delete_Group,Add_User,Delete_Group_Users,View_All_Dets,Create_Task)
VALUES ('GR_3', 'Group Member', 0,0,0,0,0); 
INSERT INTO Group_Roles (GR_ID,Group_Role_Name,Delete_Group,Add_User,Delete_Group_Users,View_All_Dets,Create_Task)
VALUES ('GR_4', 'Partner', 0,0,0,1,0); 

