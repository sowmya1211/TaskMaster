create database BalkanID; 

use BalkanID;

#Creating User Roles relation#
create table User_Roles( 
Ur_ID varchar(10),
User_Role_Name varchar(30) UNIQUE NOT NULL,
Reg_User BOOLEAN NOT NULL default 0, 
View_Dets BOOLEAN NOT NULL default 0,
Delete_Users BOOLEAN NOT NULL default 0, 
Create_Group BOOLEAN NOT NULL default 0,
Delete_Groups BOOLEAN NOT NULL default 0,
constraint urid_pk PRIMARY KEY(Ur_ID)
);

#Creating Users relation#
create table Users(
Username varchar(30),
Password varchar(60) NOT NULL,
Fullname varchar(50) NOT NULL,
Email_ID varchar(30) NOT NULL,
User_Role varchar(30) NOT NULL, 
constraint uid_pk PRIMARY KEY(Username),
constraint urole_fk_urid FOREIGN KEY (User_Role) REFERENCES User_Roles (Ur_ID) ON UPDATE CASCADE ON DELETE RESTRICT
);

#Creating Groups relation#
create table Groups(
Group_Name varchar(30),
Group_Admin_ID varchar(30) NOT NULL,
constraint gid_pk PRIMARY KEY(Group_Name),
constraint gaid_fk_uid FOREIGN KEY (Group_Admin_ID) REFERENCES Users (Username) ON DELETE CASCADE ON UPDATE CASCADE
);

#Creating Group Roles relation#
create table Group_Roles(
Gr_ID varchar(10),
Group_Role_Name varchar(30) UNIQUE NOT NULL,
Delete_Group BOOLEAN NOT NULL default 0,
Add_User BOOLEAN NOT NULL default 0, 
Delete_Group_Users BOOLEAN NOT NULL default 0, 
View_All_Dets BOOLEAN NOT NULL default 0, 
Create_Task BOOLEAN NOT NULL default 0,
constraint grid_pk PRIMARY KEY(Gr_ID)
);

#Creating User Groups relation#
create table User_Groups(
G_ID varchar(30) NOT NULL,
U_ID varchar(30) NOT NULL,
Group_Role varchar(30) NOT NULL,
constraint guid_pk PRIMARY KEY(G_ID,U_ID),
constraint ugid_fk_gid FOREIGN KEY (G_ID) REFERENCES Groups (Group_Name) ON DELETE CASCADE ON UPDATE CASCADE,
constraint uid_fk_uid FOREIGN KEY (U_ID) REFERENCES Users (Username) ON DELETE CASCADE ON UPDATE CASCADE,
constraint grole_fk_grid FOREIGN KEY (Group_Role) REFERENCES Group_Roles (Gr_ID) ON UPDATE CASCADE ON DELETE RESTRICT
);

#Creating Group Tasks relation#
create table Group_Tasks(
G_ID varchar(30) NOT NULL,
Task_Name varchar(30) NOT NULL,
Task_Lead_ID varchar(30) NOT NULL,
Task_Desc varchar(100),
Task_Status varchar(30) default 'Open',
constraint gtid_pk PRIMARY KEY(G_ID,Task_Name),
constraint tgid_fk_gid FOREIGN KEY (G_ID) REFERENCES Groups (Group_Name) ON DELETE CASCADE ON UPDATE CASCADE,
constraint tlid_fk_uid FOREIGN KEY (Task_Lead_ID) REFERENCES Users (Username) ON DELETE CASCADE ON UPDATE CASCADE,
constraint tstatus_ch check (Task_Status in('Open','In Progress','On Hold','Canceled','Completed'))
);

#Creating Group User Tasks relation#
create table Group_User_Tasks(
G_ID varchar(30) NOT NULL,
T_ID varchar(30) NOT NULL,
U_ID varchar(30) NOT NULL,
Report varchar(100),
constraint gtuid_pk PRIMARY KEY(G_ID,T_ID,U_ID),
constraint gid_tid_fk FOREIGN KEY (G_ID,T_ID) REFERENCES Group_Tasks (G_ID,Task_Name) ON DELETE CASCADE ON UPDATE CASCADE,
constraint tuid_fk_uid FOREIGN KEY (U_ID) REFERENCES Users (Username) ON DELETE CASCADE ON UPDATE CASCADE
);

