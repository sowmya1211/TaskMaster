use BalkanID;

#Inserting into Users#
INSERT INTO Users (Username,Password,Fullname,Email_ID,User_Role)
VALUES ('sowmya1211','$2a$14$6DohD1gSqSU1gCJwmLhyIe00lsObPuXdJ9aLbsGDKpojnRwP4wEVe','Sowmya K','sowmyakannan2002@gmail.com','UR_1');
INSERT INTO Users (Username,Password,Fullname,Email_ID,User_Role)
VALUES ('karan02','$2a$14$AcBconG6kSlijDZNTCDyj.fGavaHzpmXRIc0N87y0C2hXwzHW1R8S','Karan S','karan@gmail.com','UR_2');
INSERT INTO Users (Username,Password,Fullname,Email_ID,User_Role)
VALUES ('johnm3','$2a$14$iJwAQUwjNe92xrtYEQJUceB0daLe.7WntWOI7ZrsX554tM3NGR2Fm','John M','john@gmail.com','UR_3');
INSERT INTO Users (Username,Password,Fullname,Email_ID,User_Role)
VALUES ('Shru23','$2a$14$Ae68XrTjWmrXkupQ8QrAWe601mzt6j/nFQAU1DRll8Be8ezfh2Lg.','Shruti','shruti@gmail.com','UR_2');

INSERT INTO Users (Username,Password,Fullname,Email_ID,User_Role)
VALUES ('Abhi21','$2a$14$yvnTHln2fHLkj8dUViMcsOkiDm9btsViBh4ManbCm.Fk0bZfq/D/C','Abhinav R','abh@gmail.com','UR_1');
INSERT INTO Users (Username,Password,Fullname,Email_ID,User_Role)
VALUES ('Avi','$2a$14$cipA22izS5we5iF6DFireenzH5s5F.l7MJI225KhyjO7rRH32Qkom','Avi Shah','avii@gmail.com','UR_2');
INSERT INTO Users (Username,Password,Fullname,Email_ID,User_Role)
VALUES ('taylor13','$2a$14$3PLAEiQWg924LeHy52/4i.DHCQ8c5gp2lY00/M2YLkaVfbD3ozuRi','Taylor S','taylors@gmail.com','UR_3');
INSERT INTO Users (Username,Password,Fullname,Email_ID,User_Role)
VALUES ('varsha21','$2a$14$BwgbGRpNbKHwZL4Iwm3spuYiZXQuo/FKm.YBg/Hgk7QnTfmbjFI7O','Varsha Singh','varshaa@gmail.com','UR_3');


#Inserting into Groups#
INSERT INTO Groups (Group_Name,Group_Admin_ID)
VALUES ('Devops Team','sowmya1211'); 
INSERT INTO Groups (Group_Name,Group_Admin_ID)
VALUES ('Management Team','Shru23'); 
INSERT INTO Groups (Group_Name,Group_Admin_ID)
VALUES ('HR Team','karan02'); 

#Inserting into User_Groups#
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Devops Team','sowmya1211','GR_1');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Devops Team','johnm3','GR_2');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Devops Team','karan02','GR_3');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Devops Team','taylor13','GR_3');

INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Management Team','Shru23','GR_1');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Management Team','Avi','GR_2');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Management Team','taylor13','GR_2');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Management Team','sowmya1211','GR_3');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('Management Team','johnm3','GR_3');

INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('HR Team','karan02','GR_1');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('HR Team','sowmya1211','GR_2');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('HR Team','Abhi21','GR_2');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('HR Team','Shru23','GR_3');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('HR Team','Avi','GR_3');
INSERT INTO User_Groups (G_ID,U_ID,Group_Role)
VALUES ('HR Team','varsha21','GR_3');