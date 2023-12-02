use BalkanID;

#Inserting into Group_Tasks#
INSERT INTO Group_Tasks (G_ID,Task_Name,Task_Lead_ID,Task_Desc,Task_Status)
VALUES ('Devops Team','Debugging','johnm3','Debug and Check for errors in developed codes','In Progress');

INSERT INTO Group_Tasks (G_ID,Task_Name,Task_Lead_ID,Task_Desc,Task_Status)
VALUES ('Management Team','Vendor Meeting','Avi','Prepare for negotiating with vendors','Completed');
INSERT INTO Group_Tasks (G_ID,Task_Name,Task_Lead_ID,Task_Desc,Task_Status)
VALUES ('Management Team','Annual Scrum','taylor13','Prepare Agenda for Annual Scrum','Open');

INSERT INTO Group_Tasks (G_ID,Task_Name,Task_Lead_ID,Task_Desc,Task_Status)
VALUES ('HR Team','Welcome Interns','sowmya1211','Welcome sessions with Interns 2023','Completed');
INSERT INTO Group_Tasks (G_ID,Task_Name,Task_Lead_ID,Task_Desc,Task_Status)
VALUES ('HR Team','Fun day','Abhi21','Plan for Friday FunDay 2023','On Hold');
INSERT INTO Group_Tasks (G_ID,Task_Name,Task_Lead_ID,Task_Desc,Task_Status)
VALUES ('HR Team','Review Work','karan02','Review other teams','Pending');

#Inserting into Group_User_Tasks#
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('Devops Team','johnm3','Debugging','');
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('Devops Team','sowmya1211','Debugging','Debugged 22 codes');
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('Devops Team','Shru23','Debugging','Too many errors');

INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('Management Team','Avi','Vendor Meeting','12 vendors - covered');
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('Management Team','sowmya1211','Vendor Meeting','satisfactory feedback');
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('Management Team','Shru23','Vendor Meeting','');

INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('Management Team','taylor13','Annual Scrum','45 guidelines - considered');
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('Management Team','johnm3','Annual Scrum','');

INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('HR Team','sowmya1211','Welcome Interns','125 interns welcomed');
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('HR Team','Shru23','Welcome Interns','Planned for 3 days');

INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('HR Team','Abhi21','Fun day','Put on hold due to availability');
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('HR Team','varsha21','Fun day','Not feasible for now');

INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('HR Team','karan02','Review Work','Across Depts and BUs');
INSERT INTO Group_User_Tasks (G_ID,U_ID,T_ID,Report)
VALUES ('HR Team','Avi','Review Work','Overall working - Good');