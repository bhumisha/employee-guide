SELECT emp.id,emp.first_name,emp.last_name,job_title,salary,department,
CONCAT(emp1.first_name ,' ', emp1.last_name) as Manager
FROM employee emp 
LEFT JOIN employee emp1 ON emp.reporting_to_id = emp1.id
INNER JOIN employeeRole ON emp.roleId = employeeRole.id
INNER JOIN department_detail ON employeeRole.departmentId = department_detail.id
ORDER BY  emp.id;

SELECT emp.id,emp.first_name,emp.last_name,department
FROM employee emp 
INNER JOIN employeeRole ON emp.roleId = employeeRole.id
INNER JOIN department_detail ON employeeRole.departmentId = department_detail.id
ORDER BY  emp.id;

SELECT emp.id,emp.first_name,emp.last_name,
CONCAT(emp1.first_name ,' ', emp1.last_name) as Manager
FROM employee emp 
LEFT JOIN employee emp1 ON emp.reporting_to_id = emp1.id
ORDER BY  emp.id;

SELECT * FROM department_detail;

SELECT empRole.id,department,job_title,salary 
FROM employeeRole empRole 
LEFT JOIN department_detail ON empRole.departmentId = department_detail.id;

