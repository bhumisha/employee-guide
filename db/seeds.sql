INSERT INTO Department 
(department)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal'),
('HR');


INSERT INTO Role_Detail (department_id, job_title, salary)
VALUES 
(1,'Sales Lead',120000),
(1,'Sales Person',80000),
(2,'Software Engineer',130000),
(2,'Lead Engineer',150000),
(3,'Accountant',124000),
(4,'Lawyer',150000),
(4,'Legal Team Lead',190000),
(5,'HR Manager',140000);

INSERT INTO Employee (first_name,last_name,role_id,manager_id)
VALUES 
('John','Mathew',4,null),
('Bhumisha','Dave',3,1),
('Tom','Allen',5,null),
('Andrew','David',6,3);


